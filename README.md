# MallOps AI Dashboard (Local)

This is a local bilingual dashboard (EN/AR) you can run in VS Code. It connects to Supabase Postgres if env vars are set, or falls back to mock data for quick testing.
https://mallop.netlify.app/

## Features
- Mall selector filter
- KPI cards: Rent Collection %, Overdue SAR, SLA Compliance %, Avg Resolution Hours
- Chart.js bar chart for KPIs
- Tables: Tenants, Invoices, Work Orders
- CSV/PDF export for each table
- Language toggle (English/Arabic) with RTL support

## Setup
1. Copy `.env.local.example` to `.env.local` and fill:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DEFAULT_MALL_ID=1
```
2. Install and run:
```
npm install
npm run dev
```
3. Open http://localhost:3000

## Notes
- SQL views expected: `v_kpi_finance`, `v_kpi_ops`. Base tables for lists: `tenants`, `invoices`, `work_orders`, `malls`.
- You can port the layout and queries to Retool/Appsmith easily by reusing the SQL in `src/data/queries.ts`.
