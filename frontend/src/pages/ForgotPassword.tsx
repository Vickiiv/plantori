import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../api/authApi';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await forgotPasswordRequest(email);
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Passwort vergessen</h1>
        <p className="auth-subtitle">Wir schicken dir einen Link zum Zurücksetzen</p>

        {message ? (
          <p className="auth-message">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-Mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gesendet …' : 'Link anfordern'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link to="/login">Zurück zum Login</Link>
        </p>
      </div>
    </div>
  );
}
