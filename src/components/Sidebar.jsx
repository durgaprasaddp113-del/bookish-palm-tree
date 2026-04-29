import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/patients', 'Patient Profiles'],
  ['/records', 'Daily Records'],
  ['/appointments', 'Appointments'],
  ['/reminders', 'Medicine Reminders'],
  ['/reports', 'Reports'],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>HealthApp</h2>
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
