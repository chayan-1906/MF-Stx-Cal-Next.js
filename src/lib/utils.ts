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
