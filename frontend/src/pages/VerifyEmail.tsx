import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmailRequest } from '../api/authApi';

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
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && <p>E-Mail wird bestätigt …</p>}

        {status === 'success' && (
          <>
            <h1>E-Mail bestätigt</h1>
            <p className="auth-message">Dein Konto ist jetzt aktiviert.</p>
            <p className="auth-switch">
              <Link to="/dashboard">Zum Dashboard</Link>
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1>Verifizierung fehlgeschlagen</h1>
            <p className="auth-error">{message}</p>
            <p className="auth-switch">
              <Link to="/login">Zum Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
