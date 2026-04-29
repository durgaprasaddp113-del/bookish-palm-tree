import Sidebar from './Sidebar';
import { useAuth } from '../lib/AuthContext';

export default function Layout({ children }) {
  const { profile, signOut } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <header className="topbar">
          <div>
            <h1>Health Management Dashboard</h1>
            <p>{profile?.full_name} ({profile?.role})</p>
          </div>
          <button onClick={signOut}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
}
