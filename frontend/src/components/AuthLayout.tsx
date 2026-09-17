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
    <div className="flex min-h-screen">
      <aside className="hidden w-[42%] min-w-[320px] flex-col justify-between bg-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            A
          </span>
          <span>App-Name</span>
        </div>

        <div>
          <h1 className="mb-4 text-3xl font-bold leading-tight">{HEADLINE}</h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-white/85">{DESCRIPTION}</p>
        </div>

        <ul className="flex flex-col gap-3.5">
          {BULLETS.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2.5 text-sm font-medium">
              <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                <CheckIcon />
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-[400px]">
          <h2 className="mb-1.5 text-[26px] font-bold text-ink">{title}</h2>
          <p className="mb-6 text-sm text-muted">{subtitle}</p>

          <div className="mb-1 flex rounded-full border border-line bg-canvas p-1">
            <Link
              to="/login"
              className={`flex-1 rounded-full py-2.5 text-center text-sm font-medium transition-colors ${
                activeTab === 'login' ? 'bg-surface text-primary shadow-sm' : 'text-muted'
              }`}
            >
              Anmelden
            </Link>
            <Link
              to="/register"
              className={`flex-1 rounded-full py-2.5 text-center text-sm font-medium transition-colors ${
                activeTab === 'register' ? 'bg-surface text-primary shadow-sm' : 'text-muted'
              }`}
            >
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
