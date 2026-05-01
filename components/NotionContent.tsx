/* eslint-disable @next/next/no-img-element */
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ReactNode } from "react";
import {
  sectionIdFromBlock,
  sectionIdFromIndex
} from "@/lib/skill-navigation";
import type { NotionBlock, SkillContentSection } from "@/types";

function plainText(items: RichTextItemResponse[]) {
  return items.map((item) => item.plain_text).join("");
}

function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((item, index) => {
        const classes = [
          item.annotations.bold ? "rt-bold" : "",
          item.annotations.italic ? "rt-italic" : "",
          item.annotations.strikethrough ? "rt-strike" : "",
          item.annotations.underline ? "rt-underline" : "",
          item.annotations.code ? "rt-code" : ""
        ]
          .filter(Boolean)
          .join(" ");
        const key = `${item.plain_text}-${index}`;

        if (item.href) {
          return (
            <a className={classes} href={item.href} key={key} rel="noreferrer" target="_blank">
              {item.plain_text}
            </a>
          );
        }

        return (
          <span className={classes || undefined} key={key}>
            {item.plain_text}
          </span>
        );
      })}
    </>
  );
}

function blockRichText(block: NotionBlock): RichTextItemResponse[] {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text;
    case "heading_1":
      return block.heading_1.rich_text;
    case "heading_2":
      return block.heading_2.rich_text;
    case "heading_3":
      return block.heading_3.rich_text;
    case "bulleted_list_item":
      return block.bulleted_list_item.rich_text;
    case "numbered_list_item":
      return block.numbered_list_item.rich_text;
    case "quote":
      return block.quote.rich_text;
    case "to_do":
      return block.to_do.rich_text;
    case "toggle":
      return block.toggle.rich_text;
    case "callout":
      return block.callout.rich_text;
    default:
      return [];
  }
}

function ExternalImage({ block }: { block: Extract<NotionBlock, { type: "image" }> }) {
  const image = block.image;
  const src = image.type === "file" ? image.file.url : image.external.url;

  return (
    <figure className="notion-image">
      <img alt={plainText(image.caption) || ""} src={src} loading="lazy" />
      {image.caption.length > 0 ? (
        <figcaption>
          <RichText items={image.caption} />
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderBlock(block: NotionBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block.id}>
          <RichText items={block.paragraph.rich_text} />
          <NestedBlocks blocks={block.children} />
        </p>
      );
    case "heading_1":
      return (
        <h2 id={sectionIdFromBlock(block)} key={block.id}>
          <RichText items={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h2 id={sectionIdFromBlock(block)} key={block.id}>
          <RichText items={block.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 id={sectionIdFromBlock(block)} key={block.id}>
          <RichText items={block.heading_3.rich_text} />
        </h3>
      );
    case "quote":
      return (
        <blockquote key={block.id}>
          <RichText items={block.quote.rich_text} />
          <NestedBlocks blocks={block.children} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="notion-callout" key={block.id}>
          <RichText items={block.callout.rich_text} />
          <NestedBlocks blocks={block.children} />
        </div>
      );
    case "code":
      return (
        <pre key={block.id}>
          <code>{plainText(block.code.rich_text)}</code>
        </pre>
      );
    case "divider":
      return <hr key={block.id} />;
    case "image":
      return <ExternalImage block={block} key={block.id} />;
    case "to_do":
      return (
        <label className="notion-todo" key={block.id}>
          <input checked={block.to_do.checked} readOnly type="checkbox" />
          <span>
            <RichText items={block.to_do.rich_text} />
          </span>
        </label>
      );
    case "toggle":
      return (
        <details key={block.id}>
          <summary>
            <RichText items={block.toggle.rich_text} />
          </summary>
          <NestedBlocks blocks={block.children} />
        </details>
      );
    default:
      return null;
  }
}

function listItem(block: NotionBlock) {
  return (
    <li key={block.id}>
      <RichText items={blockRichText(block)} />
      <NestedBlocks blocks={block.children} />
    </li>
  );
}

function NotionBlockList({ blocks }: { blocks: NotionBlock[] }) {
  const nodes: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];

      while (blocks[index]?.type === "bulleted_list_item") {
        items.push(blocks[index]);
        index += 1;
      }

      index -= 1;
      nodes.push(<ul key={items[0].id}>{items.map(listItem)}</ul>);
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];

      while (blocks[index]?.type === "numbered_list_item") {
        items.push(blocks[index]);
        index += 1;
      }

      index -= 1;
      nodes.push(<ol key={items[0].id}>{items.map(listItem)}</ol>);
      continue;
    }

    nodes.push(renderBlock(block));
  }

  return <>{nodes}</>;
}

function NestedBlocks({ blocks }: { blocks?: NotionBlock[] }) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="notion-nested">
      <NotionBlockList blocks={blocks} />
    </div>
  );
}

export function NotionContent({
  blocks,
  fallbackSections
}: {
  blocks?: NotionBlock[] | null;
  fallbackSections?: SkillContentSection[];
}) {
  if (blocks) {
    return (
      <div className="article-body notion-blocks">
        {blocks.length > 0 ? (
          <NotionBlockList blocks={blocks} />
        ) : (
          <p className="muted-copy">这篇 Skill 暂时还没有正文。</p>
        )}
      </div>
    );
  }

  return (
    <div className="article-body">
      {(fallbackSections ?? []).map((section, index) => (
        <section
          id={sectionIdFromIndex(index)}
          key={`${section.title}-${index}`}
        >
          <h2>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.code ? <pre><code>{section.code}</code></pre> : null}
        </section>
      ))}
    </div>
  );
}
