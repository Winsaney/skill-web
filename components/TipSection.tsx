"use client";

import { useState } from "react";

type TipSectionProps = {
  qrUrl: string;
  text: string;
};

export function TipSection({ qrUrl, text }: TipSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="tip-section-wrapper">
      <div className="tip-section">
        <p className="tip-section-cta">{text}</p>
        <button
          className={`tip-section-btn${expanded ? " is-expanded" : ""}`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起" : "请喝奶茶"}{" "}
          <img className="tip-section-emoji" src="/蜜雪冰城.png" alt="🧋" />
        </button>

        <div className={`tip-section-expand${expanded ? " is-open" : ""}`}>
          <div className="tip-section-expand-inner">
            <img src={qrUrl} alt="微信收款码" />
            <span className="tip-section-scan-hint">微信扫码支持</span>
          </div>
        </div>
      </div>
    </div>
  );
}
