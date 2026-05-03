import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getSidebarConfig } from "@/lib/sidebar-config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Agent Skills",
  description:
    "了解 Agent Skills — 一种轻量、开放的 AI Agent 能力扩展格式。",
  openGraph: {
    title: "Agent Skills",
    description: "了解 Agent Skills — 一种轻量、开放的 AI Agent 能力扩展格式。",
    images: ["/og-default.png"]
  }
};

export default async function Home() {
  const sidebarConfig = await getSidebarConfig();

  return (
    <main className="docs-page">
      <div className="docs-layout">
        <DocsSidebar config={sidebarConfig} />

        <div className="docs-content">
          <article className="article-layout">
            <header className="article-header">
              <h1>Agent Skills 概览</h1>
              <p>
                一种轻量、开放的格式，用于为 AI Agent
                提供专业知识和可复用工作流。
              </p>
            </header>

            <div className="article-body">
              <section id="what">
                <h2>什么是 Agent Skills？</h2>
                <p>
                  Agent Skills 是一种轻量、开放的格式，用于扩展 AI Agent
                  的能力，赋予其专业知识和工作流。
                </p>
                <p>
                  从根本上说，一个 Skill 就是一个包含
                  <code>SKILL.md</code> 文件的文件夹。该文件包含元数据（至少包含{" "}
                  <code>name</code> 和 <code>description</code>
                  ）以及告诉 Agent 如何执行特定任务的指令。Skills
                  还可以捆绑脚本、参考材料、模板和其他资源。
                </p>
                <pre>
                  <code>{`my-skill/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档
├── assets/           # 可选：模板、资源
└── ...               # 任何其他文件或目录`}</code>
                </pre>
              </section>

              <section id="why">
                <h2>为什么需要 Agent Skills？</h2>
                <p>
                  Agent
                  越来越强大，但往往缺乏可靠地完成实际工作所需的上下文。Skills
                  通过将程序化知识和公司、团队、用户特定的上下文打包成可移植的、版本控制的文件夹来解决这一问题，Agent
                  可以按需加载。这赋予了 Agent：
                </p>
                <ul>
                  <li>
                    <strong>领域专业知识</strong> —
                    将专业知识捕获为可复用的指令和资源。
                  </li>
                  <li>
                    <strong>可重复的工作流</strong> —
                    将多步骤任务转变为一致的、可审计的流程。
                  </li>
                  <li>
                    <strong>跨产品复用</strong> —
                    一次构建，到处使用。
                  </li>
                </ul>
              </section>

              <section id="how">
                <h2>Agent Skills 如何工作？</h2>
                <p>
                  Agent 通过
                  <strong>渐进式加载（Progressive Disclosure）</strong>
                  来加载 Skills，分三个阶段：
                </p>
                <ol>
                  <li>
                    <strong>发现</strong> —
                    启动时，Agent 仅加载每个可用 Skills 的名称和描述。
                  </li>
                  <li>
                    <strong>激活</strong> —
                    当任务匹配时，Agent 将完整的
                    <code>SKILL.md</code> 指令读入上下文。
                  </li>
                  <li>
                    <strong>执行</strong> — Agent
                    遵循指令，可选地执行捆绑的代码。
                  </li>
                </ol>
                <p>
                  完整指令仅在任务需要时加载，因此 Agent
                  可以保留许多 Skills，而仅占用很小的上下文开销。
                </p>
              </section>

              <section id="open">
                <h2>开放开发</h2>
                <p>
                  Agent Skills 格式最初由
                  <a
                    href="https://www.anthropic.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anthropic
                  </a>
                  开发，作为开放标准发布，已被越来越多的 Agent
                  产品采用。
                </p>
                <p>
                  欢迎在
                  <a
                    href="https://github.com/agentskills/agentskills"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                  或
                  <a
                    href="https://discord.gg/MKPE9g8aUy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discord
                  </a>
                  上参与讨论！
                </p>
              </section>

              <section id="get-started">
                <h2>开始使用</h2>
                <div className="article-actions">
                  <Link href="/specification">查看 Skills 规范</Link>
                  <Link href="/clients">查看 Agent 工具</Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
