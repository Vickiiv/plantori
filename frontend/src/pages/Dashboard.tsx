import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <span className="dashboard-logo">App-Name</span>
        <button className="link-button" onClick={() => logout()}>Abmelden</button>
      </header>

      <main className="dashboard-content">
        <h1>Schön, dass du da bist, {user?.name}</h1>
        <p className="dashboard-hint">
          Platzhalter-Bereich – hier entstehen später Wochenplaner, Ziele und Timer.
        </p>
      </main>
    </div>
  );
}
