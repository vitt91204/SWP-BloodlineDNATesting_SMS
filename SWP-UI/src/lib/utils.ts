import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hàm chuyển đổi loại thu mẫu sang tiếng Việt
export function translateCollectionType(type: string): string {
  switch ((type || '').toLowerCase()) {
    case 'at clinic':
      return 'Tại cơ sở';
    case 'at home':
      return 'Thu mẫu tại nhà';
    case 'self':
      return 'Tự thu mẫu';
    case 'diy_kit':
      return 'Bộ kit tự thu mẫu';
    default:
      return type || 'Không xác định';
  }
}
