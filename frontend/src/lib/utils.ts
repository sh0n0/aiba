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

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${T}${SnakeCase<U>}`
    : `${T}_${SnakeCase<Uncapitalize<U>>}`
  : S;

type KeysToSnakeCase<T> = T extends Array<infer U>
  ? Array<KeysToSnakeCase<U>> // 配列の場合、要素を変換
  : T extends object
    ? { [K in keyof T as SnakeCase<Extract<K, string>>]: KeysToSnakeCase<T[K]> }
    : T;

export function toSnakeCase<T>(obj: T): KeysToSnakeCase<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as KeysToSnakeCase<T>;
  }
  if (typeof obj === "object" && obj !== null) {
    const result = {} as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) as SnakeCase<typeof key>;
        const value = obj[key];
        result[newKey] = toSnakeCase(value);
      }
    }
    return result as KeysToSnakeCase<T>;
  }
  return obj as KeysToSnakeCase<T>;
}
