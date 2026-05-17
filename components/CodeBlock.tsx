"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <button
        aria-label="Copy code"
        className="copy-button"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  );
}
