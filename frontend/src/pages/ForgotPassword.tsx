import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../api/authApi';
import { cardClass, cardPageClass, errorClass, inputClass, labelClass, linkClass, messageClass, submitButtonClass } from '../styles/formClasses';

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
    <div className={cardPageClass}>
      <div className={cardClass}>
        <h1 className="mb-1.5 text-2xl font-bold text-ink">Passwort vergessen</h1>
        <p className="mb-6 text-sm text-muted">Wir schicken dir einen Link zum Zurücksetzen</p>

        {message ? (
          <p className={messageClass}>{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className={labelClass}>E-Mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />

            {error && <p className={errorClass}>{error}</p>}

            <button type="submit" disabled={isSubmitting} className={submitButtonClass}>
              {isSubmitting ? 'Wird gesendet …' : 'Link anfordern'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className={linkClass}>Zurück zum Login</Link>
        </p>
      </div>
    </div>
  );
}
