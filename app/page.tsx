import Link from "next/link";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getPublishedSkills } from "@/lib/notion";
import { clients } from "@/lib/clients-data";

export const revalidate = 3600;

export default async function Home() {
  const skills = await getPublishedSkills();

  const categories = Array.from(
    new Set(skills.map((s) => s.category).filter(Boolean))
  ).sort() as string[];

  const skillCount = skills.length;
  const categoryCount = categories.length;
  const clientCount = clients.length;

  return (
    <>
      <Hero />

      <TrustBar />

      {/* How It Works */}
      <section className="how-section" id="how">
        <div className="section-inner">
          <p className="section-kicker">工作原理</p>
          <h2 className="section-title">渐进式加载，按需激活</h2>
          <p className="section-desc">
            Agent
            不需要预先加载所有知识。Skills
            通过三阶段渐进式加载，在保留大量能力的同时占用极小的上下文窗口。
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>发现</h3>
              <p>启动时仅加载每个 Skill 的名称与描述，成本约 100 token</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>激活</h3>
              <p>当任务匹配时，将完整的 SKILL.md 指令读入上下文</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>执行</h3>
              <p>Agent 遵循指令，可选地执行捆绑的脚本与代码</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="landing-skills" id="skills">
        <div className="section-inner">
          <div className="landing-skills-header">
            <div>
              <p className="section-kicker">Skills 库</p>
              <h2 className="section-title">覆盖核心工作场景</h2>
            </div>
            <Link href="/category/产品经理" className="landing-skills-link">
              查看全部
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <CategoryFilter skills={skills} categories={categories} />
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">
              {skillCount}
              <span className="accent">+</span>
            </div>
            <div className="stat-label">已发布 Skills</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{categoryCount}</div>
            <div className="stat-label">覆盖领域</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{clientCount}</div>
            <div className="stat-label">Agent 工具支持</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <span className="accent">&lt;</span>500
            </div>
            <div className="stat-label">token / Skill 指令</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <p className="section-kicker">开始使用</p>
        <h2>
          构建你的第一个
          <br />
          <em>Agent Skill</em>
        </h2>
        <p>
          只需一个 SKILL.md
          文件就能开始。开源格式，即写即用，被越来越多的 Agent 产品原生支持。
        </p>
        <div className="cta-actions">
          <Link href="/specification" className="btn-primary">
            查看 Skills 规范
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <a
            href="https://xhslink.com/m/9H2ARGAntEt"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            小红书图文
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 6v6H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div className="cta-links">
          <a
            href="https://xhslink.com/m/9H2ARGAntEt"
            target="_blank"
            rel="noreferrer"
          >
            小红书图文
          </a>
          <Link href="/clients">Agent 工具列表</Link>
        </div>
      </section>
    </>
  );
}
