export type JobKind =
  | "pdf_to_word"
  | "docx_to_pdf"
  | "text_to_pdf"
  | "transcription";

export interface JobResult {
  job_id: string;
  kind: JobKind;
  status: "completed" | "failed";
  filename: string;
  size_bytes: number;
  download_url: string;
  expires_at: string;
  detail?: string | null;
}

export interface TranscriptionSegment {
  index: number;
  start: number;
  end: number;
  text: string;
  speaker?: string | null;
}

export interface TranscriptionResult {
  job_id: string;
  language: string;
  duration: number;
  text: string;
  segments: TranscriptionSegment[];
  backend: string;
  model?: string | null;
  speaker_count: number;
  warnings: string[];
  downloads: Record<string, string>;
  expires_at: string;
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  transcription_backend: string;
  features: Record<string, boolean>;
}
