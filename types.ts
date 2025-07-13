export interface User {
  email: string;
  username: string;
  dailyUnlocks: number;
  lastUnlockDate: string; // YYYY-MM-DD
  revealedBlocks: Set<number>;
}