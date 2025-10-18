/**
 * KPI Color Logic - Matching Power BI implementation
 * 
 * This utility provides consistent color coding for KPI metrics
 * across the entire dashboard, matching the Power BI color scheme.
 */

export type KpiType = 'rentCollection' | 'overdue' | 'slaCompliance' | 'resolution';

/**
 * Determines the appropriate color for a KPI value based on Power BI thresholds
 * @param value - The KPI value to evaluate
 * @param type - The type of KPI metric
 * @returns Hex color code string
 */
export const getKpiColor = (value: number | undefined | null, type: KpiType): string => {
  if (value === undefined || value === null) return '#666'; // Gray for no data
  
  switch (type) {
    case 'rentCollection':
      // RentCollectionColor logic from Power BI
      if (value >= 80) return '#4CAF50';   // Verde (Green)
      if (value >= 60) return '#FB8C00';   // Naranja (Orange)
      return '#E53935';                    // Rojo (Red)
      
    case 'overdue':
      // OverdueColor logic from Power BI
      if (value === 0) return '#4CAF50';      // Verde (sin deuda)
      if (value <= 1000) return '#FB8C00';    // Naranja (bajo nivel de deuda)
      return '#E53935';                       // Rojo (deuda alta)
      
    case 'slaCompliance':
      // SLAColor logic from Power BI
      if (value >= 85) return '#4CAF50';   // Verde
      if (value >= 70) return '#FB8C00';   // Naranja
      return '#E53935';                    // Rojo
      
    case 'resolution':
      // ResolutionColor logic from Power BI
      if (value <= 24) return '#4CAF50';   // Verde
      if (value <= 48) return '#FB8C00';   // Naranja
      return '#E53935';                    // Rojo
      
    default:
      return '#666';
  }
};

/**
 * KPI Thresholds for reference
 */
export const KPI_THRESHOLDS = {
  rentCollection: {
    excellent: 80,  // >= 80% = Green
    good: 60,       // >= 60% = Orange
    // < 60% = Red
  },
  overdue: {
    none: 0,        // = 0 = Green
    low: 1000,      // <= 1000 = Orange
    // > 1000 = Red
  },
  slaCompliance: {
    excellent: 85,  // >= 85% = Green
    good: 70,       // >= 70% = Orange
    // < 70% = Red
  },
  resolution: {
    excellent: 24,  // <= 24 hrs = Green
    good: 48,       // <= 48 hrs = Orange
    // > 48 hrs = Red
  }
} as const;

/**
 * Color palette used for KPIs
 */
export const KPI_COLORS = {
  GREEN: '#4CAF50',   // Excellent performance
  ORANGE: '#FB8C00',  // Acceptable performance
  RED: '#E53935',     // Poor performance
  GRAY: '#666'        // No data
} as const;