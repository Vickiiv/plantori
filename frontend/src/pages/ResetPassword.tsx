import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from '../api/authApi';
import { cardClass, cardPageClass, errorClass, inputClass, labelClass, linkClass, messageClass, submitButtonClass } from '../styles/formClasses';

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
    <div className={cardPageClass}>
      <div className={cardClass}>
        <h1 className="mb-6 text-2xl font-bold text-ink">Neues Passwort vergeben</h1>

        {isSuccess ? (
          <>
            <p className={messageClass}>Dein Passwort wurde geändert. Du kannst dich jetzt anmelden.</p>
            <p className="mt-6 text-center text-sm">
              <Link to="/login" className={linkClass}>Zum Login</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="newPassword" className={labelClass}>Neues Passwort</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />

            {error && <p className={errorClass}>{error}</p>}

            <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
              {isSubmitting ? 'Wird gespeichert …' : 'Passwort speichern'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
