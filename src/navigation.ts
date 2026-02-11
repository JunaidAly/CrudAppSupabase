import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "@/i18n";

export const { Link, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: "always",
});
