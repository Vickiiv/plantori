import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  activeTab: 'login' | 'register';
  title: string;
  subtitle: string;
  children: ReactNode;
}

// Platzhalter-Inhalte fuer die linke Seite - beim Anpassen fuer ein
// konkretes Projekt einfach diese drei Konstanten ersetzen.
const HEADLINE = 'Deine App in einem Satz.';
const DESCRIPTION =
  'Kurze Beschreibung, was diese App macht und wem sie hilft - hier den echten Value-Pitch einsetzen.';
const BULLETS = ['Erstes Kernfeature', 'Zweites Kernfeature', 'Drittes Kernfeature'];

export function AuthLayout({ activeTab, title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-split">
      <aside className="auth-side">
        <div className="auth-side-logo">
          <span className="auth-side-logo-icon">A</span>
          <span>App-Name</span>
        </div>

        <div className="auth-side-middle">
          <h1>{HEADLINE}</h1>
          <p>{DESCRIPTION}</p>
        </div>

        <ul className="auth-side-bullets">
          {BULLETS.map((bullet) => (
            <li key={bullet}>
              <CheckIcon /> {bullet}
            </li>
          ))}
        </ul>
      </aside>

      <main className="auth-main">
        <div className="auth-form-panel">
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>

          <div className="auth-tabs">
            <Link to="/login" className={`auth-tab${activeTab === 'login' ? ' active' : ''}`}>
              Anmelden
            </Link>
            <Link to="/register" className={`auth-tab${activeTab === 'register' ? ' active' : ''}`}>
              Registrieren
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
