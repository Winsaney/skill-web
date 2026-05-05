import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-deco hero-deco-ring" aria-hidden="true" />
      <div className="hero-deco hero-deco-diamond" aria-hidden="true" />
      <div className="hero-deco hero-deco-dots" aria-hidden="true" />
      <div className="hero-deco hero-deco-line" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          开放标准 · 持续更新
        </div>

        <h1>
          为 AI Agent
          <br />
          注入 <em>专业能力</em>
        </h1>

        <p className="hero-subtitle">
          Agent Skills
          是一种轻量、开放的格式——将领域知识与工作流打包成可复用的能力模块，让
          Agent 真正解决实际问题。
        </p>

        <div className="hero-actions">
          <Link href="#skills" className="btn-primary">
            浏览 Skills 库
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
          <Link href="#how" className="btn-secondary">
            了解工作原理
          </Link>
        </div>

        <div className="hero-code">
          <div className="hero-code-bar">
            <span className="hero-code-dot" />
            <span className="hero-code-dot" />
            <span className="hero-code-dot" />
            <span className="hero-code-filename">SKILL.md</span>
          </div>
          <pre>
            <code>
              <span className="cmt">---</span>
              {"\n"}
              <span className="prop">name</span>: pdf-processing
              {"\n"}
              <span className="prop">description</span>:{" "}
              <span className="str">提取 PDF 文本、填写表单、合并文件</span>
              {"\n"}
              <span className="cmt">---</span>
              {"\n\n"}
              <span className="kw">## 指令</span>
              {"\n"}1. 接收用户上传的 PDF 文件
              {"\n"}2. 使用脚本提取文本内容
              {"\n"}3. 按需合并或拆分文档
              {"\n"}4. 返回处理结果
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
