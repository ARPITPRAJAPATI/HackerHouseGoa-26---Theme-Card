export const BUILDER_CLASSES = [
  "Terminal Surfer",
  "Cache Raider",
  "Wave Rider",
  "Coconut Courier",
  "Harbor Hopper",
  "Night Champion",
  "Comfort Coder"
];

export const BUILDER_CLASS_STICKERS = {
  "Terminal Surfer": "/stickers/terminal-surfer.png",
  "Cache Raider": "/stickers/cache-raider.png",
  "Wave Rider": "/stickers/wave-rider.png",
  "Coconut Courier": "/stickers/coconut-courier.png",
  "Harbor Hopper": "/stickers/harbor-hopper.png",
  "Night Champion": "/stickers/night-champion.png",
  "Comfort Coder": "/stickers/comfort-coder.png"
};

export const BEACH_BAG_SETS = [
  ["☕ Coffee", "💻 VS Code", "🎧 Lo-Fi Beats"],
  ["🥥 Coconut", "⚡ Cursor", "🤖 ChatGPT"],
  ["🍕 Pizza", "⚛️ React", "🔥 Firebase"],
  ["🍹 Feni", "🦀 Rust", "⚡ WebAssembly"],
  ["🌊 Surfboard", "🐍 Python", "🧠 PyTorch"],
  ["🥭 Mango Juice", "🎨 Figma", "✨ Tailwind"],
  ["🕶️ Sunglasses", "🚀 Next.js", "🗄️ Supabase"],
  ["🎧 Headphones", "🛠️ Neovim", "🛜 Starlink"]
];

export const CURRENTLY_SHIPPING = [
  "Building the Future",
  "One More Commit",
  "Deploying Dreams",
  "Hack First",
  "Launch Mode",
  "Making AI Weird",
  "Open Source",
  "Prototype Ready",
  "Sleeping Tomorrow"
];

export function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateBuilderId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#HH-GOA-${randomNum}`;
}

export function getStickerUrlForBuilderClass(builderClass) {
  return BUILDER_CLASS_STICKERS[builderClass] || "/stickers/terminal-surfer.png";
}

export function generateRandomAttributes() {
  const builderClass = getRandomElement(BUILDER_CLASSES);
  return {
    builderClass,
    stickerUrl: getStickerUrlForBuilderClass(builderClass),
    beachBag: getRandomElement(BEACH_BAG_SETS),
    currentlyShipping: getRandomElement(CURRENTLY_SHIPPING),
    builderId: generateBuilderId()
  };
}
