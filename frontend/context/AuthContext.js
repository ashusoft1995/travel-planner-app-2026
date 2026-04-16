"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  getStoredToken,
  setStoredToken,
  loginAccount,
  registerAccount,
  fetchSessionUser,
  friendlyApiMessage,
} from "../lib/api";

const USER_KEY = "ethiotravel_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const persistUser = useCallback((u) => {
    if (u) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch {
        /* ignore */
      }
    } else {
      try {
        localStorage.removeItem(USER_KEY);
      } catch {
        /* ignore */
      }
    }
    setUser(u);
  }, []);

  const applySession = useCallback(
    (token, u) => {
      setStoredToken(token || null);
      persistUser(u);
    },
    [persistUser]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        const token = getStoredToken();
        
        if (raw && token) {
          const localUser = JSON.parse(raw);
          setUser(localUser);
          
          const { data: res } = await fetchSessionUser();
          if (!cancelled) {
            if (res?.data) {
              persistUser(res.data);
            } else {
              // Server says no user for this token
              persistUser(null);
              setStoredToken(null);
            }
          }
        } else if (token && !raw) {
          const { data: res } = await fetchSessionUser();
          if (!cancelled && res?.data) persistUser(res.data);
        } else {
          setUser(null);
          setStoredToken(null);
        }
      } catch (e) {
        if (!cancelled) {
          persistUser(null);
          setStoredToken(null);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [persistUser]);

  const register = useCallback(
    async (name, email, password, username, role = "user") => {
      try {
        const { data: res } = await registerAccount({
          name: name.trim(),
          email: email.trim(),
          password,
          username: username.trim().toLowerCase(),
          role,
        });
        return res?.data;
      } catch (e) {
        throw new Error(friendlyApiMessage(e));
      }
    },
    [applySession]
  );

  const login = useCallback(
    async (identifier, password) => {
        const { data: res } = await loginAccount({
          identifier: identifier.trim(),
          password,
        });
        flushSync(() => {
          applySession(res.data?.token, res.data?.user);
        });
        return res.data?.user;
      } catch (e) {
        const msg = e?.response?.data?.message;
        throw new Error(
          typeof msg === "string" && msg.includes("Invalid") ? msg : friendlyApiMessage(e)
        );
      }
    },
    [applySession]
  );

  const updateAccount = useCallback(
    async (payload) => {
      try {
        const { data } = await patchSessionUser(payload);
        persistUser(data.user);
        return data.user;
      } catch (e) {
        throw new Error(friendlyApiMessage(e));
      }
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    persistUser(null);
  }, [persistUser]);

  const requestPasswordReset = useCallback((_email) => {
    return { found: false };
  }, []);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      register,
      login,
      logout,
      updateAccount,
      requestPasswordReset,
      isAdmin: user?.role === "admin",
    }),
    [user, hydrated, register, login, logout, updateAccount, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
