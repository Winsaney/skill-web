"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarId = "docs-sidebar-navigation";

  const currentTitle = useMemo(() => {
    const directLink = config.links.find((link) => link.href === pathname);
    if (directLink) return directLink.label;

    for (const group of config.groups) {
      if (group.href === pathname) return group.title;

      const item = group.items.find((groupItem) => groupItem.href === pathname);
      if (item) return item.label;
    }

    return "导航目录";
  }, [config, pathname]);

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar, pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const wideLayoutQuery = window.matchMedia("(min-width: 1100px)");

    function handleLayoutChange() {
      if (wideLayoutQuery.matches) {
        closeSidebar();
      }
    }

    handleLayoutChange();
    wideLayoutQuery.addEventListener("change", handleLayoutChange);

    return () => {
      wideLayoutQuery.removeEventListener("change", handleLayoutChange);
    };
  }, [closeSidebar]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar, isSidebarOpen]);

  return (
    <>
      <button
        type="button"
        className="docs-mobile-sidebar-trigger"
        aria-controls={sidebarId}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={22} aria-hidden="true" />
        <span>{currentTitle}</span>
      </button>

      <button
        type="button"
        className={`docs-sidebar-backdrop${isSidebarOpen ? " open" : ""}`}
        aria-label="关闭导航"
        onClick={closeSidebar}
      />

      <aside
        className={`docs-sidebar${isSidebarOpen ? " open" : ""}`}
        id={sidebarId}
      >
        <div className="docs-sidebar-mobile-header">
          <Link className="brand" href="/" onClick={closeSidebar}>
            Agent Skills
          </Link>
          <button
            type="button"
            className="docs-sidebar-close"
            aria-label="关闭导航"
            onClick={closeSidebar}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

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
                onClick={closeSidebar}
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
                          onClick={closeSidebar}
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
                            onClick={closeSidebar}
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
    </>
  );
}
