import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../lib/supabase';

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { supabase.from('health_records').select('record_date,status,blood_pressure,sugar_level,patient_profiles(full_name)').then(({ data }) => setRows(data || [])); }, []);

  const exportExcel = () => {
    const data = rows.map((r) => ({ Patient: r.patient_profiles?.full_name, Date: r.record_date, Status: r.status, BP: r.blood_pressure, Sugar: r.sugar_level }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HealthReport');
    XLSX.writeFile(wb, 'health-report.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { head: [['Patient', 'Date', 'Status', 'BP', 'Sugar']], body: rows.map((r) => [r.patient_profiles?.full_name, r.record_date, r.status, r.blood_pressure, r.sugar_level]) });
    doc.save('health-report.pdf');
  };

  return <section><h3>Reports</h3><p>Patient-wise and monthly summaries can be filtered from source tables.</p>
  <div className='row'><button onClick={exportExcel}>Export Excel</button><button onClick={exportPDF}>Export PDF</button></div></section>;
}
