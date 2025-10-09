"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FinanceKPI, OpsKPI } from '@/types';
import { useI18n } from '@/i18n/I18nContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const KpiBarChart: React.FC<{ finance?: FinanceKPI | null; ops?: OpsKPI | null }>
  = ({ finance, ops }) => {
  const { t, lang } = useI18n();
  const labels = [t('rentCollection'), t('overdueSAR'), t('slaCompliance'), t('avgResolution')];
  const data = {
    labels,
    datasets: [
      {
        label: t('title'),
        data: [
          finance?.collection_pct ?? 0,
          finance?.overdue_sar ?? 0,
          ops?.sla_compliance_pct ?? 0,
          ops?.avg_resolution_hours ?? 0,
        ],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800'],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, title: { display: false, text: '' } },
    indexAxis: 'y' as const,
    locale: lang === 'ar' ? 'ar' : 'en-US',
  };
  return (
    <div className="chart-wrap">
      <Bar data={data} options={options} />
    </div>
  );
};
