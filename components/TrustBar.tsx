import { clients } from "@/lib/clients-data";

const featured = clients.slice(0, 6);

export function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="trust-bar-inner">
        <p>已被主流 Agent 产品采用</p>
        <div className="trust-logos">
          {featured.map((client) => (
            <a
              key={client.name}
              href={client.url}
              className="trust-logo"
              target="_blank"
              rel="noreferrer"
            >
              <span className="trust-logo-icon">
                {client.name.slice(0, 1)}
              </span>
              {client.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
