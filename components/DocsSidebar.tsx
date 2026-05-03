"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SidebarConfig } from "@/lib/sidebar-config";

type DocsSidebarProps = {
  config: SidebarConfig;
};

function groupItemsId(href: string) {
  return `docs-sidebar-group-${encodeURIComponent(href)
    .replace(/%/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

export function DocsSidebar({ config }: DocsSidebarProps) {
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
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {config.groups.length > 0 && (
          <>
            <div className="docs-sidebar-divider" />
            <div className="docs-sidebar-groups">
              {config.groups.map((group) => {
                const isCollapsed = Boolean(collapsed[group.title]);
                const itemsId = groupItemsId(group.href);

                return (
                  <div
                    key={group.title}
                    className={`docs-sidebar-group${
                      isCollapsed ? " collapsed" : ""
                    }`}
                  >
                    <div className="docs-sidebar-group-header">
                      <Link
                        href={group.href}
                        className={`docs-sidebar-group-title${
                          pathname === group.href ? " active" : ""
                        }`}
                        aria-current={pathname === group.href ? "page" : undefined}
                      >
                        {group.title}
                      </Link>
                      <button
                        type="button"
                        className="docs-sidebar-toggle"
                        onClick={() => toggleGroup(group.title)}
                        aria-controls={itemsId}
                        aria-expanded={!isCollapsed}
                        aria-label={`${isCollapsed ? "展开" : "折叠"} ${group.title}`}
                      >
                        <span className="docs-sidebar-arrow" aria-hidden="true">
                          &#9662;
                        </span>
                      </button>
                    </div>
                    <div className="docs-sidebar-group-items" id={itemsId}>
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`docs-sidebar-link${
                            pathname === item.href ? " active" : ""
                          }`}
                          aria-current={pathname === item.href ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
