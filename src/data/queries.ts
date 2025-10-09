import { getSupabase } from '@/lib/supabaseClient';
import { FinanceKPI, Invoice, Mall, OpsKPI, Tenant, WorkOrder } from '@/types';

// Runtime-togglable mock flag; defaults to true if Supabase env is not configured
const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
let useMockFlag = !hasSupabaseEnv;
export function getUseMock() { return useMockFlag; }
export function setUseMock(v: boolean) { useMockFlag = v; }
export function canUseSupabase() { return hasSupabaseEnv; }

// Mock UUIDs (stable but obviously fake)
const MALL_A = '00000000-0000-0000-0000-000000000001';
const MALL_B = '00000000-0000-0000-0000-000000000002';

const mockMalls: Mall[] = [
  { id: MALL_A, name: 'Mall A' },
  { id: MALL_B, name: 'Mall B' },
];

const mockFinance: FinanceKPI[] = [
  { mall_id: MALL_A, collection_pct: 92.5, overdue_sar: 120000 },
  { mall_id: MALL_B, collection_pct: 88.1, overdue_sar: 175000 },
];

const mockOps: OpsKPI[] = [
  { mall_id: MALL_A, sla_compliance_pct: 96.3, avg_resolution_hours: 12.4 },
  { mall_id: MALL_B, sla_compliance_pct: 91.8, avg_resolution_hours: 18.7 },
];

const mockTenants: Tenant[] = [
  { id: 1, name: 'Tenant One', unit: 'A-101', mall_id: MALL_A },
  { id: 2, name: 'Tenant Two', unit: 'B-203', mall_id: MALL_A },
];

const mockInvoices: Invoice[] = [
  { id: 1001, tenant_id: 1, amount: 50000, due_date: '2025-10-31', status: 'Due', mall_id: MALL_A },
  { id: 1002, tenant_id: 2, amount: 75000, due_date: '2025-10-15', status: 'Overdue', mall_id: MALL_A },
];

const mockWorkOrders: WorkOrder[] = [
  { id: 2001, title: 'AC Maintenance', status: 'Closed', created_at: '2025-09-20', resolved_at: '2025-09-22', mall_id: MALL_A },
  { id: 2002, title: 'Lighting Issue', status: 'Open', created_at: '2025-10-05', mall_id: MALL_A },
];

// (Removed GenericRow; no longer needed once we select explicit columns)

export async function getMalls(): Promise<Mall[]> {
  const supabase = getSupabase();
  if (useMockFlag || !supabase) return mockMalls;
  const { data, error } = await supabase.from('malls').select('id,name').order('name');
  if (error) {
    console.error('[MallOps] getMalls error', error);
    return [];
  }
  return (data ?? []) as Mall[];
}

export async function getFinanceKPI(mallId: string): Promise<FinanceKPI | null> {
  const supabase = getSupabase();
  if (useMockFlag || !supabase) return mockFinance.find((x) => x.mall_id === mallId) ?? null;
  // Try with mall_id then fallback to id
  interface RawFinance { mall_id: string; rent_collection_pct?: number; collection_pct?: number; overdue_sar?: number }
  const { data: initialData, error: initialError } = await supabase
    .from('v_kpi_finance')
    .select('mall_id, rent_collection_pct, overdue_sar')
    .eq('mall_id', mallId)
    .maybeSingle<RawFinance>();
  let data = initialData; const error = initialError;
  if (error) {
    const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error));
    console.error('[MallOps] getFinanceKPI primary query error', serialized);
    const msg = (error as unknown as { message?: string })?.message?.toLowerCase?.() || '';
    // If column missing or filter invalid, fallback to global (no mall filter)
    if (msg.includes('column') || msg.includes('does not exist') || msg.includes('invalid reference')) {
      const fallback = await supabase
        .from('v_kpi_finance')
        .select('rent_collection_pct, overdue_sar')
        .limit(1)
        .maybeSingle<RawFinance>();
      if (fallback.error) {
        console.error('[MallOps] getFinanceKPI fallback error', JSON.stringify(fallback.error, Object.getOwnPropertyNames(fallback.error)));
        return null;
      }
      if (fallback.data) {
        const f = fallback.data;
        data = { mall_id: mallId, rent_collection_pct: f.rent_collection_pct, collection_pct: f.collection_pct, overdue_sar: f.overdue_sar } as RawFinance;
      }
    } else {
      // Non-schema error (e.g., RLS) – surface but don't throw to avoid breaking UI
      console.warn('[MallOps] getFinanceKPI returning null due to non-schema error');
      return null;
    }
  }
  if (!data) return null;
  // Map DB field rent_collection_pct -> collection_pct for internal naming consistency
  const mapped: FinanceKPI = {
    mall_id: data.mall_id,
    collection_pct: data.rent_collection_pct ?? data.collection_pct ?? 0,
    overdue_sar: data.overdue_sar ?? 0,
  };
  return mapped;
}

