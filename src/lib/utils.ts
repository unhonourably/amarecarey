import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function createSlug(firstName: string, lastName: string): string {
  return `${normalizeName(firstName)}-${normalizeName(lastName)}`
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CENTRAL_TIME_ZONE = "America/Chicago";

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateCentral(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const dateText = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const zone =
    new Intl.DateTimeFormat("en-US", {
      timeZone: CENTRAL_TIME_ZONE,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "CST";
  return `${dateText} ${zone}`;
}

export function formatNoteRecordTimestamps(createdAt: string, updatedAt: string) {
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  const edited = updated - created > 60_000;

  if (edited) {
    return {
      updatedLabel: "Updated",
      updatedAt,
      createdLabel: "Written",
      createdAt,
    };
  }

  return {
    updatedLabel: "Published",
    updatedAt,
    createdAt: null as string | null,
    createdLabel: null as string | null,
  };
}
