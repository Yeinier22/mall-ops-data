"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';
import { dict, Lang } from './dictionary';

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');
  const value = useMemo<I18nCtx>(() => ({
    lang,
    setLang,
    t: (key) => dict[lang][key] ?? key,
  }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
