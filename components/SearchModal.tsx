"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition
} from "react";
import type { SearchResult } from "@/app/api/search/route";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return <span className="search-result-category">{category}</span>;
}

function ResultIcon({ result }: { result: SearchResult }) {
  if (result.type === "doc") {
    return (
      <span className="search-result-icon search-result-icon--doc" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </span>
    );
  }
  if (result.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={result.icon}
        alt=""
        className="search-result-icon search-result-icon--img"
      />
    );
  }
  return (
    <span className="search-result-icon search-result-icon--skill" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </span>
  );
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogFrameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Sync open/close with native dialog showModal()/close()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.setAttribute("data-search-modal-open", "");
      }
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      // Slight delay so the dialog animates in before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.removeAttribute("data-search-modal-open");
    }
  }, [isOpen]);

  // Close on pathname change (link navigation)
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Native dialog fires 'close' event on ESC — sync back to React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleDialogClose = () => onClose();
    dialog.addEventListener("close", handleDialogClose);
    return () => dialog.removeEventListener("close", handleDialogClose);
  }, [onClose]);

  // Click outside dialogFrame closes modal (Starlight pattern)
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const frame = dialogFrameRef.current;
      const isLink = "href" in (e.target || {});
      if (isLink || (frame && !frame.contains(e.target as Node))) {
        onClose();
      }
    };

    // Add on next tick so the open-click doesn't immediately close
    const timer = setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      search(val);
    },
    [search]
  );

  // Keyboard navigation within results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!results.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const active = results[activeIndex];
        if (active) {
          startTransition(() => router.push(active.href));
          onClose();
        }
      }
    },
    [results, activeIndex, router, onClose]
  );

  // Scroll active result into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    /* Native <dialog> — browser handles: ESC close, focus trap, ::backdrop, aria */
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-label="搜索"
    >
      <div ref={dialogFrameRef} className="search-dialog-frame">
        {/* Mobile cancel button (Starlight pattern) */}
        <button
          type="button"
          className="search-cancel-btn"
          onClick={onClose}
        >
          取消
        </button>

        {/* Input row */}
        <div className="search-input-row">
          <span className="search-input-icon" aria-hidden="true">
            {isLoading ? (
              <svg className="search-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </span>
          <input
            ref={inputRef}
            id="search-input"
            className="search-input"
            type="search"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="搜索 Skills、文档……"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={
              results.length > 0 ? `search-result-${activeIndex}` : undefined
            }
          />
          <button
            type="button"
            className="search-close-btn"
            aria-label="关闭搜索"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="search-results-wrap">
            {results.length > 0 ? (
              <>
                <div className="search-results-header">
                  <span>{results.length} 个结果</span>
                </div>
                <ul
                  id="search-results"
                  ref={listRef}
                  className="search-results-list"
                  role="listbox"
                  aria-label="搜索结果"
                >
                  {results.map((result, index) => (
                    <li
                      key={result.href}
                      id={`search-result-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <Link
                        href={result.href}
                        className={`search-result-item${index === activeIndex ? " active" : ""}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <ResultIcon result={result} />
                        <div className="search-result-text">
                          <span className="search-result-title">
                            {highlight(result.title, query)}
                          </span>
                          <span className="search-result-desc">
                            {highlight(result.description, query)}
                          </span>
                        </div>
                        <CategoryBadge category={result.category} />
                        <span className="search-result-arrow" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : !isLoading ? (
              <div className="search-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>没有找到 &ldquo;{query}&rdquo; 相关内容</p>
                <span>试着换个关键词搜索</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Footer hint — only when no query */}
        {!query.trim() && (
          <div className="search-footer">
            <span className="search-hint-item">
              <kbd>↑</kbd><kbd>↓</kbd> 导航
            </span>
            <span className="search-hint-item">
              <kbd>Enter</kbd> 打开
            </span>
            <span className="search-hint-item">
              <kbd>ESC</kbd> 关闭
            </span>
          </div>
        )}
      </div>
    </dialog>
  );
}
