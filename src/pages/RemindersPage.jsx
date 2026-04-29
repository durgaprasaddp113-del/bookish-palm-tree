import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RemindersPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { supabase.from('medicine_reminders').select('*,patient_profiles(full_name)').then(({ data }) => setRows(data || [])); }, []);
  return <section><h3>Medicine Reminders</h3>
  <table><thead><tr><th>Patient</th><th>Medicine</th><th>Dosage</th><th>Time</th><th>Start</th><th>End</th><th>Status</th></tr></thead><tbody>
  {rows.map((r)=><tr key={r.id}><td>{r.patient_profiles?.full_name}</td><td>{r.medicine_name}</td><td>{r.dosage}</td><td>{r.reminder_time}</td><td>{r.start_date}</td><td>{r.end_date}</td><td>{r.reminder_status}</td></tr>)}
  </tbody></table></section>;
}
