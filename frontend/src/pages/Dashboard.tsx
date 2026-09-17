import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageClass } from '../styles/formClasses';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line bg-surface px-8 py-5">
        <span className="text-lg font-semibold text-primary-dark">App-Name</span>
        <div className="flex items-center gap-4">
          <Link className="text-sm text-muted hover:text-ink" to="/account">Konto</Link>
          <button className="text-sm text-muted hover:text-ink" onClick={() => logout()}>Abmelden</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink">Schön, dass du da bist, {user?.name}</h1>

        {!user?.isVerified && (
          <p className={messageClass}>Bitte bestätige deine E-Mail-Adresse – schau in dein Postfach.</p>
        )}

        <p className="mt-4 text-muted">
          Platzhalter-Bereich – hier entstehen später Wochenplaner, Ziele und Timer.
        </p>
      </main>
    </div>
  );
}
