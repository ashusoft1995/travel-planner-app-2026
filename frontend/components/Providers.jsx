"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../context/AuthContext";
import { TripProvider } from "../context/TripContext";
import { LanguageProvider } from "../context/LanguageContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TripProvider>{children}</TripProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
