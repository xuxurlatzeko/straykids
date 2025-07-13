export interface RevealData {
  username: string;
  profileUrl?: string;
}

export interface User {
  email: string;
  username: string;
  profileUrl?: string;
  dailyUnlocks: number;
  lastUnlockDate: string; // YYYY-MM-DD
  revealedBlocks: Set<number>;
}
