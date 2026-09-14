export type Lang = "tr" | "en";

export interface Dict {
  common: { close: string; download: string };
  app: { name: string; tagline: string };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    chips: [icon: string, label: string][];
  };
  nav: { convert: string; transcribe: string };
  sidebar: {
    howItWorks: string;
    steps: { title: string; desc: string }[];
    tipTitle: string;
    tipConvert: string;
    tipTranscribe: string;
    privacyTitle: string;
    privacyItems: string[];
  };
  footer: {
    offline: string;
    connecting: string;
    features: Record<string, string>;
  };
  convert: {
    modes: { id: "pdf-to-word" | "docx-to-pdf" | "text-to-pdf"; label: string; icon: string; hint: string }[];
    titleLabel: string;
    titlePlaceholder: string;
    pasteLabel: string;
    pastePlaceholder: string;
    convertBtn: string;
    working: string;
    progressLabel: string;
    successToast: string;
    errorToast: string;
    resultReady: (filename: string) => string;
    defaultFilename: string;
  };
  transcribe: {
    hint: string;
    languages: { value: string; label: string }[];
    dilLabel: string;
    formatsLabel: string;
    diarizeTitle: string;
    diarizeDesc: string;
    progressUpload: string;
    progressTranscribe: string;
    progressTranscribeDiarize: string;
    convertBtn: string;
    working: string;
    metaLang: string;
    metaDuration: string;
    metaSegments: string;
    metaSpeakers: string;
    copyBtn: string;
    copiedBtn: string;
    successToast: (speakerCount: number) => string;
    errorToast: string;
    copySuccessToast: string;
    copyErrorToast: string;
    resultTitle: string;
    formatsRequired: string;
    defaultFilename: string;
  };
  dropzone: {
    dragPrompt: string;
    chooseLink: string;
    removeFile: string;
    invalidType: (ext: string, accept: string) => string;
    tooLarge: (maxMb: number) => string;
    maxSize: (maxMb: number) => string;
    empty: string;
  };
  resultCard: {
    downloading: string;
    downloadedToast: (filename: string) => string;
    downloadErrorToast: string;
    expires: (time: string) => string;
  };
  api: {
    requestFailed: (status: number) => string;
    serverUnreachable: string;
    cancelled: string;
    timeout: string;
    healthCheckFailed: string;
    downloadFailed: (status: number) => string;
  };
}

