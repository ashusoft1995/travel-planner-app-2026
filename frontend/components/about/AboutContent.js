"use client";

import { motion } from "framer-motion";
import {
  FiAward,
  FiGithub,
  FiGlobe,
  FiHeart,
  FiInstagram,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { SOCIAL } from "../../lib/socials";

function SocialLink({ href, label, Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[var(--muted)] hover:text-brand-600 dark:hover:text-accent-yellow"
    >
      <Icon />
    </a>
  );
}

const teamSocials = [
  { Icon: FiGithub, href: SOCIAL.github, label: `GitHub ${SOCIAL.githubLabel}` },
  { Icon: FiSend, href: SOCIAL.telegram, label: `Telegram ${SOCIAL.telegramLabel}` },
  { Icon: FiInstagram, href: SOCIAL.instagram, label: `Instagram ${SOCIAL.instagramLabel}` },
];

const team = [
  {
    name: "Ashenafi Abebe",
    role: "Software engineer · engineering manager · travel & media",
    initials: "AA",
    from: "from-brand-600 to-accent-green",
    socials: teamSocials,
  },
  {
    name: "Jemile Koji",
    role: "Software engineer · travel & media",
    initials: "JK",
    from: "from-accent-green to-brand-500",
    socials: teamSocials,
  },
  {
    name: "Elsa Solomon",
    role: "Software engineer · travel & media",
    initials: "ES",
    from: "from-brand-500 to-accent-green",
    socials: teamSocials,
  },
  {
    name: "Birhanu Alemayehu",
    role: "Software engineer · travel & media",
    initials: "BA",
    from: "from-accent-green to-brand-600",
    socials: teamSocials,
  },
];

export default function AboutContent() {
  return (
    <main className="page-shell py-16">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-accent-yellow">
            About
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[var(--text)]">Our mission</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            EthioTravel is built by software engineers who are also experts in travel and
            media. We help travelers and operators plan with clarity: budgets, timelines,
            and clear presentation, backed by a simple API.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-surface mt-12 p-10 text-center"
        >
          <h2 className="text-xl font-bold text-[var(--text)]">Why we build this</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Our team combines product engineering with on-the-ground travel insight and
            media storytelling. We build modern web tools so planning stays simple — less
            spreadsheet work, more time for the journey.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "10K+", label: "Happy travelers", icon: <FiUsers /> },
            { value: "8+", label: "Signature regions", icon: <FiGlobe /> },
            { value: "1K+", label: "Trips planned", icon: <FiAward /> },
            { value: "98%", label: "Satisfaction", icon: <FiHeart /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface p-6 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center text-brand-600 dark:text-accent-yellow">
                {s.icon}
              </div>
              <p className="mt-3 text-2xl font-bold text-[var(--text)]">{s.value}</p>
              <p className="text-xs text-[var(--muted)]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="mt-16 text-center text-2xl font-bold text-[var(--text)]">Team</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--muted)]">
          Everyone below is a software engineer with expertise in travel and media. Connect
          on{" "}
          <a
            href={SOCIAL.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline dark:text-accent-yellow"
          >
            Telegram
          </a>
          ,{" "}
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline dark:text-accent-yellow"
          >
            Instagram
          </a>
          , or{" "}
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline dark:text-accent-yellow"
          >
            GitHub
          </a>
          .
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-surface p-6 text-center"
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${m.from} text-lg font-bold text-white`}
              >
                {m.initials}
              </div>
              <h3 className="mt-4 font-semibold text-[var(--text)]">{m.name}</h3>
              <p className="text-sm text-[var(--muted)]">{m.role}</p>
              <div className="mt-4 flex justify-center gap-3 text-lg">
                {m.socials.map((s) => (
                  <SocialLink
                    key={`${m.name}-${s.label}`}
                    href={s.href}
                    label={s.label}
                    Icon={s.Icon}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
