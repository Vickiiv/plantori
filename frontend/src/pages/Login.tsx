import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Willkommen zurück</h1>
        <p className="auth-subtitle">Melde dich bei App-Name an</p>

        <label htmlFor="email">E-Mail</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Passwort</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <p style={{ textAlign: 'right', fontSize: 13, marginTop: 8 }}>
          <Link to="/forgot-password" style={{ color: 'var(--color-primary)' }}>Passwort vergessen?</Link>
        </p>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Anmelden</button>

        <p className="auth-switch">
          Noch kein Konto? <Link to="/register">Registrieren</Link>
        </p>
      </form>
    </div>
  );
}
