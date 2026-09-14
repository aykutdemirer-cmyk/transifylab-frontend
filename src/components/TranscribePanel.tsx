import { useMemo, useState } from "react";
import Dropzone from "./Dropzone";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";
import { useToasts } from "../hooks/useToasts";
import { useLang } from "../lib/i18n/LanguageProvider";
import { ApiError, transcribeAudio } from "../lib/api";
import type { TranscriptionResult, TranscriptionSegment } from "../lib/types";

const AUDIO_EXT = [
  ".mp3",
  ".wav",
  ".m4a",
  ".ogg",
  ".flac",
  ".webm",
  ".mp4",
  ".gsm",
  ".amr",
  ".3gp",
];
const MAX_MB = 100;
const FORMATS = ["txt", "srt", "json"] as const;

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Group consecutive segments that share a speaker into turns. */
function toTurns(segments: TranscriptionSegment[]) {
  const turns: { speaker: string | null; start: number; text: string }[] = [];
  for (const seg of segments) {
    const last = turns[turns.length - 1];
    const sp = seg.speaker ?? null;
    if (last && last.speaker === sp) {
      last.text += " " + seg.text.trim();
    } else {
      turns.push({ speaker: sp, start: seg.start, text: seg.text.trim() });
    }
  }
  return turns;
}

const SPEAKER_COLORS = ["bg-sun", "bg-bubble", "bg-sky text-white", "bg-leaf", "bg-white"];

