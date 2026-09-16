import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from '../api/authApi';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Kein gültiger Link zum Zurücksetzen gefunden.');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPasswordRequest(token, newPassword);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Neues Passwort vergeben</h1>

        {isSuccess ? (
          <>
            <p className="auth-message">Dein Passwort wurde geändert. Du kannst dich jetzt anmelden.</p>
            <p className="auth-switch">
              <Link to="/login">Zum Login</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="newPassword">Neues Passwort</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert …' : 'Passwort speichern'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
