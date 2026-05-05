import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavCta, NavHomeLinks } from "@/components/NavCta";

export function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          <span className="brand-mark">A</span>
          <span>Agent Skills</span>
        </Link>

        <NavHomeLinks />

        <div className="nav-right">
          <ThemeToggle />
          <NavCta />
        </div>
      </nav>
    </header>
  );
}
