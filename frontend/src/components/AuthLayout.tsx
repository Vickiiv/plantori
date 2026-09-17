import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../config';

interface AuthLayoutProps {
  activeTab: 'login' | 'register';
  title: string;
  subtitle: string;
  children: ReactNode;
}

// ---------------------------------------------------------------------
// ANPASSEN: Platzhalter-Inhalte fuer die linke Seite (nur ab "lg" sichtbar).
// Diese drei Konstanten durch den echten Claim/Value-Pitch des Projekts
// ersetzen. Das Logo-Kuerzel unten (aktuell "A") kommt automatisch aus
// APP_NAME[0] - fuer ein echtes Logo-Bild stattdessen ein <img> einsetzen.
// ---------------------------------------------------------------------
const HEADLINE = 'Deine App in einem Satz.';
const DESCRIPTION =
  'Kurze Beschreibung, was diese App macht und wem sie hilft - hier den echten Value-Pitch einsetzen.';
const BULLETS = ['Erstes Kernfeature', 'Zweites Kernfeature', 'Drittes Kernfeature'];

export function AuthLayout({ activeTab, title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Linke Seite: nur ab "lg" (1024px) sichtbar - auf Mobile/Tablet
          komplett ausgeblendet, dort zeigt nur das rechte Formular. */}
      <aside className="hidden w-[42%] min-w-[320px] flex-col justify-between bg-primary p-8 text-white lg:flex xl:p-12">
        <div className="flex items-center gap-2.5 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            {APP_NAME[0]}
          </span>
          <span>{APP_NAME}</span>
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

      {/* Rechte Seite / einzige Seite auf Mobile: das eigentliche Formular.
          max-w ist auf Mobile/Tablet groesszuegiger (420px) als auf Desktop
          (400px), weil dort keine linke Seite mehr um Platz konkurriert. */}
      <main className="flex flex-1 items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-[420px] lg:max-w-[400px]">
          {/* Kompaktes Logo nur auf Mobile/Tablet, da die linke Seite dort fehlt */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {APP_NAME[0]}
            </span>
            <span className="text-lg font-semibold text-ink">{APP_NAME}</span>
          </div>

          <h2 className="mb-1.5 text-[28px] font-bold leading-tight text-ink lg:text-[26px] lg:leading-normal">
            {title}
          </h2>
          <p className="mb-6 text-[15px] text-muted">{subtitle}</p>

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
