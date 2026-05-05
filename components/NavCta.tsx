"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavHomeLinks() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div className="nav-center">
      <a href="/#how">工作原理</a>
      <a href="/#skills">Skills</a>
      <Link href="/specification">规范</Link>
    </div>
  );
}

export function NavCta() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <a href="/#cta" className="nav-cta">
      开始使用
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
    </a>
  );
}
