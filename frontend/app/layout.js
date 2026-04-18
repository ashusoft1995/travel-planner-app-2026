import "./globals.css";
import { Poppins } from "next/font/google";
import ConditionalShell from "../components/ConditionalShell";
import Providers from "../components/Providers";
import ClientToaster from "../components/ClientToaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "EthioTravel — Professional Travel Planner",
  description:
    "Plan Ethiopian adventures with itinerary management, budget tracking, maps, and multi-user roles.",
  keywords:
    "EthioTravel, travel planner, Ethiopia trip management, itinerary, budget tracker",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} flex min-h-screen flex-col antialiased`}>
        <Providers>
          <ConditionalShell>
            {children}
          </ConditionalShell>
          <ClientToaster />
        </Providers>
      </body>
    </html>
  );
}

