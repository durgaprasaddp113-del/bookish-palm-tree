import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AppointmentsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { supabase.from('appointments').select('*,patient_profiles(full_name),doctors:profiles!appointments_doctor_id_fkey(full_name)').order('appointment_at').then(({ data }) => setRows(data || [])); }, []);
  return <section><h3>Appointments</h3>
  <table><thead><tr><th>Patient</th><th>Doctor</th><th>Date/Time</th><th>Purpose</th><th>Status</th></tr></thead><tbody>
  {rows.map((r)=><tr key={r.id}><td>{r.patient_profiles?.full_name}</td><td>{r.doctors?.full_name}</td><td>{new Date(r.appointment_at).toLocaleString()}</td><td>{r.purpose}</td><td>{r.status}</td></tr>)}
  </tbody></table></section>;
}
