import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMg(value: number): string {
  return `${Math.round(value)}mg`
}

export function formatG(value: number): string {
  return `${value.toFixed(1)}g`
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
