import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, getMeRequest, loginRequest, logoutRequest, registerRequest } from '../api/authApi';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMeRequest()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await loginRequest(email, password);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await registerRequest(name, email, password);
    setUser(data.user);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  // Nach Profil-Aenderungen (z.B. Name) aufrufen, um den lokalen Nutzer-Stand
  // zu aktualisieren, ohne dass die Seite neu geladen werden muss.
  async function refreshUser() {
    const data = await getMeRequest();
    setUser(data.user);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  }
  return context;
}
