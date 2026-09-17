import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordInput } from '../components/PasswordInput';
import { errorClass, inputClass, labelClass, linkClass, submitButtonClass, switchTextClass } from '../styles/formClasses';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen');
    }
  }

  return (
    <AuthLayout
      activeTab="login"
      // ANPASSEN: Titel/Untertitel - reine Textinhalte, kein Code
      title="Willkommen zurück"
      subtitle="Melde dich an, um weiterzumachen."
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className={labelClass}>E-Mail</label>
        <input
          id="email"
          type="email"
          placeholder="name@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />

        <label htmlFor="password" className={labelClass}>Passwort</label>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <p className="mt-2 text-right text-sm">
          <Link to="/forgot-password" className={linkClass}>Passwort vergessen?</Link>
        </p>

        {error && <p className={errorClass}>{error}</p>}

        <button type="submit" className={submitButtonClass}>Anmelden</button>

        <p className={switchTextClass}>
          Noch kein Konto? <Link to="/register" className={linkClass}>Registrieren</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
