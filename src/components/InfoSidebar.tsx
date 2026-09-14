import { useLang } from "../lib/i18n/LanguageProvider";

interface Props {
  tab: "convert" | "transcribe";
}

const STEP_COLORS = ["bg-sun", "bg-bubble", "bg-sky"];

export default function InfoSidebar({ tab }: Props) {
  const { t } = useLang();

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-8 lg:self-start">
      <div className="relative">
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border-[3px] border-ink bg-sky" aria-hidden="true" />
        <div className="relative rounded-2xl border-[3px] border-ink bg-white p-5">
          <p className="mb-3 font-display text-sm font-bold text-ink">
            {t.sidebar.howItWorks}
          </p>
          <ol className="space-y-3">
            {t.sidebar.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-ink font-display text-xs font-bold text-ink ${STEP_COLORS[i % STEP_COLORS.length]}`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="text-xs leading-relaxed text-ink/60">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border-[3px] border-ink bg-ink" aria-hidden="true" />
        <div className="relative rounded-2xl border-[3px] border-ink bg-sun p-5">
          <p className="mb-1.5 flex items-center gap-1.5 font-display text-sm font-bold text-ink">
            💡 {t.sidebar.tipTitle}
          </p>
          <p className="text-xs leading-relaxed text-ink/75">
            {tab === "convert" ? t.sidebar.tipConvert : t.sidebar.tipTranscribe}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border-[3px] border-ink bg-leaf" aria-hidden="true" />
        <div className="relative rounded-2xl border-[3px] border-ink bg-white p-5">
          <p className="mb-3 font-display text-sm font-bold text-ink">
            {t.sidebar.privacyTitle}
          </p>
          <ul className="space-y-2 text-xs text-ink/70">
            {t.sidebar.privacyItems.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-leaf">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
