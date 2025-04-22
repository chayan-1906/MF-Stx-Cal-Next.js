import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomCode(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('6-digit OTP generated ✅:', otp);
  return otp;
}

export function isStringInvalid(text: string | undefined | null) {
  return !text || text.trim().length === 0 || text === 'undefined';
}

// makes first letter uppercase and rest lowercase
export function capitalize(text: string | undefined | null) {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// made sure first letters of all words are in uppercase, rest remains as it is
export function capitalizeFirst(text: string | undefined | null) {
  if (typeof text !== 'string') return '';
  return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}
