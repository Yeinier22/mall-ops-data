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
import { getKpiColor } from '@/utils/kpiColors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function for chart-specific color logic (handles scaled values)
const getChartKpiColor = (value: number | undefined, type: 'rentCollection' | 'overdue' | 'slaCompliance' | 'resolution'): string => {
  if (value === undefined || value === null) return '#e0e0e0'; // Gray for no data
  
  if (type === 'overdue') {
    // For charts, value is in thousands, so convert back to original SAR value
    const overdueOriginal = value * 1000;
    return getKpiColor(overdueOriginal, 'overdue');
  }
  
  return getKpiColor(value, type);
};

export const KpiBarChart: React.FC<{ finance?: FinanceKPI | null; ops?: OpsKPI | null }>
  = ({ finance, ops }) => {
  const { t, lang } = useI18n();
  
  const labels = [t('rentCollection'), t('overdueSAR'), t('slaCompliance'), t('avgResolution')];
  
  // Normalize data for better visualization
  const rawData = [
    finance?.collection_pct ?? 0,
    (finance?.overdue_sar ?? 0) / 1000, // Convert SAR to thousands
    ops?.sla_compliance_pct ?? 0,
    ops?.avg_resolution_hours ?? 0,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: t('kpiMetrics'),
        data: rawData,
        backgroundColor: [
          getChartKpiColor(finance?.collection_pct, 'rentCollection'),
          getChartKpiColor(finance?.overdue_sar, 'overdue'),
          getChartKpiColor(ops?.sla_compliance_pct, 'slaCompliance'),
          getChartKpiColor(ops?.avg_resolution_hours, 'resolution'),
        ],
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'top' as const,
        display: false
      }, 
      title: { display: false, text: '' }
    },
    indexAxis: 'y' as const,
    locale: lang === 'ar' ? 'ar' : 'en-US',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };
  
  return (
    <div className="chart-wrap">
      <Bar data={data} options={options} />
    </div>
  );
};
