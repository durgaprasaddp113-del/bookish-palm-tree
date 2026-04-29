import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({ patients: 0, appts: 0, pending: 0, reminders: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      const [patients, appts, pending, reminders, recentRows] = await Promise.all([
        supabase.from('patient_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).gte('appointment_at', `${today}T00:00:00`).lte('appointment_at', `${today}T23:59:59`),
        supabase.from('health_records').select('id', { count: 'exact', head: true }).eq('status', 'Attention Required'),
        supabase.from('medicine_reminders').select('id', { count: 'exact', head: true }).eq('reminder_status', 'Pending'),
        supabase.from('health_records').select('record_date,blood_pressure,sugar_level,status,patient_profiles(full_name)').order('record_date', { ascending: false }).limit(8),
      ]);

      setStats({ patients: patients.count || 0, appts: appts.count || 0, pending: pending.count || 0, reminders: reminders.count || 0 });
      setRecent(recentRows.data || []);
    };
    load();
  }, []);

  return (
    <>
      <div className="cards">
        <div className="card"><h3>Total Patients</h3><p>{stats.patients}</p></div>
        <div className="card"><h3>Today Appointments</h3><p>{stats.appts}</p></div>
        <div className="card"><h3>Pending Checkups</h3><p>{stats.pending}</p></div>
        <div className="card"><h3>Medicine Reminders</h3><p>{stats.reminders}</p></div>
      </div>
      <h3>Recent Health Records</h3>
      <table><thead><tr><th>Patient</th><th>Date</th><th>BP</th><th>Sugar</th><th>Status</th></tr></thead><tbody>
        {recent.map((r, i) => <tr key={i}><td>{r.patient_profiles?.full_name}</td><td>{r.record_date}</td><td>{r.blood_pressure}</td><td>{r.sugar_level}</td><td>{r.status}</td></tr>)}
      </tbody></table>
      <p className="disclaimer">This app does not provide medical diagnosis. For abnormal values, consult a qualified doctor.</p>
    </>
  );
}
