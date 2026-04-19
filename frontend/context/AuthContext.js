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
  patchSessionUser,
  friendlyApiMessage,
} from "../lib/api";
import { supabase } from "../lib/supabase";

const USER_KEY = "ethiotravel_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const persistUser = useCallback((u) => {
    if (u) {
      try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
    }
    setUser(u);
  }, []);

  const applySession = useCallback(
    (tok, u) => {
      setStoredToken(tok || null);
      setToken(tok || null);
      persistUser(u);
    },
    [persistUser]
  );

  // --- Hydrate from localStorage / token ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        const tok = getStoredToken();

        if (raw && tok) {
          const localUser = JSON.parse(raw);
          setUser(localUser);
          setToken(tok);
          try {
            const { data: res } = await fetchSessionUser();
            if (!cancelled) {
              if (res?.data) persistUser(res.data);
              else { persistUser(null); setStoredToken(null); setToken(null); }
            }
          } catch { /* server might be cold-starting, keep local user */ }
        } else if (tok && !raw) {
          setToken(tok);
          try {
            const { data: res } = await fetchSessionUser();
            if (!cancelled && res?.data) persistUser(res.data);
          } catch { /* ignore */ }
        } else {
          // Check Supabase OAuth session
          const { data: { session } } = await supabase.auth.getSession();
          if (session && !cancelled) {
            const supaUser = session.user;
            const mapped = {
              id: supaUser.id,
              email: supaUser.email,
              name: supaUser.user_metadata?.full_name || supaUser.email,
              username: supaUser.email?.split("@")[0],
              role: "user",
              status: "active",
              avatar: supaUser.user_metadata?.avatar_url || null,
            };
            persistUser(mapped);
            setToken(session.access_token);
            setStoredToken(session.access_token);
          } else {
            setUser(null);
            setStoredToken(null);
            setToken(null);
          }
        }
      } catch (e) {
        if (!cancelled) { persistUser(null); setStoredToken(null); }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [persistUser]);

  // Listen to Supabase auth state changes (Google OAuth callback)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const supaUser = session.user;
          const mapped = {
            id: supaUser.id,
            email: supaUser.email,
            name: supaUser.user_metadata?.full_name || supaUser.email,
            username: supaUser.email?.split("@")[0],
            role: "user",
            status: "active",
            avatar: supaUser.user_metadata?.avatar_url || null,
          };
          flushSync(() => {
            applySession(session.access_token, mapped);
          });
        } else if (event === "SIGNED_OUT") {
          flushSync(() => {
            applySession(null, null);
          });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [applySession]);

  const loginWithGitHub = useCallback(async () => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "https://travel-planner-app-2026.vercel.app/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });
    if (error) throw new Error(error.message);
  }, []);

  const register = useCallback(
    async (name, email, password, username, role = "user", metadata = {}) => {
      try {
        const { data: res } = await registerAccount({
          name: name.trim(),
          email: email.trim(),
          password,
          username: username.trim().toLowerCase(),
          role,
          ...metadata,
        });
        const authData = res.data;
        // Agents get no token — just return success
        if (role === "agent") return null;
        flushSync(() => { applySession(authData?.token, authData?.user); });
        return authData?.user;
      } catch (e) {
        throw new Error(friendlyApiMessage(e));
      }
    },
    [applySession]
  );

  const login = useCallback(
    async (identifier, password) => {
      try {
        const { data: res } = await loginAccount({ identifier: identifier.trim(), password });
        const authData = res.data;
        flushSync(() => { applySession(authData?.token, authData?.user); });
        return authData?.user;
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

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    setStoredToken(null);
    setToken(null);
    persistUser(null);
  }, [persistUser]);

  const requestPasswordReset = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/reset-password`,
    });
    return { found: !error, error: error?.message };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      hydrated,
      register,
      login,
      loginWithGitHub,
      logout,
      updateAccount,
      requestPasswordReset,
      isAdmin: user?.role === "admin",
    }),
    [user, token, hydrated, register, login, loginWithGitHub, logout, updateAccount, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
