import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  console.log('random token generated ✅:', token);
  return token;
}
