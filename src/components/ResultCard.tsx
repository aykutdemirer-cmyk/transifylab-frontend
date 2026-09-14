import { useState } from "react";
import { ApiError, downloadFile } from "../lib/api";
import { useToasts } from "../hooks/useToasts";
import { useLang } from "../lib/i18n/LanguageProvider";

interface DownloadItem {
  label: string;
  url: string;
  filename: string;
}

interface Props {
  title: string;
  downloads: DownloadItem[];
  expiresAt?: string;
  onDismiss?: () => void;
}

export default function ResultCard({
  title,
  downloads,
  expiresAt,
  onDismiss,
}: Props) {
  const toasts = useToasts();
  const { lang, t } = useLang();
  const [busy, setBusy] = useState<string | null>(null);

  const handleDownload = async (item: DownloadItem) => {
    setBusy(item.url);
    try {
      await downloadFile(item.url, item.filename);
      toasts.success(t.resultCard.downloadedToast(item.filename));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t.resultCard.downloadErrorToast;
      toasts.error(msg);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-2xl border-[3px] border-ink bg-leaf/25 p-4 shadow-brutal-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border-[3px] border-ink bg-leaf text-base">
            ✓
          </div>
          <div>
            <p className="font-display text-sm font-bold text-ink">{title}</p>
            {expiresAt && (
              <p className="mt-0.5 text-xs text-ink/60">
                {t.resultCard.expires(
                  new Date(expiresAt).toLocaleTimeString(
                    lang === "tr" ? "tr-TR" : "en-US",
                  ),
                )}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-none rounded-full border-2 border-transparent p-1 text-ink/50 transition hover:border-ink hover:bg-white hover:text-ink"
            aria-label={t.common.close}
          >
            ✕
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {downloads.map((d) => (
          <button
            key={d.url}
            onClick={() => handleDownload(d)}
            disabled={busy !== null}
            className="press inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-white px-3.5 py-2 font-display text-sm font-bold text-ink shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-sun hover:shadow-brutal disabled:pointer-events-none disabled:opacity-60"
          >
            {busy === d.url ? t.resultCard.downloading : `⬇ ${d.label}`}
          </button>
        ))}
      </div>
    </div>
  );
}
