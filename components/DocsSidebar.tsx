"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SidebarConfig } from "@/lib/sidebar-config";

export function DocsSidebar({ config }: { config: SidebarConfig }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-inner">
        <nav className="docs-sidebar-links">
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`docs-sidebar-link${
                pathname === link.href ? " active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {config.groups.length > 0 && (
          <>
            <div className="docs-sidebar-divider" />
            <div className="docs-sidebar-groups">
              {config.groups.map((group) => (
                <div
                  key={group.title}
                  className={`docs-sidebar-group${
                    collapsed[group.title] ? " collapsed" : ""
                  }`}
                >
                  <div className="docs-sidebar-group-header">
                    <Link
                      href={group.href}
                      className={`docs-sidebar-group-title${
                        pathname === group.href ? " active" : ""
                      }`}
                    >
                      {group.title}
                    </Link>
                    <button
                      type="button"
                      className="docs-sidebar-toggle"
                      onClick={() => toggleGroup(group.title)}
                      aria-label={`展开或折叠 ${group.title}`}
                    >
                      <span className="docs-sidebar-arrow">&#9662;</span>
                    </button>
                  </div>
                  <div className="docs-sidebar-group-items">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`docs-sidebar-link${
                          pathname === item.href ? " active" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
