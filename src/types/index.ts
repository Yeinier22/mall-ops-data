// Using string (UUID) for mall-related identifiers
export type Mall = { id: string; name: string };

export type FinanceKPI = {
  mall_id: string;
  collection_pct: number; // 0-100
  overdue_sar: number; // currency
};

export type OpsKPI = {
  mall_id: string;
  sla_compliance_pct: number; // 0-100
  avg_resolution_hours: number;
};

export type Tenant = { id: number; name: string; unit?: string; mall_id: string };
export type Invoice = { id: number; tenant_id: number; amount: number; due_date: string; status: string; mall_id?: string };
export type WorkOrder = { id: number; title: string; status: string; created_at: string; resolved_at?: string; mall_id?: string };
