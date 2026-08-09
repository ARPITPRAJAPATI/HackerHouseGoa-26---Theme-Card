// Procedural "Builder Title" engine.
// Maps stack/role keywords to a curated set of on-brand titles.
// Falls back to a solid generic pool if no keyword matches, and supports
// re-rolling by returning a different match each call via a seeded index.

type TitleEntry = { keywords: string[]; titles: string[] };

const TITLE_MAP: TitleEntry[] = [
  {
    keywords: ["solidity", "evm", "smart contract"],
    titles: ["Protocol Alchemist", "Bytecode Priest", "Gas Whisperer"],
  },
  {
    keywords: ["zk", "zero knowledge", "zero-knowledge", "snark", "stark"],
    titles: ["Zero-Knowledge Phantom", "Proof Smith", "Circuit Cryptic"],
  },
  {
    keywords: ["rust"],
    titles: ["Systems Berserker", "Borrow Checker Tamer", "Memory Monk"],
  },
  {
    keywords: ["ai", "ml", "machine learning", "llm", "genai"],
    titles: ["Neural Architect", "Latent Space Cartographer", "Weight Whisperer"],
  },
  {
    keywords: ["pytorch", "tensorflow", "cuda", "gpu"],
    titles: ["Weights Weaver", "Gradient Sailor", "Tensor Tide-Rider"],
  },
  {
    keywords: ["react", "next", "frontend", "typescript", "javascript"],
    titles: ["Interface Virtuoso", "Render Cycle Renegade", "Component Corsair"],
  },
  {
    keywords: ["design", "figma", "ui", "ux"],
    titles: ["Pixel Tidecaller", "Interface Virtuoso", "Signal Stylist"],
  },
  {
    keywords: ["backend", "node", "api", "server"],
    titles: ["Endpoint Engineer", "Latency Slayer", "Uptime Loyalist"],
  },
  {
    keywords: ["devops", "kubernetes", "docker", "terraform", "aws", "cloud", "infra"],
    titles: ["Infra Tidewright", "Cluster Commander", "Deploy Day Believer"],
  },
  {
    keywords: ["web3", "crypto", "blockchain", "defi"],
    titles: ["Chain Whisperer", "Ledger Loyalist", "Onchain Oracle"],
  },
  {
    keywords: ["data", "sql", "postgres", "database"],
    titles: ["Schema Shaper", "Query Tide-Turner", "Index Instigator"],
  },
  {
    keywords: ["product", "pm", "growth"],
    titles: ["Signal Strategist", "Roadmap Rebel", "Launch Day Lifer"],
  },
  {
    keywords: ["security", "hacking", "pentest", "cyber"],
    titles: ["Threat Tidewatcher", "Exploit Exorcist", "Perimeter Phantom"],
  },
];

const FALLBACK_TITLES = [
  "Genesis Day Builder",
  "Signal in the Noise",
  "Terminal Native",
  "Sand & Circuit Operator",
  "Ship-or-Ship Believer",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateBuilderTitle(stackInput: string, reroll = 0): string {
  const normalized = stackInput.toLowerCase();
  const matches: string[] = [];

  for (const entry of TITLE_MAP) {
    if (entry.keywords.some((k) => normalized.includes(k))) {
      matches.push(...entry.titles);
    }
  }

  const pool = matches.length > 0 ? matches : FALLBACK_TITLES;
  const seed = hashString(stackInput || "builder") + reroll;
  return pool[seed % pool.length];
}
