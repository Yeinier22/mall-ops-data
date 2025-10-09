"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nContext';

export const LanguageToggle: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>{t('language')}:</span>
      <button onClick={() => setLang('en')} disabled={lang === 'en'}>
        {t('english')}
      </button>
      <button onClick={() => setLang('ar')} disabled={lang === 'ar'}>
        {t('arabic')}
      </button>
    </div>
  );
};
