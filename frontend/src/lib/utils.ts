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

export function convertToFormData(base64Image: string, propertyName: string, fileName: string) {
  const formData = new FormData();
  const byteString = atob(base64Image.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  formData.append(propertyName, blob, fileName);

  return formData;
}
