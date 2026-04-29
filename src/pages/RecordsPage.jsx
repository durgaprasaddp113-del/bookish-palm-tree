import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RecordsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { supabase.from('health_records').select('*,patient_profiles(full_name)').order('record_date', { ascending: false }).then(({ data }) => setRows(data || [])); }, []);
  return <section><h3>Daily Health Records</h3>
  <table><thead><tr><th>Patient</th><th>Date</th><th>BP</th><th>Sugar</th><th>Temp</th><th>Weight</th><th>Symptoms</th><th>Status</th></tr></thead><tbody>
  {rows.map((r)=><tr key={r.id}><td>{r.patient_profiles?.full_name}</td><td>{r.record_date}</td><td>{r.blood_pressure}</td><td>{r.sugar_level}</td><td>{r.temperature}</td><td>{r.weight}</td><td>{r.symptoms}</td><td>{r.status}</td></tr>)}
  </tbody></table></section>;
}
