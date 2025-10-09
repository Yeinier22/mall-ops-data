"use client";
import React from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { LanguageToggle } from './LanguageToggle';

export const LayoutShell: React.FC<{
  children: React.ReactNode;
  mock?: boolean;
  onSourceChange?: (useMock: boolean) => void;
  canUseSupabase?: boolean;
}>=({ children, mock, onSourceChange, canUseSupabase })=>{
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontFamily = lang === 'ar' ? 'Tahoma, Arial, sans-serif' : 'Inter, Arial, sans-serif';
  return (
    <div dir={dir} style={{ fontFamily }}>
      <div className="container" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Keep header layout stable regardless of RTL by forcing LTR on the container */}
      <header dir="ltr" className="app-header">
        <h1 className="app-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t('title')}</h1>
        <div className="header-actions">
          {mock && (
            <span className="badge" title="Mock Data">
              <span className="badge-dot" />
              Mock Data
            </span>
          )}
          {typeof onSourceChange === 'function' && (
            <select
              aria-label="Data source"
              value={mock ? 'mock' : 'supabase'}
              onChange={(e) => onSourceChange(e.target.value === 'mock')}
              style={{ padding: 6 }}
            >
              <option value="mock">Mock</option>
              <option value="supabase" disabled={!canUseSupabase}>
                Supabase{!canUseSupabase ? ' (no .env)' : ''}
              </option>
            </select>
          )}
          <LanguageToggle />
        </div>
      </header>
      {children}
      </div>
    </div>
  );
};
