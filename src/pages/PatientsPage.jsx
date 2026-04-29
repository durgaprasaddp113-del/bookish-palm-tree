import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PatientsPage() {
  const [rows, setRows] = useState([]); const [q, setQ] = useState('');
  useEffect(() => { supabase.from('patient_profiles').select('*').then(({ data }) => setRows(data || [])); }, []);
  const filtered = rows.filter((r) => r.full_name.toLowerCase().includes(q.toLowerCase()));
  return <section><h3>Patient Profiles</h3><input placeholder='Search patient' onChange={(e)=>setQ(e.target.value)} />
  <table><thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Mobile</th><th>Blood</th><th>Emergency</th><th>Allergies</th></tr></thead><tbody>
  {filtered.map((r)=><tr key={r.id}><td>{r.full_name}</td><td>{r.age}</td><td>{r.gender}</td><td>{r.mobile_number}</td><td>{r.blood_group}</td><td>{r.emergency_contact}</td><td>{r.allergies}</td></tr>)}
  </tbody></table></section>;
}
