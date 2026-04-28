import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-icon" aria-hidden="true">
        ?
      </div>
      <h1>页面没有找到</h1>
      <p>这个 Skill 可能还没有发布，或者链接已经变更。</p>
      <Link className="outline-button" href="/">
        返回首页
      </Link>
    </main>
  );
}
