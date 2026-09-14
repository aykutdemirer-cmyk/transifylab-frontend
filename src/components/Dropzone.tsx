import { useCallback, useId, useRef, useState, type DragEvent } from "react";
import { useLang } from "../lib/i18n/LanguageProvider";

interface Props {
  /** Accepted extensions, e.g. [".pdf"]. Used for validation + the file input. */
  accept: string[];
  /** Max size in MB; rejected files call onError. */
  maxSizeMb: number;
  disabled?: boolean;
  file: File | null;
  onFile: (file: File | null) => void;
  onError: (message: string) => void;
  hint?: string;
}

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

export default function Dropzone({
  accept,
  maxSizeMb,
  disabled,
  file,
  onFile,
  onError,
  hint,
}: Props) {
  const { t } = useLang();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const validateAndSet = useCallback(
    (f: File | undefined | null) => {
      if (!f) return;
      const ext = extOf(f.name);
      if (accept.length && !accept.includes(ext)) {
        onError(t.dropzone.invalidType(ext, accept.join(", ")));
        return;
      }
      if (f.size > maxSizeMb * 1024 * 1024) {
        onError(t.dropzone.tooLarge(maxSizeMb));
        return;
      }
      if (f.size === 0) {
        onError(t.dropzone.empty);
        return;
      }
      onFile(f);
    },
    [accept, maxSizeMb, onFile, onError, t],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled)
            inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-disabled={disabled}
        className={[
          "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-[3px] px-6 py-10 text-center transition-all duration-200",
          dragging
            ? "scale-[1.015] border-ink bg-sun/25 shadow-brutal"
            : file
              ? "border-ink bg-leaf/15 shadow-brutal-sm"
              : "border-dashed border-ink/30 bg-white hover:border-ink hover:bg-paper",
          disabled ? "pointer-events-none opacity-50" : "",
        ].join(" ")}
      >
        <div
          className={[
            "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-ink text-2xl transition-transform group-hover:-rotate-3 group-hover:scale-105",
            file ? "bg-leaf" : "bg-sun",
          ].join(" ")}
        >
          {file ? "✅" : "📤"}
        </div>
        {file ? (
          <p className="text-sm font-semibold text-ink">
            {file.name}{" "}
            <span className="font-normal text-ink/50">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </p>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink">
              {t.dropzone.dragPrompt}{" "}
              <span className="underline decoration-sun decoration-4 underline-offset-2">
                {t.dropzone.chooseLink}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink/45">
              {hint ?? `${accept.join(", ")} · ${t.dropzone.maxSize(maxSizeMb)}`}
            </p>
          </>
        )}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept.join(",")}
          disabled={disabled}
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {file && !disabled && (
        <button
          type="button"
          onClick={() => {
            onFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-2 text-xs font-bold text-ink/50 underline decoration-ink/30 underline-offset-2 transition hover:text-ink hover:decoration-ink"
        >
          {t.dropzone.removeFile}
        </button>
      )}
    </div>
  );
}
