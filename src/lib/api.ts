import { DICTS, type Lang } from "./i18n/translations";
import type {
  HealthResponse,
  JobResult,
  TranscriptionResult,
} from "./types";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// This module has no access to React context, so LanguageProvider pushes the
// active language here directly. Only used for CLIENT-SIDE fallback messages
// (network failure, timeout, no server response) — an error `detail` coming
// back from the API itself is server text and is passed through as-is.
let currentLang: Lang = "en";
export const setApiLang = (lang: Lang): void => {
  currentLang = lang;
};
const apiT = () => DICTS[currentLang].api;

export const apiUrl = (path: string): string =>
  path.startsWith("http") ? path : `${BASE}${path}`;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface UploadOptions {
  path: string;
  form: FormData;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/**
 * POST multipart form data with real upload-progress events (fetch cannot do
 * this yet, so we use XMLHttpRequest).
 */
export function uploadForm<T>({
  path,
  form,
  onProgress,
  signal,
}: UploadOptions): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl(path));
    xhr.responseType = "json";

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const body = xhr.response;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        const detail =
          (body && (body.detail || body.message)) ||
          apiT().requestFailed(xhr.status);
        reject(new ApiError(xhr.status, String(detail)));
      }
    };

    xhr.onerror = () => reject(new ApiError(0, apiT().serverUnreachable));
    xhr.ontimeout = () => reject(new ApiError(0, apiT().timeout));

    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
      xhr.onabort = () => reject(new ApiError(0, apiT().cancelled));
    }

    xhr.send(form);
  });
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(apiUrl("/api/v1/health"));
  if (!res.ok) throw new ApiError(res.status, apiT().healthCheckFailed);
  return res.json();
}

export const convertPdfToWord = (
  file: File,
  onProgress?: (p: number) => void,
  signal?: AbortSignal,
) => {
  const form = new FormData();
  form.append("file", file);
  return uploadForm<JobResult>({
    path: "/api/v1/convert/pdf-to-word",
    form,
    onProgress,
    signal,
  });
};

export const convertDocxToPdf = (
  file: File,
  onProgress?: (p: number) => void,
  signal?: AbortSignal,
) => {
  const form = new FormData();
  form.append("file", file);
  return uploadForm<JobResult>({
    path: "/api/v1/convert/docx-to-pdf",
    form,
    onProgress,
    signal,
  });
};

export const convertTextToPdf = (
  opts: { file?: File; text?: string; filename?: string; title?: string },
  onProgress?: (p: number) => void,
  signal?: AbortSignal,
) => {
  const form = new FormData();
  if (opts.file) form.append("file", opts.file);
  if (opts.text) form.append("text", opts.text);
  if (opts.filename) form.append("filename", opts.filename);
  if (opts.title) form.append("title", opts.title);
  return uploadForm<JobResult>({
    path: "/api/v1/convert/text-to-pdf",
    form,
    onProgress,
    signal,
  });
};

export const transcribeAudio = (
  opts: {
    file: File;
    language?: string;
    formats?: string[];
    diarize?: boolean;
  },
  onProgress?: (p: number) => void,
  signal?: AbortSignal,
) => {
  const form = new FormData();
  form.append("file", opts.file);
  if (opts.language) form.append("language", opts.language);
  form.append("formats", (opts.formats ?? ["txt", "srt", "json"]).join(","));
  if (opts.diarize) form.append("diarize", "true");
  return uploadForm<TranscriptionResult>({
    path: "/api/v1/transcribe",
    form,
    onProgress,
    signal,
  });
};

/** Trigger a browser download for a job output file. */
export async function downloadFile(
  downloadUrl: string,
  filename: string,
): Promise<void> {
  const res = await fetch(apiUrl(downloadUrl));
  if (!res.ok) {
    let detail = apiT().downloadFailed(res.status);
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(res.status, detail);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const deleteJob = (jobId: string): Promise<Response> =>
  fetch(apiUrl(`/api/v1/files/${jobId}`), { method: "DELETE" });