const tr: Dict = {
  common: { close: "Kapat", download: "İndir" },
  app: { name: "Dosya Dönüştürücü", tagline: "Belge · PDF · Ses → Metin" },
  hero: {
    badge: "✨ Hızlı · ücretsiz · tarayıcında çalışır",
    titleLine1: "Dosyalarını saniyeler",
    titleLine2: "içinde dönüştür",
    subtitle:
      "PDF ↔ Word, metinden PDF'e ve ses kayıtlarından konuşmacı ayrımlı metne — hepsi tarayıcından, tek tıkla.",
    chips: [
      ["📄", "PDF ↔ Word"],
      ["✍️", "Metin → PDF"],
      ["🎙️", "Ses → Metin"],
    ],
  },
  nav: { convert: "Belge Dönüştürme", transcribe: "Ses → Metin" },
  sidebar: {
    howItWorks: "Nasıl çalışır?",
    steps: [
      { title: "Dosyanı yükle", desc: "Sürükle-bırak ya da metni yapıştır." },
      { title: "Ayarları seç", desc: "Dil, format, başlık — ihtiyacına göre." },
      { title: "İndir", desc: "Sonucu tek tıkla bilgisayarına kaydet." },
    ],
    tipTitle: "İpucu",
    tipConvert:
      "Word → PDF ya da Metin → PDF'te bir başlık girersen belgen otomatik olarak daha düzenli ve profesyonel görünür.",
    tipTranscribe:
      "Telefon kayıtları için Konuşmacı Ayrımı'nı açık bırak — kim ne demiş net biçimde ayrılır.",
    privacyTitle: "Gizlilik",
    privacyItems: [
      "Dosyalar işlem bitince otomatik silinir",
      "Kalıcı olarak sunucuda saklanmaz",
      "Tamamen ücretsiz, sınırsız kullanım",
    ],
  },
  footer: {
    offline: "Backend'e ulaşılamıyor — API çalışıyor mu?",
    connecting: "Bağlanıyor…",
    features: {
      pdf_to_word: "PDF → Word",
      docx_to_pdf: "Word → PDF",
      text_to_pdf: "Metin → PDF",
      faster_whisper: "Yerel STT",
      openai_whisper: "OpenAI STT",
      diarization: "Konuşmacı Ayrımı",
    },
  },
  convert: {
    modes: [
      { id: "pdf-to-word", label: "PDF → Word", icon: "📄", hint: "PDF · maks. 100 MB" },
      { id: "docx-to-pdf", label: "Word → PDF", icon: "📝", hint: "DOCX · maks. 100 MB" },
      { id: "text-to-pdf", label: "Metin → PDF", icon: "✍️", hint: "TXT/MD veya aşağıya yazın" },
    ],
    titleLabel: "Belge başlığı (opsiyonel)",
    titlePlaceholder: "Boş bırakılırsa PDF'te başlık gösterilmez",
    pasteLabel: "…veya metni buraya yapıştırın",
    pastePlaceholder: "PDF'e dönüştürülecek metin…",
    convertBtn: "✨ Dönüştür",
    working: "İşleniyor…",
    progressLabel: "Yükleniyor / dönüştürülüyor…",
    successToast: "Dönüştürme tamamlandı.",
    errorToast: "Dönüştürme sırasında bir hata oluştu.",
    resultReady: (filename) => `${filename} hazır`,
    defaultFilename: "belge",
  },
  transcribe: {
    hint: "maks. 100 MB",
    languages: [
      { value: "", label: "Otomatik algıla" },
      { value: "tr", label: "Türkçe" },
      { value: "en", label: "İngilizce" },
    ],
    dilLabel: "Dil",
    formatsLabel: "Çıktı formatları",
    diarizeTitle: "🗣️ Konuşmacı ayrımı",
    diarizeDesc:
      "Her cümleyi konuşana göre etiketler (Konuşmacı 1 / Konuşmacı 2…). Telefon görüşmeleri için önerilir; işlemi biraz uzatır.",
    progressUpload: "Ses dosyası yükleniyor…",
    progressTranscribe: "Metne dönüştürülüyor…",
    progressTranscribeDiarize: "Metne dönüştürülüyor + konuşmacılar ayrılıyor…",
    convertBtn: "🎧 Metne Dönüştür",
    working: "İşleniyor…",
    metaLang: "Dil",
    metaDuration: "Süre",
    metaSegments: "segment",
    metaSpeakers: "konuşmacı",
    copyBtn: "Metni kopyala",
    copiedBtn: "Kopyalandı ✓",
    successToast: (n) => `Transkripsiyon tamamlandı${n ? ` · ${n} konuşmacı` : ""}.`,
    errorToast: "Transkripsiyon sırasında bir hata oluştu.",
    copySuccessToast: "Metin panoya kopyalandı.",
    copyErrorToast: "Panoya kopyalanamadı.",
    resultTitle: "Transkript dosyaları hazır",
    formatsRequired: "En az bir çıktı formatı seçin.",
    defaultFilename: "transkript",
  },
  dropzone: {
    dragPrompt: "Dosyayı buraya sürükleyin veya",
    chooseLink: "seçin",
    removeFile: "Dosyayı kaldır",
    invalidType: (ext, accept) =>
      `Geçersiz dosya türü "${ext || "?"}". İzin verilen: ${accept}`,
    tooLarge: (maxMb) => `Dosya çok büyük (maks. ${maxMb} MB).`,
    maxSize: (maxMb) => `maks. ${maxMb} MB`,
    empty: "Dosya boş görünüyor.",
  },
  resultCard: {
    downloading: "İndiriliyor…",
    downloadedToast: (filename) => `${filename} indirildi.`,
    downloadErrorToast: "İndirme başarısız oldu.",
    expires: (time) => `Geçici bağlantı ${time} tarihinde sona erer.`,
  },
  api: {
    requestFailed: (status) => `İstek başarısız oldu (HTTP ${status})`,
    serverUnreachable: "Sunucuya ulaşılamadı. Backend çalışıyor mu?",
    cancelled: "İşlem iptal edildi.",
    timeout: "İstek zaman aşımına uğradı.",
    healthCheckFailed: "Sağlık kontrolü başarısız.",
    downloadFailed: (status) => `İndirme başarısız (HTTP ${status})`,
  },
};

