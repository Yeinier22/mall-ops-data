"use client";
import React, { useMemo } from 'react';
import { Invoice, Tenant, WorkOrder } from '@/types';
import { useI18n } from '@/i18n/I18nContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csvContent = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const TenantsTable: React.FC<{ data: Tenant[] }>=({ data })=>{
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const rows = useMemo(() => data.map(d => [d.id, d.name, d.unit ?? '']), [data]);

  const onCsv = () => downloadCSV('tenants.csv', [['Tenants'], ['ID','Name','Unit'], ...rows]);
  const onPdf = () => {
    const doc = new jsPDF({ orientation: 'l' });
    autoTable(doc, { head: [['ID','Name','Unit']], body: rows as (string | number)[][], styles: { fontSize: 10 } });
    doc.save('tenants.pdf');
  };

  return (
    <div dir={dir} className="card">
      <div className="card-header">
        <h3>{t('tenants')}</h3>
        <div className="actions">
          <button onClick={onCsv}>{t('exportCSV')}</button>
          <button onClick={onPdf}>{t('exportPDF')}</button>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="td-left">{t('id')}</th>
              <th className="td-left">{t('name')}</th>
              <th className="td-left">{t('unit')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d)=> (
              <tr key={d.id}>
                <td className="td-left">{d.id}</td>
                <td className="td-left">{d.name}</td>
                <td className="td-left">{d.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const InvoicesTable: React.FC<{ data: Invoice[] }>=({ data })=>{
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const rows = useMemo(() => data.map(d => [d.id, d.tenant_id, d.amount, d.due_date, d.status]), [data]);

  const onCsv = () => downloadCSV('invoices.csv', [['Invoices'], ['ID','Tenant','Amount','Due','Status'], ...rows]);
  const onPdf = () => {
    const doc = new jsPDF({ orientation: 'l' });
    autoTable(doc, { head: [['ID','Tenant','Amount','Due','Status']], body: rows as (string | number)[][], styles: { fontSize: 10 } });
    doc.save('invoices.pdf');
  };

  return (
    <div dir={dir} className="card">
      <div className="card-header">
        <h3>{t('invoices')}</h3>
        <div className="actions">
          <button onClick={onCsv}>{t('exportCSV')}</button>
          <button onClick={onPdf}>{t('exportPDF')}</button>
        </div>
      </div>
      <div className="table-container scrollable">
        <table className="table">
          <thead>
            <tr>
              <th className="td-left">{t('id')}</th>
              <th className="td-left">{t('tenant')}</th>
              <th className="td-right">{t('amount')}</th>
              <th className="td-left">{t('due')}</th>
              <th className="td-left">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d)=> (
              <tr key={d.id}>
                <td className="td-left">{d.id}</td>
                <td className="td-left">{d.tenant_id}</td>
                <td className="td-right">{d.amount.toLocaleString()}</td>
                <td className="td-left">{d.due_date}</td>
                <td className="td-left">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const WorkOrdersTable: React.FC<{ data: WorkOrder[] }>=({ data })=>{
  const { t, lang } = useI18n();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const rows = useMemo(() => data.map(d => [d.id, d.title, d.status, d.created_at, d.resolved_at ?? '']), [data]);

  const onCsv = () => downloadCSV('work_orders.csv', [['Work Orders'], ['ID','Title','Status','Created','Resolved'], ...rows]);
  const onPdf = () => {
    const doc = new jsPDF({ orientation: 'l' });
    autoTable(doc, { head: [['ID','Title','Status','Created','Resolved']], body: rows as (string | number)[][], styles: { fontSize: 10 } });
    doc.save('work_orders.pdf');
  };

  return (
    <div dir={dir} className="card">
      <div className="card-header">
        <h3>{t('workOrders')}</h3>
        <div className="actions">
          <button onClick={onCsv}>{t('exportCSV')}</button>
          <button onClick={onPdf}>{t('exportPDF')}</button>
        </div>
      </div>
      <div className="table-container scrollable">
        <table className="table">
          <thead>
            <tr>
              <th className="td-left">{t('id')}</th>
              <th className="td-left">{t('titleCol')}</th>
              <th className="td-left">{t('status')}</th>
              <th className="td-left">{t('created')}</th>
              <th className="td-left">{t('resolved')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d)=> (
              <tr key={d.id}>
                <td className="td-left">{d.id}</td>
                <td className="td-left">{d.title}</td>
                <td className="td-left">{d.status}</td>
                <td className="td-left">{d.created_at}</td>
                <td className="td-left">{d.resolved_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
