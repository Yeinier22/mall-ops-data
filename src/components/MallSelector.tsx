"use client";
import React from 'react';
import { Mall } from '@/types';
import { useI18n } from '@/i18n/I18nContext';

export const MallSelector: React.FC<{
  malls: Mall[];
  value?: string;
  onChange: (id: string) => void;
}> = ({ malls, value, onChange }) => {
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} dir={dir}>
      <label style={{ minWidth: 120 }}>{t('mallSelector')}</label>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {malls.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
};
