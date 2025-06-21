import { type ClassValue } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  // Simple implementation without tailwind-merge dependency
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}
