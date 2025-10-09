"use client";
import React, { useEffect, useState } from "react";
import { LayoutShell } from "@/components/LayoutShell";
import { MallSelector } from "@/components/MallSelector";
import { KpiCards } from "@/components/KpiCards";
import { KpiBarChart } from "@/components/Charts";
import { InvoicesTable, TenantsTable, WorkOrdersTable } from "@/components/DataTables";
import { FinanceKPI, Invoice, Mall, OpsKPI, Tenant, WorkOrder } from "@/types";
import { getFinanceKPI, getInvoices, getMalls, getOpsKPI, getTenants, getWorkOrders, getUseMock, setUseMock, canUseSupabase } from "@/data/queries";
import { useI18n } from "@/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();
  const [malls, setMalls] = useState<Mall[]>([]);
  const [mallId, setMallId] = useState<string | undefined>(undefined);
  const [finance, setFinance] = useState<FinanceKPI | null>();
  const [ops, setOps] = useState<OpsKPI | null>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const defaultMallEnv = process.env.NEXT_PUBLIC_DEFAULT_MALL_ID;
  const [useMock, setUseMockState] = useState<boolean>(getUseMock());

  useEffect(() => {
    (async () => {
      const ms = await getMalls();
      setMalls(ms);
      const envDefault = defaultMallEnv ? String(defaultMallEnv).trim() : undefined;
      let nextId = mallId;
      if (!nextId || !ms.some((m) => m.id === nextId)) {
        nextId = envDefault && ms.some((m) => m.id === envDefault) ? envDefault : ms[0]?.id;
      }
      setMallId(nextId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMock]);

  useEffect(() => {
    if (!mallId || mallId.trim() === '') return;
    setLoading(true);
    Promise.all([
      getFinanceKPI(mallId),
      getOpsKPI(mallId),
      getTenants(mallId),
      getInvoices(mallId),
      getWorkOrders(mallId),
    ])
      .then(([f, o, ts, is, ws]) => {
        setFinance(f);
        setOps(o);
        setTenants(ts);
        setInvoices(is);
        setWorkOrders(ws);
      })
      .finally(() => setLoading(false));
  }, [mallId, useMock]);

  const handleSourceChange = async (nextUseMock: boolean) => {
    setUseMock(nextUseMock);
    setUseMockState(nextUseMock);
    // Immediately refresh malls and reconcile mallId to avoid empty data during transition
    const ms = await getMalls();
    setMalls(ms);
    const envDefault = defaultMallEnv ? String(defaultMallEnv).trim() : undefined;
    let nextId = mallId;
    if (!nextId || !ms.some((m) => m.id === nextId)) {
      nextId = envDefault && ms.some((m) => m.id === envDefault) ? envDefault : ms[0]?.id;
    }
    setMallId(nextId);
  };

  return (
  <LayoutShell mock={useMock} onSourceChange={handleSourceChange} canUseSupabase={canUseSupabase()}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <MallSelector malls={malls} value={mallId} onChange={setMallId} />
        </div>
        {loading ? (
          <div className="card">{t('loading')}</div>
        ) : (
          <>
            <div className="card">
              <KpiCards finance={finance} ops={ops} />
            </div>
            <div className="card">
              <KpiBarChart finance={finance ?? undefined} ops={ops ?? undefined} />
            </div>
            <TenantsTable data={tenants} />
            <InvoicesTable data={invoices} />
            <WorkOrdersTable data={workOrders} />
          </>
        )}
      </div>
    </LayoutShell>
  );
}
