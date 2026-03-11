type LocaleConfig = {
  label: string;
  htmlLang: string;
  direction?: "ltr" | "rtl";
  path: string;
};

type LocaleEntry = {
  code: string;
  config: LocaleConfig;
};

const LOCALE_REGISTRY: LocaleEntry[] = [
  {
    code: "es",
    config: {
      label: "Español",
      htmlLang: "es",
      path: "es-spanish",
    },
  },
  {
    code: "ar",
    config: {
      label: "العربية",
      htmlLang: "ar",
      direction: "rtl",
      path: "ar-arabic",
    },
  },
  {
    code: "zh-CN",
    config: {
      label: "简体中文",
      htmlLang: "zh-CN",
      path: "zh-chinese",
    },
  },
];

type I18nConfig = {
  defaultLocale: string;
  locales: string[];
  localeConfigs: Record<string, LocaleConfig>;
};

/**
 * Generates a Docusaurus i18n config with human-readable directory names.
 * Starts with 4 locales: en, es, ar, zh-CN.
 */
export function defaultLocales(): I18nConfig {
  const localeConfigs: Record<string, LocaleConfig> = {};
  const locales: string[] = ["en"];

  for (const entry of LOCALE_REGISTRY) {
    locales.push(entry.code);
    localeConfigs[entry.code] = entry.config;
  }

  return {
    defaultLocale: "en",
    locales,
    localeConfigs,
  };
}