const en: Dict = {
  common: { close: "Close", download: "Download" },
  app: { name: "File Converter", tagline: "Documents · PDF · Speech to Text" },
  hero: {
    badge: "✨ Fast · free · runs in your browser",
    titleLine1: "Convert your files",
    titleLine2: "in seconds",
    subtitle:
      "PDF ↔ Word, text to PDF, and audio recordings to speaker-labelled text — all from your browser, one click.",
    chips: [
      ["📄", "PDF ↔ Word"],
      ["✍️", "Text → PDF"],
      ["🎙️", "Speech → Text"],
    ],
  },
  nav: { convert: "Document Conversion", transcribe: "Speech to Text" },
  sidebar: {
    howItWorks: "How it works",
    steps: [
      { title: "Upload your file", desc: "Drag & drop, or paste text directly." },
      { title: "Choose your settings", desc: "Language, format, title — as needed." },
      { title: "Download", desc: "Save the result to your computer in one click." },
    ],
    tipTitle: "Tip",
    tipConvert:
      "Add a title in Word → PDF or Text → PDF and your document looks neatly formatted and professional automatically.",
    tipTranscribe:
      "For phone recordings, leave Speaker Separation on — it clearly splits who said what.",
    privacyTitle: "Privacy",
    privacyItems: [
      "Files are deleted automatically once processed",
      "Nothing is stored permanently on the server",
      "Completely free, unlimited use",
    ],
  },
  footer: {
    offline: "Can't reach the backend — is the API running?",
    connecting: "Connecting…",
    features: {
      pdf_to_word: "PDF → Word",
      docx_to_pdf: "Word → PDF",
      text_to_pdf: "Text → PDF",
      faster_whisper: "Local STT",
      openai_whisper: "OpenAI STT",
      diarization: "Speaker Separation",
    },
  },
  convert: {
    modes: [
      { id: "pdf-to-word", label: "PDF → Word", icon: "📄", hint: "PDF · max 100 MB" },
      { id: "docx-to-pdf", label: "Word → PDF", icon: "📝", hint: "DOCX · max 100 MB" },
      { id: "text-to-pdf", label: "Text → PDF", icon: "✍️", hint: "TXT/MD or type below" },
    ],
    titleLabel: "Document title (optional)",
    titlePlaceholder: "Leave empty for no title on the PDF",
    pasteLabel: "…or paste your text here",
    pastePlaceholder: "Text to convert to PDF…",
    convertBtn: "✨ Convert",
    working: "Working…",
    progressLabel: "Uploading / converting…",
    successToast: "Conversion complete.",
    errorToast: "Something went wrong during conversion.",
    resultReady: (filename) => `${filename} is ready`,
    defaultFilename: "document",
  },
  transcribe: {
    hint: "max 100 MB",
    languages: [
      { value: "", label: "Auto-detect" },
      { value: "tr", label: "Turkish" },
      { value: "en", label: "English" },
    ],
    dilLabel: "Language",
    formatsLabel: "Output formats",
    diarizeTitle: "🗣️ Speaker separation",
    diarizeDesc:
      "Labels every sentence by speaker (Speaker 1 / Speaker 2…). Recommended for phone calls; adds some processing time.",
    progressUpload: "Uploading audio file…",
    progressTranscribe: "Transcribing…",
    progressTranscribeDiarize: "Transcribing + separating speakers…",
    convertBtn: "🎧 Convert to Text",
    working: "Working…",
    metaLang: "Language",
    metaDuration: "Duration",
    metaSegments: "segments",
    metaSpeakers: "speakers",
    copyBtn: "Copy text",
    copiedBtn: "Copied ✓",
    successToast: (n) => `Transcription complete${n ? ` · ${n} speakers` : ""}.`,
    errorToast: "Something went wrong during transcription.",
    copySuccessToast: "Text copied to clipboard.",
    copyErrorToast: "Couldn't copy to clipboard.",
    resultTitle: "Transcript files are ready",
    formatsRequired: "Choose at least one output format.",
    defaultFilename: "transcript",
  },
  dropzone: {
    dragPrompt: "Drag & drop a file here, or",
    chooseLink: "choose one",
    removeFile: "Remove file",
    invalidType: (ext, accept) =>
      `Invalid file type "${ext || "?"}". Allowed: ${accept}`,
    tooLarge: (maxMb) => `File is too large (max ${maxMb} MB).`,
    maxSize: (maxMb) => `max ${maxMb} MB`,
    empty: "The file appears to be empty.",
  },
  resultCard: {
    downloading: "Downloading…",
    downloadedToast: (filename) => `${filename} downloaded.`,
    downloadErrorToast: "Download failed.",
    expires: (time) => `This temporary link expires at ${time}.`,
  },
  api: {
    requestFailed: (status) => `Request failed (HTTP ${status})`,
    serverUnreachable: "Couldn't reach the server. Is the backend running?",
    cancelled: "Operation cancelled.",
    timeout: "The request timed out.",
    healthCheckFailed: "Health check failed.",
    downloadFailed: (status) => `Download failed (HTTP ${status})`,
  },
};

export const DICTS: Record<Lang, Dict> = { tr, en };
