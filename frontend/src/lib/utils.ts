import { useAppStore } from "@/store/store.ts";
import { redirect } from "@tanstack/react-router";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToLoginIfUnauthorized() {
  const accessToken = useAppStore.getState().accessToken;
  if (!accessToken) {
    throw redirect({
      to: "/login",
    });
  }
}
