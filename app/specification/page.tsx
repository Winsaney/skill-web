import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getSidebarConfig } from "@/lib/sidebar-config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Skills 规范",
  description: "Agent Skills 的完整格式规范。"
};

export default async function SpecificationPage() {
  const sidebarConfig = await getSidebarConfig();

  return (
    <main className="docs-page">
      <div className="docs-layout">
        <DocsSidebar config={sidebarConfig} />

        <div className="docs-content">
          <article className="article-layout">
            <nav className="breadcrumb" aria-label="面包屑">
              <Link href="/">首页</Link>
              <span>Skills 规范</span>
            </nav>

            <header className="article-header">
              <h1>Skills 规范</h1>
              <p>Agent Skills 的完整格式规范。</p>
            </header>

            <div className="article-body">
              <section id="directory-structure">
                <h2>目录结构</h2>
                <p>
                  一个 Skill 是一个目录，至少包含一个
                  <code>SKILL.md</code> 文件：
                </p>
                <pre>
                  <code>{`skill-name/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档
├── assets/           # 可选：模板、资源
└── ...               # 任何其他文件或目录`}</code>
                </pre>
              </section>

              <section id="skill-md-format">
                <h2>SKILL.md 格式</h2>
                <p>
                  <code>SKILL.md</code> 文件必须包含 YAML
                  frontmatter，后跟 Markdown 内容。
                </p>

                <h3>Frontmatter</h3>
                <div className="notion-table-wrap">
                  <table className="notion-table">
                    <thead>
                      <tr>
                        <th>字段</th>
                        <th>必需</th>
                        <th>约束</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>name</code></td>
                        <td>是</td>
                        <td>最长 64 字符。仅允许小写字母、数字和连字符。</td>
                      </tr>
                      <tr>
                        <td><code>description</code></td>
                        <td>是</td>
                        <td>最长 1024 字符。描述 Skill 的功能和适用场景。</td>
                      </tr>
                      <tr>
                        <td><code>license</code></td>
                        <td>否</td>
                        <td>许可证名称或引用。</td>
                      </tr>
                      <tr>
                        <td><code>compatibility</code></td>
                        <td>否</td>
                        <td>最长 500 字符。环境要求。</td>
                      </tr>
                      <tr>
                        <td><code>metadata</code></td>
                        <td>否</td>
                        <td>任意键值映射。</td>
                      </tr>
                      <tr>
                        <td><code>allowed-tools</code></td>
                        <td>否</td>
                        <td>以空格分隔的预批准工具字符串。（实验性）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p><strong>最小示例：</strong></p>
                <pre>
                  <code>{`---
name: skill-name
description: 描述此 Skill 的功能和适用场景。
---`}</code>
                </pre>

                <p><strong>包含可选字段的示例：</strong></p>
                <pre>
                  <code>{`---
name: pdf-processing
description: 提取 PDF 文本、填写表单、合并文件。
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---`}</code>
                </pre>

                <h3><code>name</code> 字段</h3>
                <ul>
                  <li>必须为 1-64 个字符</li>
                  <li>仅可包含小写字母（<code>a-z</code>）和连字符（<code>-</code>）</li>
                  <li>不能以连字符开头或结尾</li>
                  <li>不能包含连续连字符（<code>--</code>）</li>
                  <li>必须与父目录名称匹配</li>
                </ul>

                <h3><code>description</code> 字段</h3>
                <ul>
                  <li>必须为 1-1024 个字符</li>
                  <li>应描述 Skill 的功能和适用场景</li>
                  <li>应包含帮助 Agent 识别相关任务的关键词</li>
                </ul>

                <h3><code>compatibility</code> 字段</h3>
                <p>仅在 Skill 有特定环境要求时才应包含：</p>
                <pre>
                  <code>{`compatibility: Designed for Claude Code (or similar products)
compatibility: Requires git, docker, jq, and access to the internet
compatibility: Requires Python 3.14+ and uv`}</code>
                </pre>

                <h3><code>metadata</code> 字段</h3>
                <p>从字符串键到字符串值的映射。建议使键名具有合理的唯一性以避免冲突。</p>
                <pre>
                  <code>{`metadata:
  author: example-org
  version: "1.0"`}</code>
                </pre>

                <h3><code>allowed-tools</code> 字段</h3>
                <p>以空格分隔的预批准工具字符串。实验性功能。</p>
                <pre>
                  <code>{`allowed-tools: Bash(git:*) Bash(jq:*) Read`}</code>
                </pre>
              </section>

              <section id="body-content">
                <h2>正文内容</h2>
                <p>
                  frontmatter 之后的 Markdown 正文包含 Skill
                  指令。没有格式限制。
                </p>
                <p>推荐包含：</p>
                <ul>
                  <li>分步指令</li>
                  <li>输入和输出示例</li>
                  <li>常见边缘情况</li>
                </ul>
                <p>
                  保持主 <code>SKILL.md</code> 在 500 行以内。将详细参考材料移到单独的文件中。
                </p>
              </section>

              <section id="optional-directories">
                <h2>可选目录</h2>

                <h3><code>scripts/</code></h3>
                <p>可执行代码。脚本应该自包含或明确记录依赖项，包含有用的错误消息。</p>

                <h3><code>references/</code></h3>
                <p>附加文档，按需加载：</p>
                <ul>
                  <li><code>REFERENCE.md</code> — 详细技术参考</li>
                  <li><code>FORMS.md</code> — 表单模板</li>
                  <li>领域特定文件（<code>finance.md</code>、<code>legal.md</code> 等）</li>
                </ul>

                <h3><code>assets/</code></h3>
                <p>静态资源：模板、图片、数据文件。</p>
              </section>

              <section id="progressive-disclosure">
                <h2>渐进式加载</h2>
                <p>Agent 渐进式加载 Skills：</p>
                <ol>
                  <li><strong>元数据</strong>（约 100 token）— 启动时加载 name 和 description</li>
                  <li><strong>指令</strong>（建议不超过 5,000 token）— 激活时加载完整 SKILL.md</li>
                  <li><strong>资源</strong>（按需）— 仅在需要时加载文件</li>
                </ol>
              </section>

              <section id="file-references">
                <h2>文件引用</h2>
                <p>使用从 Skill 根目录的相对路径，保持不超过一层深度。</p>
                <pre>
                  <code>{`See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py`}</code>
                </pre>
              </section>

              <section id="validation">
                <h2>验证</h2>
                <p>
                  使用
                  <a href="https://github.com/agentskills/agentskills/tree/main/skills-ref" target="_blank" rel="noreferrer">
                    skills-ref
                  </a>
                  参考库验证：
                </p>
                <pre><code>skills-ref validate ./my-skill</code></pre>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
