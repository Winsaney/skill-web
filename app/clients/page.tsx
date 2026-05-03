import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getSidebarConfig } from "@/lib/sidebar-config";
import { clients } from "@/lib/clients-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Agent 工具",
  description: "支持 Agent Skills 格式的 AI Agent 产品列表。"
};

export default async function ClientsPage() {
  const sidebarConfig = await getSidebarConfig();

  return (
    <main className="docs-page">
      <div className="docs-layout">
        <DocsSidebar config={sidebarConfig} />

        <div className="docs-content">
          <article className="article-layout">
            <nav className="breadcrumb" aria-label="面包屑">
              <Link href="/">首页</Link>
              <span>Agent 工具</span>
            </nav>

            <header className="article-header">
              <h1>Agent 工具</h1>
              <p>支持 Agent Skills 格式的 AI Agent 产品。</p>
            </header>

            <div className="clients-grid">
              {clients.map((client) => (
                <div key={client.name} className="client-card">
                  <h3>
                    <a href={client.url} target="_blank" rel="noreferrer">
                      {client.name}
                    </a>
                  </h3>
                  <p>{client.description}</p>
                  {(client.instructionsUrl || client.sourceCodeUrl) && (
                    <div className="client-card-links">
                      {client.instructionsUrl && (
                        <a
                          href={client.instructionsUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          使用说明
                        </a>
                      )}
                      {client.sourceCodeUrl && (
                        <a
                          href={client.sourceCodeUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          源代码
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
