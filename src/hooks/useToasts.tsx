import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLang } from "../lib/i18n/LanguageProvider";

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (kind: ToastKind, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t, { id, kind, message }]);
      window.setTimeout(() => dismiss(id), kind === "error" ? 7000 : 4000);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
      dismiss,
    }),
    [toasts, push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToasts(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used within <ToastProvider>");
  return ctx;
}

const KIND_STYLES: Record<ToastKind, string> = {
  success: "border-ink bg-leaf text-ink",
  error: "border-ink bg-bubble text-ink",
  info: "border-ink bg-sky/90 text-white",
};

const KIND_ICON_BG: Record<ToastKind, string> = {
  success: "bg-white",
  error: "bg-white",
  info: "bg-white text-sky",
};

const KIND_ICON: Record<ToastKind, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

function ToastViewport() {
  const { toasts, dismiss } = useToasts();
  const { t } = useLang();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-toast-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border-[3px] px-4 py-3 shadow-brutal ${KIND_STYLES[toast.kind]}`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-ink text-xs font-bold text-ink ${KIND_ICON_BG[toast.kind]}`}
          >
            {KIND_ICON[toast.kind]}
          </span>
          <p className="flex-1 pt-0.5 text-sm font-semibold leading-snug">{toast.message}</p>
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-none text-current/60 hover:text-current"
            aria-label={t.common.close}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
