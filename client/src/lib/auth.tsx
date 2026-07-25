import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "@/lib/queryClient";

const ADMIN_STORAGE_KEY = "olon-nuur-admin";
const ADMIN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type AdminSession = {
  slot?: string;
  until?: number;
  token?: string;
};

function readAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

function writeAdminSession(session: AdminSession) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function setAdminLocalSession(slot: string, token?: string) {
  writeAdminSession({
    slot,
    token,
    until: Date.now() + ADMIN_TTL_MS,
  });
}

export function getAdminLocalSession(): boolean {
  const session = readAdminSession();
  return typeof session?.until === "number" && Date.now() < session.until;
}

export function getAdminAuthHeaders(): Record<string, string> {
  const session = readAdminSession();
  if (!session?.token || !session.until || Date.now() >= session.until) {
    return {};
  }
  return { Authorization: `Bearer ${session.token}` };
}

export function clearAdminLocalSession() {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

type AuthState = {
  isAdmin: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  isAdmin: false,
  isLoading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    if (getAdminLocalSession()) {
      setIsAdmin(true);
    }

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: getAdminAuthHeaders(),
      });
      if (res.ok) {
        const data = (await res.json()) as { isAdmin?: boolean };
        setIsAdmin(!!data.isAdmin);
        return;
      }
    } catch {
      // ignore
    }

    setIsAdmin(getAdminLocalSession());
  }, []);

  useEffect(() => {
    refreshAuth().finally(() => setIsLoading(false));
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    clearAdminLocalSession();
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
    } catch {
      // ignore
    }
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
