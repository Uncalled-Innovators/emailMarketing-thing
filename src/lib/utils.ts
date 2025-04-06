import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteUrl() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this in production
    process.env.VERCEL_URL ?? // Automatically set by Vercel
    "http://localhost:3002";

  // Make sure to include `https://` when not localhost
  url = url.includes("http") ? url : `https://${url}`;

  // Make sure to include trailing `/`
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
}
