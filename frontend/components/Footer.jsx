import Link from "next/link";
import { FiGithub, FiInstagram, FiSend } from "react-icons/fi";
import { SOCIAL } from "../lib/socials";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-950 py-12 text-slate-300">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">EthioTravel</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Plan Ethiopian adventures with clear budgets, itineraries, and a personal
            dashboard—built for travelers and teams who want a polished, reliable
            experience.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-yellow">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/trips" className="hover:text-white">
                Trips
              </Link>
            </li>
            <li>
              <Link href="/add-trip" className="hover:text-white">
                Add trip
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-yellow">
            Connect
          </p>
          <div className="mt-4 flex gap-3 text-slate-400">
            <a
              href={SOCIAL.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label={`Telegram ${SOCIAL.telegramLabel}`}
            >
              <FiSend size={22} />
            </a>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="Instagram"
            >
              <FiInstagram size={22} />
            </a>
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label={`GitHub ${SOCIAL.githubLabel}`}
            >
              <FiGithub size={22} />
            </a>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-slate-400">
              <span className="font-semibold">Phone:</span>{" "}
              <a href="tel:+251997255611" className="hover:text-white">
                +251 997 255 611
              </a>
            </p>
            <p className="text-slate-400">
              <span className="font-semibold">Email:</span>{" "}
              <a 
                href="mailto:ashenafiabebe604@gmail.com" 
                className="hover:text-white break-all"
              >
                ashenafiabebe604@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <p className="container mt-10 border-t border-white/10 pt-8 text-center text-xs text-slate-500" suppressHydrationWarning>
        © {new Date().getFullYear()} EthioTravel. All rights reserved.
      </p>
    </footer>
  );
}
