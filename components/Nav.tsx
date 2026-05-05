import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavCta, NavHomeLinks } from "@/components/NavCta";

export function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          <Image src="/red-panda.png" alt="" width={28} height={28} />
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
