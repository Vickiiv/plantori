import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../config";
import { Logo } from "../components/Logo";

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-4 sm:px-8 sm:py-5">
        {/* Logo + Name fuehren immer zurueck zum Dashboard (auch von /account aus) */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 text-lg font-semibold text-primary-dark"
        >
          <Logo className="h-8 w-8" />
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-4">
          <Link className="text-sm text-muted hover:text-ink" to="/account">
            Konto
          </Link>
          <button
            className="text-sm text-muted hover:text-ink"
            onClick={() => logout()}
          >
            Abmelden
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold text-ink break-words">
          Schön, dass du da bist, {user?.name}
        </h1>

        {/* {!user?.isVerified && (
          <p className="mt-2 text-sm text-muted">
            E-Mail-Adresse noch nicht bestätigt – schau in dein Postfach.
          </p>
        )} */}

        {/* ANPASSEN: Ab hier faengt die eigentliche App an - dieser gesamte
            <main>-Block ist nur ein Platzhalter. */}
        <p className="mt-4 text-muted">
          Plane deine Woche. Erreiche deine Ziele.
        </p>
      </main>
    </div>
  );
}