export async function getOpsKPI(mallId: string): Promise<OpsKPI | null> {
  const supabase = getSupabase();
  if (useMockFlag || !supabase) return mockOps.find((x) => x.mall_id === mallId) ?? null;
  interface RawOps { mall_id: string; sla_compliance_pct?: number; avg_resolution_hours?: number }
  const { data: initialData, error: initialError } = await supabase
    .from('v_kpi_ops')
    .select('mall_id, sla_compliance_pct, avg_resolution_hours')
    .eq('mall_id', mallId)
    .maybeSingle<RawOps>();
  let data = initialData; const error = initialError;
  if (error) {
    const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error));
    console.error('[MallOps] getOpsKPI primary query error', serialized);
    const msg = (error as unknown as { message?: string })?.message?.toLowerCase?.() || '';
    if (msg.includes('column') || msg.includes('does not exist') || msg.includes('invalid reference')) {
      const fallback = await supabase
        .from('v_kpi_ops')
        .select('sla_compliance_pct, avg_resolution_hours')
        .limit(1)
        .maybeSingle<RawOps>();
      if (fallback.error) {
        console.error('[MallOps] getOpsKPI fallback error', JSON.stringify(fallback.error, Object.getOwnPropertyNames(fallback.error)));
        return null;
      }
      if (fallback.data) {
        const f = fallback.data;
        data = { mall_id: mallId, sla_compliance_pct: f.sla_compliance_pct, avg_resolution_hours: f.avg_resolution_hours } as RawOps;
      }
    } else {
      console.warn('[MallOps] getOpsKPI returning null due to non-schema error');
      return null;
    }
  }
  if (!data) return null;
  const mapped: OpsKPI = {
    mall_id: data.mall_id,
    sla_compliance_pct: data.sla_compliance_pct ?? 0,
    avg_resolution_hours: data.avg_resolution_hours ?? 0,
  };
  return mapped;
}


export async function getTenants(mallId: string): Promise<Tenant[]> {
  const supabase = getSupabase();
  if (!mallId || mallId.trim() === '') return [];
  if (useMockFlag || !supabase) return mockTenants;
  const resolvedMallId = mallId;
  const { data, error } = await supabase
    .from('tenants')
    .select('id,name,unit,mall_id')
    .eq('mall_id', resolvedMallId)
    .order('name');
  if (error) {
    console.error('[MallOps] getTenants error', error);
    throw error;
  }
  return data as Tenant[];
}

export async function getInvoices(mallId: string): Promise<Invoice[]> {
  const supabase = getSupabase();
  if (!mallId || mallId.trim() === '') return [];
  if (useMockFlag || !supabase) return mockInvoices;
  const resolvedMallId = mallId;
  const { data, error } = await supabase
    .from('invoices')
    .select('id,tenant_id,mall_id,amount,due_date,status')
    .eq('mall_id', resolvedMallId);
  if (error) {
    console.error('[MallOps] getInvoices error', error);
    throw error;
  }
  return data as Invoice[];
}

export async function getWorkOrders(mallId: string): Promise<WorkOrder[]> {
  const supabase = getSupabase();
  if (!mallId || mallId.trim() === '') return [];
  if (useMockFlag || !supabase) return mockWorkOrders;
  const resolvedMallId = mallId;
  const { data, error } = await supabase
    .from('work_orders')
    .select('id,title,status,created_at,resolved_at,mall_id')
    .eq('mall_id', resolvedMallId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[MallOps] getWorkOrders error', error);
    throw error;
  }
  return data as WorkOrder[];
}
