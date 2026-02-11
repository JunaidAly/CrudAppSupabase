export const locales = ["en", "ur"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
