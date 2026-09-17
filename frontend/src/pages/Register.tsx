import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordInput } from '../components/PasswordInput';
import { APP_NAME } from '../config';
import { errorClass, inputClass, labelClass, linkClass, submitButtonClass, switchTextClass } from '../styles/formClasses';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen');
    }
  }

  return (
    <AuthLayout activeTab="register" title="Konto erstellen" subtitle={`Starte jetzt mit ${APP_NAME}.`}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />

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
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <label htmlFor="passwordConfirm" className={labelClass}>Passwort wiederholen</label>
        <PasswordInput
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          minLength={8}
        />

        {error && <p className={errorClass}>{error}</p>}

        <button type="submit" className={submitButtonClass}>Registrieren</button>

        <p className={switchTextClass}>
          Schon ein Konto? <Link to="/login" className={linkClass}>Anmelden</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
