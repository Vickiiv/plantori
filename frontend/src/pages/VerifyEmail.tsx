import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmailRequest } from '../api/authApi';
import { cardClass, cardPageClass, errorClass, linkClass, messageClass } from '../styles/formClasses';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Kein Verifizierungs-Token gefunden.');
      return;
    }

    verifyEmailRequest(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verifizierung fehlgeschlagen');
      });
  }, [token]);

  return (
    <div className={cardPageClass}>
      <div className={`${cardClass} text-center`}>
        {/* ANPASSEN: Status-Texte unten sind Platzhalter-Copy */}
        {status === 'loading' && <p className="text-muted">E-Mail wird bestätigt …</p>}

        {status === 'success' && (
          <>
            <h1 className="mb-1.5 text-2xl font-bold text-ink">E-Mail bestätigt</h1>
            <p className={messageClass}>Dein Konto ist jetzt aktiviert.</p>
            <p className="mt-6 text-sm">
              <Link to="/dashboard" className={linkClass}>Zum Dashboard</Link>
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="mb-1.5 text-2xl font-bold text-ink">Verifizierung fehlgeschlagen</h1>
            <p className={errorClass}>{message}</p>
            <p className="mt-6 text-sm">
              <Link to="/login" className={linkClass}>Zum Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
