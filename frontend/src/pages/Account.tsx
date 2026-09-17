import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePasswordRequest, deleteAccountRequest } from '../api/authApi';
import { APP_NAME } from '../config';
import { PasswordInput } from '../components/PasswordInput';
import { errorClass, labelClass, messageClass } from '../styles/formClasses';

export function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== newPasswordConfirm) {
      setPasswordError('Die neuen Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const data = await changePasswordRequest(currentPassword, newPassword);
      setPasswordMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
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
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-4 sm:px-8 sm:py-5">
        <span className="text-lg font-semibold text-primary-dark">{APP_NAME}</span>
        <button className="text-sm text-muted hover:text-ink" onClick={() => logout()}>Abmelden</button>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold text-ink">Konto</h1>
        <p className="mt-4 break-words text-muted">
          Angemeldet als {user?.email}
          {!user?.isVerified && ' · E-Mail nicht bestätigt'}
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-medium text-ink">Passwort ändern</h2>
          <form onSubmit={handlePasswordChange} className="mt-4 flex max-w-sm flex-col">
            <label htmlFor="currentPassword" className={labelClass}>Aktuelles Passwort</label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <label htmlFor="newPassword" className={labelClass}>Neues Passwort</label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            <label htmlFor="newPasswordConfirm" className={labelClass}>Neues Passwort wiederholen</label>
            <PasswordInput
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              minLength={8}
            />

            {passwordError && <p className={errorClass}>{passwordError}</p>}
            {passwordMessage && <p className={messageClass}>{passwordMessage}</p>}

            <button
              type="submit"
              className="mt-4 w-fit rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-dark"
            >
              Passwort ändern
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-medium text-danger">Konto löschen</h2>
          <p className="mt-1 text-muted">Das kann nicht rückgängig gemacht werden.</p>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-4 rounded-lg border border-danger px-5 py-2.5 font-medium text-danger hover:bg-danger hover:text-white"
            >
              Konto löschen
            </button>
          ) : (
            <div className="mt-4 flex max-w-sm flex-col">
              <label htmlFor="deletePassword" className={labelClass}>Passwort zur Bestätigung</label>
              <PasswordInput
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />

              {deleteError && <p className={errorClass}>{deleteError}</p>}

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={handleDelete}
                  className="rounded-lg border border-danger px-5 py-2.5 font-medium text-danger hover:bg-danger hover:text-white"
                >
                  Endgültig löschen
                </button>
                <button onClick={() => setConfirmDelete(false)} className="text-sm text-muted hover:text-ink">
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
