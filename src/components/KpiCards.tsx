"use client";
import React from 'react';
import { FinanceKPI, OpsKPI } from '@/types';
import { useI18n } from '@/i18n/I18nContext';

export const KpiCards: React.FC<{ finance?: FinanceKPI | null; ops?: OpsKPI | null }> = ({ finance, ops }) => {
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: 200,
    background: '#fff',
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} dir={dir}>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: '#666' }}>{t('rentCollection')}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{finance ? `${finance.collection_pct.toFixed(1)}%` : '—'}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: '#666' }}>{t('overdueSAR')}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{finance ? finance.overdue_sar.toLocaleString() : '—'}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: '#666' }}>{t('slaCompliance')}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{ops ? `${ops.sla_compliance_pct.toFixed(1)}%` : '—'}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: '#666' }}>{t('avgResolution')}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{ops ? ops.avg_resolution_hours.toFixed(1) : '—'}</div>
      </div>
    </div>
  );
};
