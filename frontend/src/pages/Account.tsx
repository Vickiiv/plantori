import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePasswordRequest, deleteAccountRequest } from '../api/authApi';

export function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    try {
      const data = await changePasswordRequest(currentPassword, newPassword);
      setPasswordMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen');
    }
  }

  async function handleDelete() {
    setDeleteError('');
    try {
      await deleteAccountRequest(deletePassword);
      await logout();
      navigate('/login');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen');
    }
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <span className="dashboard-logo">App-Name</span>
        <button className="link-button" onClick={() => logout()}>Abmelden</button>
      </header>

      <main className="dashboard-content">
        <h1>Konto</h1>
        <p className="dashboard-hint">
          Angemeldet als {user?.email}
          {!user?.isVerified && ' · E-Mail nicht bestätigt'}
        </p>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500 }}>Passwort ändern</h2>
          <form onSubmit={handlePasswordChange} className="account-form">
            <label htmlFor="currentPassword">Aktuelles Passwort</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <label htmlFor="newPassword">Neues Passwort</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            {passwordError && <p className="auth-error">{passwordError}</p>}
            {passwordMessage && <p className="auth-message">{passwordMessage}</p>}

            <button type="submit">Passwort ändern</button>
          </form>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-error)' }}>Konto löschen</h2>
          <p className="dashboard-hint">Das kann nicht rückgängig gemacht werden.</p>

          {!confirmDelete ? (
            <button className="danger-button" onClick={() => setConfirmDelete(true)}>
              Konto löschen
            </button>
          ) : (
            <div className="account-form">
              <label htmlFor="deletePassword">Passwort zur Bestätigung</label>
              <input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />

              {deleteError && <p className="auth-error">{deleteError}</p>}

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button className="danger-button" onClick={handleDelete}>
                  Endgültig löschen
                </button>
                <button className="link-button" onClick={() => setConfirmDelete(false)}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
