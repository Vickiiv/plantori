import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <span className="dashboard-logo">App-Name</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link className="link-button" to="/account">Konto</Link>
          <button className="link-button" onClick={() => logout()}>Abmelden</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1>Schön, dass du da bist, {user?.name}</h1>

        {!user?.isVerified && (
          <p className="auth-message">Bitte bestätige deine E-Mail-Adresse – schau in dein Postfach.</p>
        )}

        <p className="dashboard-hint">
          Platzhalter-Bereich – hier entstehen später Wochenplaner, Ziele und Timer.
        </p>
      </main>
    </div>
  );
}
