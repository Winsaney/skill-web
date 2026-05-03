import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          Agent Skills
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
