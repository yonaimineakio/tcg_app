import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
  

// クラス名をマージする関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}