import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn/ui class helper (AGENT.md §3). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
