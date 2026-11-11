import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** React 18 `fetchPriority`-г танихгүй тул HTML attribute-ийг шууд дамжуулна */
export const HIGH_FETCH_PRIORITY = { fetchpriority: "high" } as Record<string, string>;
