export interface ShareItem {
  imageData: string;
  name: string;
  title: string;
  stack: string;
  createdAt: number;
}

// In-memory global store for share cards
const globalShareStore = new Map<string, ShareItem>();

export const shareStore = globalShareStore;