export default function TranscribePanel() {
  const toasts = useToasts();
  const { lang, t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>(lang);
  const [formats, setFormats] = useState<string[]>(["txt", "srt", "json"]);
  const [diarize, setDiarize] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [phase, setPhase] = useState<"upload" | "transcribe" | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const busy = phase !== null;

  const turns = useMemo(
    () => (result ? toTurns(result.segments) : []),
    [result],
  );
  const speakerIndex = useMemo(() => {
    const map = new Map<string, number>();
    turns.forEach((turn) => {
      if (turn.speaker && !map.has(turn.speaker)) map.set(turn.speaker, map.size);
    });
    return map;
  }, [turns]);

  const toggleFormat = (f: string) =>
    setFormats((cur) =>
      cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f],
    );

  const submit = async () => {
    if (!file) return;
    if (formats.length === 0) {
      toasts.error(t.transcribe.formatsRequired);
      return;
    }
    setResult(null);
    setProgress(0);
    setPhase("upload");
    try {
      const res = await transcribeAudio(
        { file, language: language || undefined, formats, diarize },
        (p) => {
          setProgress(p);
          if (p >= 100) setPhase("transcribe");
        },
      );
      setResult(res);
      res.warnings?.forEach((w) => toasts.info(w));
      toasts.success(t.transcribe.successToast(res.speaker_count));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t.transcribe.errorToast;
      toasts.error(msg);
    } finally {
      setPhase(null);
      setProgress(null);
    }
  };

  const copyText = async () => {
    if (!result) return;
    const plain = turns
      .map((turn) => (turn.speaker ? `${turn.speaker}: ${turn.text}` : turn.text))
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(plain || result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toasts.success(t.transcribe.copySuccessToast);
    } catch {
      toasts.error(t.transcribe.copyErrorToast);
    }
  };

  return (
    <div className="space-y-5">
      <Dropzone
        accept={AUDIO_EXT}
        maxSizeMb={MAX_MB}
        disabled={busy}
        file={file}
        onFile={setFile}
        onError={toasts.error}
        hint={`${AUDIO_EXT.join(", ")} · ${t.transcribe.hint}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-ink/60">
            {t.transcribe.dilLabel}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={busy}
            className="w-full rounded-xl border-[3px] border-ink bg-white px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-4 focus:ring-bubble/40"
          >
            {t.transcribe.languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-ink/60">
            {t.transcribe.formatsLabel}
          </label>
          <div className="flex gap-2 pt-1">
            {FORMATS.map((f) => (
              <label
                key={f}
                className={[
                  "press cursor-pointer select-none rounded-xl border-[3px] border-ink px-3.5 py-2 font-display text-sm font-bold transition-all",
                  formats.includes(f)
                    ? "bg-bubble shadow-brutal-sm"
                    : "bg-white text-ink/50 hover:bg-paper",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formats.includes(f)}
                  onChange={() => toggleFormat(f)}
                  disabled={busy}
                />
                {f.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-[3px] border-ink bg-bubble/20 p-3.5 transition hover:bg-bubble/30">
        <input
          type="checkbox"
          checked={diarize}
          onChange={(e) => setDiarize(e.target.checked)}
          disabled={busy}
          className="mt-0.5 h-4 w-4 accent-bubble"
        />
        <span className="text-sm">
          <span className="font-display font-bold text-ink">
            {t.transcribe.diarizeTitle}
          </span>
          <span className="block text-xs text-ink/60">
            {t.transcribe.diarizeDesc}
          </span>
        </span>
      </label>

      {busy && (
        <ProgressBar
          percent={progress ?? 0}
          indeterminate={phase === "transcribe"}
          label={
            phase === "upload"
              ? t.transcribe.progressUpload
              : diarize
                ? t.transcribe.progressTranscribeDiarize
                : t.transcribe.progressTranscribe
          }
        />
      )}

      <button
        onClick={submit}
        disabled={busy || !file}
        className="press w-full rounded-xl border-[3px] border-ink bg-bubble px-4 py-3 font-display text-sm font-bold text-ink shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg disabled:pointer-events-none disabled:opacity-40 disabled:shadow-brutal"
      >
        {busy ? t.transcribe.working : t.transcribe.convertBtn}
      </button>

      {result && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-brutal-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-ink bg-paper px-4 py-2.5 text-xs text-ink/70">
              <span>
                {t.transcribe.metaLang}: <b className="text-ink">{result.language}</b> ·{" "}
                {t.transcribe.metaDuration}: {result.duration.toFixed(1)}s ·{" "}
                {result.segments.length} {t.transcribe.metaSegments}
                {result.speaker_count > 0 && (
                  <>
                    {" "}
                    · {result.speaker_count} {t.transcribe.metaSpeakers}
                  </>
                )}{" "}
                · {result.model ? `whisper ${result.model}` : result.backend}
              </span>
              <button
                onClick={copyText}
                className="press rounded-full border-2 border-ink bg-white px-3 py-1 font-display font-bold text-ink transition hover:bg-sun"
              >
                {copied ? t.transcribe.copiedBtn : t.transcribe.copyBtn}
              </button>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto p-4">
              {turns.map((turn, i) => (
                <div key={i} className="text-sm leading-relaxed">
                  {turn.speaker && (
                    <span
                      className={`mr-2 inline-block rounded-md border-2 border-ink px-1.5 py-0.5 font-display text-xs font-bold ${
                        SPEAKER_COLORS[
                          (speakerIndex.get(turn.speaker) ?? 0) % SPEAKER_COLORS.length
                        ]
                      }`}
                    >
                      {turn.speaker}
                      <span className="ml-1 font-normal opacity-70">
                        {fmtTime(turn.start)}
                      </span>
                    </span>
                  )}
                  <span className="text-ink/80">{turn.text}</span>
                </div>
              ))}
            </div>
          </div>

          {result.warnings?.length > 0 && (
            <ul className="space-y-1 rounded-xl border-[3px] border-ink bg-sun/40 px-4 py-2.5 text-xs font-medium text-ink">
              {result.warnings.map((w, i) => (
                <li key={i} className="flex gap-1.5">
                  <span aria-hidden="true">⚠️</span>
                  {w}
                </li>
              ))}
            </ul>
          )}

          <ResultCard
            title={t.transcribe.resultTitle}
            expiresAt={result.expires_at}
            onDismiss={() => setResult(null)}
            downloads={Object.entries(result.downloads).map(([fmt, url]) => ({
              label: fmt.toUpperCase(),
              url,
              filename: `${file?.name.replace(/\.[^.]+$/, "") ?? t.transcribe.defaultFilename}.${fmt}`,
            }))}
          />
        </div>
      )}
    </div>
  );
}
