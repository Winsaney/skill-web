export interface Client {
  name: string;
  description: string;
  url: string;
  instructionsUrl?: string;
  sourceCodeUrl?: string;
  logoDir?: string;
}

export const clients: Client[] = [
  {
    name: "Gemini CLI",
    description:
      "Gemini CLI is an open-source AI agent that brings the power of Gemini directly into your terminal.",
    url: "https://geminicli.com",
    instructionsUrl: "https://geminicli.com/docs/cli/skills/",
    sourceCodeUrl: "https://github.com/google-gemini/gemini-cli",
    logoDir: "/images/logos/gemini-cli",
  },
  {
    name: "OpenCode",
    description:
      "OpenCode is an open source agent that helps you write code in your terminal, IDE, or desktop.",
    url: "https://opencode.ai/",
    instructionsUrl: "https://opencode.ai/docs/skills/",
    sourceCodeUrl: "https://github.com/sst/opencode",
    logoDir: "/images/logos/opencode",
  },
  {
    name: "Cursor",
    description:
      "Cursor is an AI editor and coding agent. Use it to understand your codebase, plan and build features, fix bugs, review changes, and work with the tools you already use.",
    url: "https://cursor.com/",
    instructionsUrl: "https://cursor.com/docs/context/skills",
    logoDir: "/images/logos/cursor",
  },
  {
    name: "Claude Code",
    description:
      "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser.",
    url: "https://claude.ai/code",
    instructionsUrl: "https://code.claude.com/docs/en/skills",
    logoDir: "/images/logos/claude-code",
  },
  {
    name: "Claude",
    description:
      "Claude is Anthropic's AI, built for problem solvers. Tackle complex challenges, analyze data, write code, and think through your hardest work.",
    url: "https://claude.ai/",
    instructionsUrl:
      "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
    logoDir: "/images/logos/claude-ai",
  },
  {
    name: "OpenAI Codex",
    description:
      "Codex is OpenAI's coding agent for software development.",
    url: "https://developers.openai.com/codex",
    instructionsUrl: "https://developers.openai.com/codex/skills/",
    sourceCodeUrl: "https://github.com/openai/codex",
    logoDir: "/images/logos/oai-codex",
  },
  {
    name: "TRAE",
    description:
      "Trae is an adaptive AI IDE that transforms how you work, collaborating with you to run faster.",
    url: "https://trae.ai/",
    instructionsUrl: "https://www.trae.ai/blog/trae_tutorial_0115",
    sourceCodeUrl: "https://github.com/bytedance/trae-agent",
    logoDir: "/images/logos/trae",
  },
  {
    name: "Kiro",
    description:
      "Kiro helps you do your best work by bringing structure to AI coding with spec-driven development.",
    url: "https://kiro.dev/",
    instructionsUrl: "https://kiro.dev/docs/skills/",
    logoDir: "/images/logos/kiro",
  },
];
