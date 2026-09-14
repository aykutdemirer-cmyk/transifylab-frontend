import { useState } from "react";
import Dropzone from "./Dropzone";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";
import { useToasts } from "../hooks/useToasts";
import { useLang } from "../lib/i18n/LanguageProvider";
import {
  ApiError,
  convertDocxToPdf,
  convertPdfToWord,
  convertTextToPdf,
} from "../lib/api";
import type { JobResult } from "../lib/types";

type Mode = "pdf-to-word" | "docx-to-pdf" | "text-to-pdf";

const ACCEPT: Record<Mode, string[]> = {
  "pdf-to-word": [".pdf"],
  "docx-to-pdf": [".docx"],
  "text-to-pdf": [".txt", ".md"],
};

const MAX_MB = 100;

export default function ConverterPanel() {
  const toasts = useToasts();
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("pdf-to-word");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<JobResult | null>(null);

  const active = t.convert.modes.find((m) => m.id === mode)!;
  const busy = progress !== null;

  const reset = () => {
    setFile(null);
    setText("");
    setDocTitle("");
    setResult(null);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  const canSubmit =
    !busy &&
    (mode === "text-to-pdf" ? file !== null || text.trim().length > 0 : file !== null);

  const submit = async () => {
    setResult(null);
    setProgress(0);
    try {
      let res: JobResult;
      if (mode === "pdf-to-word") {
        res = await convertPdfToWord(file!, setProgress);
      } else if (mode === "docx-to-pdf") {
        res = await convertDocxToPdf(file!, setProgress);
      } else {
        res = await convertTextToPdf(
          file
            ? { file, title: docTitle || undefined }
            : {
                text,
                title: docTitle || undefined,
                filename: t.convert.defaultFilename,
              },
          setProgress,
        );
      }
      setResult(res);
      toasts.success(t.convert.successToast);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t.convert.errorToast;
      toasts.error(msg);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {t.convert.modes.map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={[
              "press inline-flex items-center gap-1.5 rounded-xl border-[3px] border-ink px-3.5 py-2 font-display text-sm font-bold transition-all",
              mode === m.id
                ? "bg-sun shadow-brutal-sm"
                : "bg-white text-ink/60 hover:bg-paper",
            ].join(" ")}
          >
            <span aria-hidden="true">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      <Dropzone
        accept={ACCEPT[mode]}
        maxSizeMb={MAX_MB}
        disabled={busy}
        file={file}
        onFile={setFile}
        onError={toasts.error}
        hint={active.hint}
      />

      {mode === "text-to-pdf" && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-ink/60">
              {t.convert.titleLabel}
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              disabled={busy}
              placeholder={t.convert.titlePlaceholder}
              className="w-full rounded-xl border-[3px] border-ink bg-white px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-4 focus:ring-sun/50"
            />
          </div>
          {!file && (
            <div>
              <label className="mb-1 block text-xs font-bold text-ink/60">
                {t.convert.pasteLabel}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={busy}
                rows={6}
                placeholder={t.convert.pastePlaceholder}
                className="w-full resize-y rounded-xl border-[3px] border-ink bg-white p-3.5 text-sm transition focus:outline-none focus:ring-4 focus:ring-sun/50"
              />
            </div>
          )}
        </div>
      )}

      {busy && <ProgressBar percent={progress ?? 0} label={t.convert.progressLabel} />}

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="press w-full rounded-xl border-[3px] border-ink bg-sun px-4 py-3 font-display text-sm font-bold text-ink shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg disabled:pointer-events-none disabled:opacity-40 disabled:shadow-brutal"
      >
        {busy ? t.convert.working : t.convert.convertBtn}
      </button>

      {result && (
        <ResultCard
          title={t.convert.resultReady(result.filename)}
          expiresAt={result.expires_at}
          onDismiss={() => setResult(null)}
          downloads={[
            {
              label: result.filename.split(".").pop()?.toUpperCase() ?? t.common.download,
              url: result.download_url,
              filename: result.filename,
            },
          ]}
        />
      )}
    </div>
  );
}
