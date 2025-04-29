"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Locale, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LocaleToggle() {
  const locale = useLocale();

  const router = useRouter();

  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    router.replace({ pathname }, { locale: nextLocale as Locale });
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
