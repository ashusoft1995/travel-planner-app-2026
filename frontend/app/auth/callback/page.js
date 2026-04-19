"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      // Supabase automatically picks up the token from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        // Give AuthContext time to fire onAuthStateChange
        await new Promise((r) => setTimeout(r, 800));
        router.replace("/dashboard/user");
      } else {
        router.replace("/login?error=oauth_failed");
      }
    };
    handle();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050510] flex flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-white/50 text-xs font-black uppercase tracking-widest">
        Signing you in with Google...
      </p>
    </main>
  );
}
