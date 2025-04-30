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

export function isListEmpty(list: any) {
  return !list || list.length === 0;
}

export function getOrdinal(n: number | null | undefined): string {
  if (!n) return '';
  if (n <= 0 || n > 31) throw new Error('Number out of range (1-31)');
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  const suffix = (n % 10 === 1) ? 'st' :
      (n % 10 === 2) ? 'nd' :
          (n % 10 === 3) ? 'rd' : 'th';
  return `${n}${suffix}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}


/** storage functions */
export function transformMfFund(doc: any) {
  const {_id, __v, ...rest} = doc;
  return {
    ...rest,
    mfFundId: _id?.toString(),
    userId: doc.userId?.toString(),
  };
}

export function transformMfSip(doc: any) {
  const {_id, __v, ...rest} = doc;
  return {
    ...rest,
    userId: doc.userId?.toString(),
    mfFundId: doc.mfFundId?.toString(),
    mfSipId: _id?.toString(),
  };
}

export function flattenMfSip(item: any): any {
  const fund = item.mfFundId || {};
  return {
    ...item,
    mfFundId: fund._id?.toString?.() || fund.toString?.() || '',
    fundName: fund.fundName ?? '',
    schemeName: fund.schemeName ?? '',
    folioNo: fund.folioNo ?? '',
    category: fund.category ?? '',
  };
}
