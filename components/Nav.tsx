import Link from "next/link";

export function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          Agent Skills
        </Link>
        <div className="nav-links">
          <Link href="/#skills">Skills</Link>
          <Link href="/#about">关于</Link>
        </div>
      </nav>
    </header>
  );
}
