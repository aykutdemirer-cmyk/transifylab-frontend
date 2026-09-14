import { useEffect, useState } from "react";
import ConverterPanel from "./components/ConverterPanel";
import InfoSidebar from "./components/InfoSidebar";
import TranscribePanel from "./components/TranscribePanel";
import { useLang } from "./lib/i18n/LanguageProvider";
import { getHealth } from "./lib/api";
import type { HealthResponse } from "./lib/types";

type Tab = "convert" | "transcribe";

const TAB_ACCENT: Record<Tab, string> = { convert: "bg-sun", transcribe: "bg-bubble" };
const CHIP_COLORS = ["bg-sun", "bg-bubble", "bg-sky"];

export default function App() {
  const { lang, setLang, t } = useLang();
  const [tab, setTab] = useState<Tab>("convert");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setOffline(true));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex h-11 w-11 flex-none -rotate-3 items-center justify-center rounded-xl border-[3px] border-ink bg-sun text-lg shadow-brutal-sm">
            📎
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold leading-tight text-ink">
              {t.app.name}
            </p>
            <p className="truncate text-xs font-medium text-ink/60">
              {t.app.tagline}
            </p>
          </div>
          <div className="flex flex-none overflow-hidden rounded-lg border-[3px] border-ink">
            {(["tr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={[
                  "px-2.5 py-1.5 font-display text-xs font-bold uppercase transition-colors",
                  lang === l ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-sun/40",
                ].join(" ")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl animate-fade-up">
          <span className="mb-4 inline-block -rotate-2 rounded-full border-[3px] border-ink bg-leaf px-3 py-1 font-display text-xs font-bold shadow-brutal-sm">
            {t.hero.badge}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl">
            {t.hero.titleLine1}
            <br />
            <span className="marker">{t.hero.titleLine2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">
            {t.hero.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {t.hero.chips.map(([icon, label], i) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink px-3 py-1.5 font-display text-xs font-bold shadow-brutal-sm ${CHIP_COLORS[i % CHIP_COLORS.length]} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <nav className="mb-7 inline-flex w-fit gap-1 rounded-xl border-[3px] border-ink bg-white p-1 shadow-brutal-sm">
              {(
                [
                  ["convert", t.nav.convert, "📄"],
                  ["transcribe", t.nav.transcribe, "🎙️"],
                ] as const
              ).map(([id, label, icon]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={[
                    "flex items-center gap-1.5 rounded-lg px-4 py-2 font-display text-sm font-bold transition-colors",
                    tab === id
                      ? `${TAB_ACCENT[id]} text-ink`
                      : "text-ink/50 hover:bg-paper hover:text-ink",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </button>
              ))}
            </nav>

            <div className="relative">
              <div
                className={`absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border-[3px] border-ink ${TAB_ACCENT[tab]} transition-colors`}
                aria-hidden="true"
              />
              <main className="relative rounded-2xl border-[3px] border-ink bg-white p-6 shadow-brutal sm:p-8">
                {tab === "convert" ? <ConverterPanel /> : <TranscribePanel />}
              </main>
            </div>
          </div>

          <InfoSidebar tab={tab} />
        </div>

        <footer className="mt-10 flex flex-col items-center gap-3 text-center">
          {offline ? (
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-bubble px-4 py-1.5 font-display text-xs font-bold shadow-brutal-sm">
              <span className="h-2 w-2 rounded-full bg-ink" />
              {t.footer.offline}
            </span>
          ) : health ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-leaf px-4 py-1.5 font-display text-xs font-bold shadow-brutal-sm">
                <span className="h-2 w-2 rounded-full bg-ink" />
                {health.app} · v{health.version}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {Object.entries(health.features).map(([key, on]) => (
                  <span
                    key={key}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-[11px] font-semibold",
                      on
                        ? "border-ink bg-white text-ink"
                        : "border-ink/20 bg-transparent text-ink/35",
                    ].join(" ")}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${on ? "bg-leaf" : "bg-ink/20"}`}
                    />
                    {t.footer.features[key] ?? key}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span className="text-xs text-ink/50">{t.footer.connecting}</span>
          )}
        </footer>
      </div>
    </div>
  );
}
