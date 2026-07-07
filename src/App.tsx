import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  BookOpen,
  School,
  GraduationCap,
  Layers,
  Calendar,
  Clock,
  User,
  CheckSquare,
  Square,
  Play,
  Copy,
  Download,
  Lightbulb,
  HelpCircle,
  Smile,
  Moon,
  Sun,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  AlertCircle,
  FileDown,
  Trash2,
  Check
} from "lucide-react";

import { PRESET_TEMPLATES, PROFIL_LULUSAN, JENJANG_LIST, KELAS_MAP, FASE_MAP, LOCAL_ICE_BREAKERS } from "./data";
import { RppFormData, SavedRpp, ToastMessage } from "./types";
import Modal from "./components/Modal";
import ToastContainer from "./components/Toast";

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rpp_theme");
      return saved ? saved === "dark" : false;
    }
    return false;
  });

  // Form State
  const [formData, setFormData] = useState<RppFormData>({
    schoolName: "SMK Teknologi Digital",
    authorName: "DIDIK PRIHANTOKO, SE",
    subject: "Komputer Akuntansi",
    level: "SMK",
    grade: "11",
    semester: "1",
    phase: "Fase F",
    major: "Teknik Jaringan Komputer dan Telekomunikasi",
    timeAllocation: "24 JP (8 kali pertemuan @3 JP)",
    academicYear: "2025/2026",
    topic: "Program Komputer Akuntansi pada perusahaan",
    learningGoal: "Memahami program komputer akuntansi pada perusahaan",
    selectedProfiles: ["DPL 1", "DPL 3", "DPL 4", "DPL 5"],
  });

  // User Custom API Key
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_gemini_api_key") || "";
    }
    return "";
  });
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // App States
  const [generatedResult, setGeneratedResult] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [loadingStepText, setLoadingStepText] = useState<string>("Menyiapkan formulasi...");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [history, setHistory] = useState<SavedRpp[]>([]);

  // Modals for Quick Ideas
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isModalCopied, setIsModalCopied] = useState<boolean>(false);
  const [isIdeasLoading, setIsIdeasLoading] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("rpp_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load history from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem("rpp_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // Update Fase automatically based on Grade/Kelas selection
  useEffect(() => {
    const calculatedPhase = FASE_MAP[formData.grade] || "Fase E";
    if (formData.phase !== calculatedPhase) {
      setFormData((prev) => ({ ...prev, phase: calculatedPhase as any }));
    }
  }, [formData.grade]);

  // Toast helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Preset load handler
  const handleLoadPreset = (preset: RppFormData) => {
    setFormData(preset);
    showToast(`Template "${preset.subject}" berhasil dimuat!`, "success");
  };

  // API Key local persistence
  const handleApiKeyChange = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem("user_gemini_api_key", key);
  };

  // Dropdowns list changes based on Level
  const availableGrades = KELAS_MAP[formData.level] || ["1", "2", "3", "4", "5", "6"];

  // Toggle Profile Checklist
  const handleToggleProfile = (profileId: string) => {
    setFormData((prev) => {
      const selected = [...prev.selectedProfiles];
      if (selected.includes(profileId)) {
        return { ...prev, selectedProfiles: selected.filter((id) => id !== profileId) };
      } else {
        return { ...prev, selectedProfiles: [...selected, profileId] };
      }
    });
  };

  // Generate RPP Deep Learning
  const handleGenerate = async () => {
    if (!formData.schoolName.trim()) return showToast("Nama Sekolah wajib diisi", "error");
    if (!formData.subject.trim()) return showToast("Mata Pelajaran wajib diisi", "error");
    if (!formData.topic.trim()) return showToast("Materi Utama wajib diisi", "error");
    if (!formData.learningGoal.trim()) return showToast("Tujuan Pembelajaran wajib diisi", "error");

    setIsGenerating(true);
    setGenerationProgress(10);
    setLoadingStepText("Menganalisis karakteristik materi & peserta didik...");

    // Simulate steady progress increments
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        // Change text based on progress intervals for premium UX
        if (prev === 30) setLoadingStepText("Merumuskan strategi pilar Deep Learning...");
        if (prev === 55) setLoadingStepText("Mengintegrasikan Dimensi Profil Lulusan terpilih...");
        if (prev === 75) setLoadingStepText("Menyusun sintaks pembelajaran (Mindful, Meaningful, Joyful)...");
        if (prev === 88) setLoadingStepText("Merancang sistem penilaian otentik...");
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 800);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userApiKey,
        }),
      });

      const result = await response.json();

      if (result.success && result.text) {
        clearInterval(progressInterval);
        setGenerationProgress(100);
        setLoadingStepText("Modul pembelajaran berhasil diformulasikan!");
        
        setTimeout(() => {
          setGeneratedResult(result.text);
          setIsGenerating(false);
          showToast("Modul RPP Deep Learning berhasil dibuat!", "success");

          // Save to history
          const newHistoryItem: SavedRpp = {
            id: Date.now().toString(),
            ...formData,
            generatedText: result.text,
            createdAt: new Date().toLocaleString("id-ID"),
          };
          const updatedHistory = [newHistoryItem, ...history.slice(0, 9)]; // Keep max 10
          setHistory(updatedHistory);
          localStorage.setItem("rpp_history", JSON.stringify(updatedHistory));
        }, 800);
      } else {
        throw new Error(result.error || "Gagal melakukan generate modul.");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      showToast(error.message || "Koneksi terputus atau terjadi kesalahan server.", "error");
    }
  };

  // Copy text helper
  const handleCopyText = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    showToast("Teks berhasil disalin ke clipboard!", "success");
  };

  // Fetch Ideas (Ide Modul, Ide Pertanyaan Pemantik, Ide Ice Breaking)
  const handleFetchIdeas = async (type: "modul" | "pemantik" | "icebreaking") => {
    setIsIdeasLoading(true);
    let titleStr = "";
    if (type === "modul") titleStr = "Ide Modul Pembelajaran Kreatif";
    if (type === "pemantik") titleStr = "Ide Pertanyaan Pemantik Inovatif";
    if (type === "icebreaking") titleStr = "Ide Ice Breaking Joyful";

    setModalTitle(titleStr);
    setModalContent("Sedang merumuskan gagasan kreatif dari database AI...");
    setModalOpen(true);
    setIsModalCopied(false);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          userApiKey,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success && result.text) {
        setModalContent(result.text);
      } else {
        throw new Error(result.error || "Gagal memanggil modul database.");
      }
    } catch (err: any) {
      // Local Database Fallback if offline/error to satisfy the user prompt perfectly
      if (type === "icebreaking") {
        const icebreakers = LOCAL_ICE_BREAKERS.map(
          (ib) => `### ${ib.title}\n* **Jenjang**: ${ib.level}\n* **Peralatan**: ${ib.tools}\n* **Cara Bermain**: ${ib.howToPlay}\n`
        ).join("\n");
        setModalContent(`### Database Ice Breaking Joyful (Offline Fallback)\n\n${icebreakers}`);
        showToast("Menampilkan database lokal sebagai alternatif.", "info");
      } else if (type === "modul") {
        setModalContent(`### Skenario Modul Komputer Akuntansi (Offline Fallback)
        
1. **Skenario 'Kasir Toko Kita' (Joyful)**
   * **Aktivitas**: Siswa mensimulasikan pencatatan transaksi kas masuk dan kas keluar dengan studi kasus toko sekolah atau koperasi.
   * **Fokus**: Belajar asyik tanpa terbebani kerumitan teori dasar terlebih dahulu.

2. **Skenario 'Audit Investigasi Kelas' (Meaningful)**
   * **Aktivitas**: Siswa diberikan laporan keuangan yang memiliki ketidakseimbangan (error) dan bertugas sebagai tim auditor forensic mencari letak salah entry.
   * **Fokus**: Mengasah kemampuan penalaran kritis siswa dalam dunia nyata.`);
        showToast("Menampilkan database lokal sebagai alternatif.", "info");
      } else {
        setModalContent(`### Ide Pertanyaan Pemantik Kreatif (Offline Fallback)

1. *"Jika komputer akuntansi bisa otomatis menghitung segalanya, apa sisa nilai profesional yang membuat manusia lebih unggul dari mesin?"*
2. *"Mengapa ketidakseimbangan Rp1,- di dalam laporan neraca akhir bisa menghentikan audit sebuah perusahaan raksasa?"*
3. *"Bagaimana perasaanmu jika seluruh catatan usahamu hilang karena lupa menekan tombol 'Save'?"*`);
        showToast("Menampilkan database lokal sebagai alternatif.", "info");
      }
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // Download .doc File Helper
  const handleDownloadDoc = () => {
    if (!generatedResult) return;

    // Convert generatedResult markdown-ish headings to HTML with Microsoft Word styling
    const formattedHtml = generatedResult
      .split("\n")
      .map((line) => {
        if (line.startsWith("RPP AJAR") || line.startsWith("A. ") || line.startsWith("B. ") || line.startsWith("C. ") || line.startsWith("D. ") || line.startsWith("E. ") || line.startsWith("F. ") || line.startsWith("G. ") || line.startsWith("H. ") || line.startsWith("DESAIN PEMBELAJARAN") || line.startsWith("KEMITRAAN PEMBELAJARAN") || line.startsWith("LINGKUNGAN BELAJAR") || line.startsWith("PEMANFAATAN DIGITAL")) {
          return `<h2 style="font-family: 'Arial'; color: #1e3a8a; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1px solid #ddd; padding-bottom: 4pt;">${line}</h2>`;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<li style="font-family: 'Arial'; font-size: 11pt; margin-left: 20pt; line-height: 150%; color: #333;">${line.substring(2)}</li>`;
        }
        if (line.trim() === "Mengetahui" || line.includes("Kepala Sekolah") || line.includes("Guru Mata Pelajaran")) {
          return `<p style="font-family: 'Arial'; font-size: 11pt; line-height: 150%; text-align: center; margin-top: 12pt;">${line}</p>`;
        }
        if (line.trim().startsWith("................")) {
          return `<p style="font-family: 'Arial'; font-size: 11pt; line-height: 150%; text-align: center; margin-top: 24pt;">${line}</p>`;
        }
        return `<p style="font-family: 'Arial'; font-size: 11pt; line-height: 150%; margin-bottom: 6pt; color: #333;">${line}</p>`;
      })
      .join("");

    const documentTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>RPP Deep Learning</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21cm 29.7cm; /* A4 size */
            margin: 2.54cm 2.54cm 2.54cm 2.54cm; /* Standard margins */
          }
          body {
            font-family: 'Arial', sans-serif;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 24pt;">
          <h1 style="font-family: 'Arial'; font-size: 18pt; color: #1e3a8a; margin: 0; text-transform: uppercase;">Generator Modul Pembelajaran Deep Learning</h1>
          <p style="font-family: 'Arial'; font-size: 10pt; color: #555; margin-top: 4pt; margin-bottom: 0;">By. DIDIK PRIHANTOKO, SE</p>
        </div>
        ${formattedHtml}
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + documentTemplate], {
      type: "application/msword;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPP_Deep_Learning_${formData.subject.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Berkas .doc berhasil diunduh!", "success");
  };

  // Helper to quickly fill standard input fields based on history or presets
  const handleReloadHistory = (histItem: SavedRpp) => {
    setFormData({
      schoolName: histItem.schoolName,
      authorName: histItem.authorName,
      subject: histItem.subject,
      level: histItem.level,
      grade: histItem.grade,
      semester: histItem.semester,
      phase: histItem.phase,
      major: histItem.major,
      timeAllocation: histItem.timeAllocation,
      academicYear: histItem.academicYear,
      topic: histItem.topic,
      learningGoal: histItem.learningGoal,
      selectedProfiles: histItem.selectedProfiles,
    });
    setGeneratedResult(histItem.generatedText);
    showToast(`Histori sesi "${histItem.subject}" berhasil dimuat!`, "info");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("rpp_history");
    showToast("Histori penulisan berhasil dibersihkan", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-12 selection:bg-blue-500/30">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Modern Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/80 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-blue-600 dark:text-blue-400 sm:text-base">
                GENERATOR MODUL PEMBELAJARAN DEEP LEARNING
              </h1>
              <p className="text-2xs font-bold text-slate-500 dark:text-slate-400 sm:text-xs">
                By. DIDIK PRIHANTOKO, SE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Ganti Tema Visual"
              id="btn-dark-mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero Section & Quick Presets */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl shadow-blue-500/10 sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-2xs font-semibold tracking-wider uppercase">
              Merdeka & Deep Learning 3.5
            </span>
            <h2 className="mt-3 text-xl font-black sm:text-3xl">
              Rancang Skenario Belajar Mindful, Meaningful, & Joyful
            </h2>
            <p className="mt-2 text-xs text-blue-100 sm:text-sm">
              Buat Modul Ajar Kurikulum Merdeka berpendekatan Deep Learning secara cepat, cerdas, dan lengkap terstruktur siap cetak.
            </p>
          </div>

          {/* Quick Select Presets */}
          <div className="mt-6 border-t border-white/20 pt-6">
            <h3 className="text-2xs font-bold tracking-wider uppercase text-blue-100 sm:text-xs">
              Pilih Contoh Cepat (Satu Klik):
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(tpl.data)}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold hover:bg-white/25 active:scale-95 transition"
                  id={`preset-btn-${idx}`}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Input API Key */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  API Key Gemini Anda (Opsional)
                </label>
                <div className="rounded-full bg-blue-50 px-2 py-0.5 text-3xs font-extrabold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  SERVER FALLBACK ACTIVE
                </div>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={userApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Masukkan API Key Gemini Anda jika ada..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-xs font-medium focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                  id="input-api-key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  id="btn-toggle-apikey-visibility"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-3xs leading-relaxed text-slate-400">
                * Kosongkan kolom di atas jika ingin menggunakan kuota API Key default dari server kami secara gratis.
              </p>
            </div>

            {/* Part 1: Identitas Sekolah & Modul */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <School className="h-4 w-4 text-blue-500" />
                <h3 className="font-sans text-xs font-black tracking-wide uppercase text-slate-700 dark:text-slate-300">
                  Identitas Sekolah & Modul
                </h3>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Nama Sekolah */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="Contoh: SMK Teknologi Digital"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-school-name"
                  />
                </div>

                {/* Nama Penyusun / Guru */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Nama Penyusun / Guru
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Contoh: DIDIK PRIHANTOKO, SE"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-author-name"
                  />
                </div>

                {/* Mata Pelajaran */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Komputer Akuntansi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-subject"
                  />
                </div>

                {/* Jenjang Dropdown */}
                <div>
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Jenjang
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => {
                      const selectedLevel = e.target.value as any;
                      const availableGradesForLevel = KELAS_MAP[selectedLevel] || ["1"];
                      setFormData({
                        ...formData,
                        level: selectedLevel,
                        grade: availableGradesForLevel[0], // Reset grade to first match
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="select-level"
                  >
                    {JENJANG_LIST.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kelas Dropdown */}
                <div>
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Kelas
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="select-grade"
                  >
                    {availableGrades.map((g) => (
                      <option key={g} value={g}>
                        Kelas {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester Dropdown */}
                <div>
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="select-semester"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>

                {/* Fase Dropdown (Computed state but editable) */}
                <div>
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Fase (Otomatis)
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="select-phase"
                  >
                    <option value="Fase A">Fase A</option>
                    <option value="Fase B">Fase B</option>
                    <option value="Fase C">Fase C</option>
                    <option value="Fase D">Fase D</option>
                    <option value="Fase E">Fase E</option>
                    <option value="Fase F">Fase F</option>
                  </select>
                </div>

                {/* Jurusan (Only visible if level is SMA, SMK, or MA) */}
                {["SMA", "SMK", "MA"].includes(formData.level) && (
                  <div className="col-span-2">
                    <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                      Jurusan / Kompetensi Keahlian
                    </label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Contoh: Desain Komunikasi Visual"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                      id="input-major"
                    />
                  </div>
                )}

                {/* Alokasi Waktu */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Alokasi Waktu
                  </label>
                  <input
                    type="text"
                    value={formData.timeAllocation}
                    onChange={(e) => setFormData({ ...formData, timeAllocation: e.target.value })}
                    placeholder="Contoh: 24 JP (8 kali pertemuan @3 JP)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-time-allocation"
                  />
                </div>

                {/* Tahun Pelajaran */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Tahun Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="Contoh: 2025/2026"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-academic-year"
                  />
                </div>

                {/* Materi Utama */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Materi Utama
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Contoh: Program Komputer Akuntansi pada perusahaan"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-topic"
                  />
                </div>

                {/* Tujuan Pembelajaran */}
                <div className="col-span-2">
                  <label className="mb-1 block text-2xs font-bold text-slate-500 dark:text-slate-400">
                    Tujuan Pembelajaran
                  </label>
                  <textarea
                    value={formData.learningGoal}
                    onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                    placeholder="Contoh: Memahami program komputer akuntansi pada perusahaan"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 transition"
                    id="input-learning-goal"
                  />
                </div>
              </div>
            </div>

            {/* Checklist: Dimensi Profil Lulusan */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 mb-3">
                <CheckSquare className="h-4 w-4 text-blue-500" />
                <h3 className="font-sans text-xs font-black tracking-wide uppercase text-slate-700 dark:text-slate-300">
                  Dimensi Profil Lulusan
                </h3>
              </div>

              <div className="space-y-2">
                {PROFIL_LULUSAN.map((profile) => {
                  const isChecked = formData.selectedProfiles.includes(profile.id);
                  return (
                    <button
                      type="button"
                      key={profile.id}
                      onClick={() => handleToggleProfile(profile.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left text-xs font-medium transition active:scale-[0.99] ${
                        isChecked
                          ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-100"
                          : "border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                      }`}
                      id={`btn-profile-${profile.id}`}
                    >
                      <div className="shrink-0 text-blue-600 dark:text-blue-400">
                        {isChecked ? (
                          <CheckSquare className="h-4.5 w-4.5" />
                        ) : (
                          <Square className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <span className="leading-tight">{profile.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Ideas Trigger Row */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h3 className="font-sans text-xs font-black tracking-wide uppercase text-slate-700 dark:text-slate-300">
                  Konsultasi Konsep Cepat (AI / Database)
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Ide Modul */}
                <button
                  type="button"
                  onClick={() => handleFetchIdeas("modul")}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center text-slate-700 hover:border-blue-200 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-blue-900/30 transition active:scale-95"
                  id="btn-idea-module"
                >
                  <Layers className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-3xs font-extrabold tracking-wide uppercase">
                    Ide Modul
                  </span>
                </button>

                {/* Ide Pertanyaan Pemantik */}
                <button
                  type="button"
                  onClick={() => handleFetchIdeas("pemantik")}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center text-slate-700 hover:border-blue-200 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-blue-900/30 transition active:scale-95"
                  id="btn-idea-pemantik"
                >
                  <HelpCircle className="h-5 w-5 text-indigo-500 mb-1" />
                  <span className="text-3xs font-extrabold tracking-wide uppercase">
                    Pemantik
                  </span>
                </button>

                {/* Ide Ice Breaking */}
                <button
                  type="button"
                  onClick={() => handleFetchIdeas("icebreaking")}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center text-slate-700 hover:border-blue-200 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-blue-900/30 transition active:scale-95"
                  id="btn-idea-icebreaker"
                >
                  <Smile className="h-5 w-5 text-emerald-500 mb-1" />
                  <span className="text-3xs font-extrabold tracking-wide uppercase">
                    Ice Breaking
                  </span>
                </button>
              </div>
            </div>

            {/* History List */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <h3 className="font-sans text-xs font-black tracking-wide uppercase text-slate-700 dark:text-slate-300">
                      Histori Pembuatan
                    </h3>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-3xs font-black tracking-wider uppercase text-rose-500 hover:text-rose-700 hover:underline"
                    id="btn-clear-history"
                  >
                    Bersihkan
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleReloadHistory(item)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-2 text-left hover:border-blue-100 hover:bg-blue-50/10 dark:border-slate-800/60 dark:bg-slate-950/30 transition"
                      id={`btn-reload-history-${item.id}`}
                    >
                      <div className="truncate pr-3">
                        <p className="truncate text-2xs font-bold text-slate-700 dark:text-slate-300">
                          {item.subject}
                        </p>
                        <p className="text-4xs text-slate-400">
                          {item.createdAt}
                        </p>
                      </div>
                      <ChevronRightTiny className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Output Preview Card */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
            {/* Control bar above paper */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-100/50 p-3 rounded-2xl border border-slate-200/60 dark:bg-slate-900/30 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-2xs font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Pratinjau Hasil RPP
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopyText(generatedResult)}
                  disabled={!generatedResult || isGenerating}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-blue-600 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  id="btn-copy-result"
                  title="Salin Teks Lengkap"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Teks</span>
                </button>

                {/* Download doc Button */}
                <button
                  onClick={handleDownloadDoc}
                  disabled={!generatedResult || isGenerating}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 active:scale-95 disabled:pointer-events-none disabled:opacity-40 transition"
                  id="btn-download-doc"
                  title="Unduh Berkas format Microsoft Word .doc"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .doc</span>
                </button>
              </div>
            </div>

            {/* Paper Panel */}
            <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40 relative overflow-hidden dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none flex flex-col justify-between">
              {/* Paper Content Area */}
              <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    /* Loading State with animated progress bar */
                    <motion.div
                      key="generating-loader"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/95 dark:bg-slate-900/95 z-10"
                      id="container-loading"
                    >
                      {/* Beautiful Spinning AI Orbit Animation */}
                      <div className="relative flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
                        <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
                      </div>

                      <h3 className="mt-6 font-sans text-sm font-black text-slate-800 dark:text-white">
                        Tunggu sebentar, dalam proses (+_+)
                      </h3>
                      
                      <p className="mt-1 text-2xs font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
                        {loadingStepText}
                      </p>

                      {/* Custom Progress Bar */}
                      <div className="mt-6 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          className="h-2 bg-linear-to-r from-blue-500 to-indigo-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${generationProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="mt-2 text-3xs font-bold text-slate-400">
                        Memproses {generationProgress}%
                      </span>
                    </motion.div>
                  ) : generatedResult ? (
                    /* Render Generated Result with standard RPP paper styling */
                    <motion.div
                      key="generated-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 font-medium whitespace-pre-wrap selection:bg-blue-600/20"
                      id="rendered-rpp-output"
                    >
                      {/* Document Meta Header for aesthetic feel */}
                      <div className="border-b-2 border-dashed border-slate-200 pb-4 mb-6 dark:border-slate-800 text-center">
                        <h4 className="font-sans text-xs font-black tracking-widest text-slate-400 uppercase">
                          DOKUMEN HASIL FORMULASI RPP
                        </h4>
                        <p className="text-3xs text-slate-400 font-sans mt-0.5">
                          Metode Deep Learning (Mindful, Meaningful, Joyful)
                        </p>
                      </div>

                      {/* Render text with slightly better typography */}
                      <div>
                        {generatedResult}
                      </div>
                    </motion.div>
                  ) : (
                    /* Initial Empty State */
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400"
                      id="rendered-empty-state"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 dark:bg-slate-950/40 mb-4 border border-slate-200/50 dark:border-slate-800/40">
                        <FileDown className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                      </div>
                      <h3 className="font-sans text-sm font-black text-slate-700 dark:text-slate-300">
                        Belum ada RPP yang Dibuat
                      </h3>
                      <p className="mt-1 max-w-sm text-2xs font-semibold leading-relaxed text-slate-400">
                        Isi form di samping atau muat template preset siap pakai, lalu klik tombol <b>Generate</b> di bawah untuk merancang modul ajar deep learning Anda.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-3.5 px-6 font-sans text-sm font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 transition"
                  id="btn-generate-rpp"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>{isGenerating ? "Tunggu sebentar, dalam proses (+_+)" : "Generate"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pop-up Modal for ideas */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
        onCopy={() => {
          handleCopyText(modalContent);
          setIsModalCopied(true);
        }}
        isCopied={isModalCopied}
      />
    </div>
  );
}

// Micro icons
function ChevronRightTiny(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
