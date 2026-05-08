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
              {client.logoDir ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${client.logoDir}/light.svg`}
                    alt={client.name}
                    className="trust-logo-light"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${client.logoDir}/dark.svg`}
                    alt={client.name}
                    className="trust-logo-dark"
                  />
                </>
              ) : (
                <span>{client.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
