import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini client
function getGeminiClient(userKey?: string) {
  const apiKey = userKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key Gemini tidak ditemukan. Harap masukkan API Key Anda di kolom yang disediakan atau hubungi administrator.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Generate RPP Deep Learning
app.post("/api/generate", async (req, res) => {
  try {
    const {
      userApiKey,
      schoolName,
      subject,
      level,
      grade,
      semester,
      phase,
      major,
      timeAllocation,
      academicYear,
      topic,
      learningGoal,
      selectedProfiles, // array of strings, e.g. ["DPL 1", "DPL 3"]
      authorName,
    } = req.body;

    const ai = getGeminiClient(userApiKey);

    // Dynamic signatures setup
    const formattedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Create a precise, well-structured prompt for Gemini
    const profileText = selectedProfiles && selectedProfiles.length > 0 
      ? selectedProfiles.join(", ") 
      : "DPL 1, DPL 3, DPL 4, DPL 5";

    const prompt = `Anda adalah seorang Konsultan Kurikulum Merdeka dan AI Specialist Pendidikan Indonesia yang dipercaya oleh Kementerian Pendidikan.
Tugas Anda adalah memformulasikan RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR DEEP LEARNING yang inovatif, mendalam, dan terstruktur sempurna berdasarkan kurikulum Merdeka.

Berikut adalah detail identitas modul yang diinput oleh pengguna:
- Nama Sekolah: ${schoolName || "SMK Teknologi Digital"}
- Nama Penyusun / Guru: ${authorName || "DIDIK PRIHANTOKO, SE"}
- Mata Pelajaran: ${subject || "Komputer Akuntansi"}
- Jenjang: ${level || "SMK"}
- Kelas / Semester: ${grade || "11"} / Semester ${semester || "1"}
- Fase: ${phase || "Fase F"}
- Jurusan / Kompetensi Keahlian: ${major || "Teknik Jaringan Komputer dan Telekomunikasi"}
- Alokasi Waktu: ${timeAllocation || "24 JP (8 kali pertemuan @3 JP)"}
- Tahun Pelajaran: ${academicYear || "2025/2026"}
- Topik / Materi Utama: ${topic || "Program Komputer Akuntansi pada perusahaan"}
- Tujuan Pembelajaran Utama: ${learningGoal || "Memahami program komputer akuntansi pada perusahaan"}
- Dimensi Profil Pelajar Pancasila (Profil Lulusan) Terpilih: ${profileText}

Format Pembelajaran Pendekatan Deep Learning yang wajib Anda gunakan terdiri dari tiga pilar (Mindful, Meaningful, Joyful Learning):
1. Mindful Learning: Menumbuhkan kesadaran penuh, fokus, dan pemikiran reflektif mendalam pada siswa.
2. Meaningful Learning: Mengaitkan konsep dengan kehidupan nyata, pemecahan masalah, dan kebermanfaatan jangka panjang.
3. Joyful Learning: Menciptakan suasana belajar yang menyenangkan, menantang, bebas dari tekanan berlebihan, dan membangkitkan rasa ingin tahu (curiosity).

Silakan hasilkan keluaran dokumen RPP AJAR DEEP LEARNING yang lengkap dan terstruktur persis seperti format berikut ini. Gunakan bahasa Indonesia yang formal, inspiratif, profesional, dan kaya akan detail akademis. Isi semua kurung siku [] dengan konten yang sangat relevan, mendalam, praktis, dan kreatif (hindari teks placeholder generik seperti "isi di sini").

Wajib mengikuti struktur output berikut secara eksak:

=========================================
RPP AJAR DEEP LEARNING MATA PELAJARAN : ${subject || "Komputer Akuntansi"} TOPIK ${topic || "Program Komputer Akuntansi pada perusahaan"}

A. IDENTITAS MODUL
Nama Sekolah: ${schoolName || "SMK Teknologi Digital"}
Nama Penyusun: ${authorName || "DIDIK PRIHANTOKO, SE"}
Mata Pelajaran: ${subject || "Komputer Akuntansi"}
Jenjang: ${level || "SMK"}
Kelas / Fase: ${grade || "11"} / ${phase || "Fase F"}
Semester: ${semester || "1"}
Tahun Pelajaran: ${academicYear || "2025/2026"}
${major ? `Jurusan/Kompetensi Keahlian: ${major}` : ""}
Alokasi Waktu: ${timeAllocation || "24 JP (8 kali pertemuan @3 JP)"}

B. IDENTIFIKASI KESIAPAN PESERTA DIDIK
Pengetahuan Awal: [Tuliskan analisis pengetahuan awal yang harus dimiliki siswa sebelum mempelajari materi ini. Hubungkan langsung dengan ${subject} dan ${topic}. Buatlah analisis mendetail setebal minimal 2-3 kalimat]
Minat: [Tuliskan analisis minat peserta didik, misalnya: "Peserta didik memiliki minat yang tinggi dalam aktivitas praktis menggunakan teknologi komputer, mengeksplorasi software keuangan terbaru, dan menyelesaikan tantangan analisis data secara mandiri atau kelompok."]
Latar Belakang: [Tuliskan analisis latar belakang pengalaman peserta didik yang relevan dengan topik ini, dikemas dengan sangat profesional]
Kebutuhan Belajar:
- Visual: [Tuliskan strategi pemenuhan kebutuhan belajar visual siswa. Contoh: Membutuhkan bagan alur, demonstrasi visual dari software, infografis langkah-langkah, atau video panduan interaktif.]
- Auditori: [Tuliskan strategi pemenuhan kebutuhan auditori siswa. Contoh: Membutuhkan penjelasan lisan yang runtut, diskusi kelompok interaktif, tanya jawab kritis, atau instruksi langkah demi langkah yang disuarakan.]
- Kinestetik: [Tuliskan strategi pemenuhan kebutuhan kinestetik siswa. Contoh: Membutuhkan praktik langsung di komputer secara real-time, simulasi entry data transaksi keuangan nyata, atau pengerjaan studi kasus berbasis proyek.]

C. KARAKTERISTIK MATERI PELAJARAN
Jenis Pengetahuan yang Akan Dicapai: [Tuliskan jenis pengetahuannya, seperti Deklaratif, Prosedural, Konseptual, atau Metakognitif yang paling cocok]
Konseptual: [Uraikan secara detail konsep-konsep kunci yang akan dikuasai murid secara teoretis]
Prosedural: [Sebutkan langkah-langkah sistematis atau prosedur praktis yang akan dilatihkan kepada peserta didik untuk menguasai materi ini]
Relevansi dengan Kehidupan Nyata Peserta Didik: [Uraikan bagaimana materi ini langsung berdampak dan digunakan dalam dunia kerja nyata, industri, atau kehidupan sehari-hari]
Tingkat Kesulitan: [Analisis tingkat kesulitan materi ini (misal: Sedang-Tinggi karena memerlukan logika prosedural terstruktur) beserta solusi mitigasinya]
Struktur Materi: [Tuliskan outline peta konsep atau struktur materi yang dipelajari]
Integrasi Nilai dan Karakter: [Sebutkan nilai karakter seperti kejujuran, ketelitian akademis, integritas data, tanggung jawab, dan etika profesi yang diintegrasikan]

D. DIMENSI PROFIL LULUSAN
(Tuliskan dan uraikan HANYA dimensi yang dipilih dari daftar ini: ${profileText}. Berikan deskripsi aktivitas konkret bagaimana murid melatih dimensi tersebut dalam pembelajaran ini.)
- [Contoh: DPL 3 Penalaran Kritis: Peserta didik menganalisis kebenaran transaksi keuangan dan menentukan keputusan entry jurnal secara tepat.]

DESAIN PEMBELAJARAN

A. CAPAIAN PEMBELAJARAN (CP)
Pada akhir Fase ${phase || "Fase F"}, murid memiliki kemampuan sebagai berikut:
- Mengalami (Experiencing): [Uraikan bagaimana murid mengalami langsung fenomena/materi pembelajaran ini]
- Merefleksikan (Reflecting): [Uraikan bagaimana murid merefleksikan proses belajar mereka]
- Berpikir dan Bekerja Artistik (Thinking and Working Artistically): [Uraikan bagaimana murid merancang solusi secara estetik, rapi, dan sistematis]
- Menciptakan (Making/Creating): [Uraikan bagaimana murid menghasilkan karya nyata atau produk akhir dari bab ini]
- Berdampak (Impacting): [Uraikan dampak jangka panjang dari pembelajaran ini terhadap kompetensi siswa]

B. LINTAS DISIPLIN ILMU
Mata Pelajaran ${subject || "Komputer Akuntansi"}: Isian [Uraikan bagaimana pembelajaran ini terintegrasi dengan disiplin ilmu lain, misal matematika keuangan, bahasa Indonesia dalam pelaporan, atau etika profesional]

C. TUJUAN PEMBELAJARAN
[Uraikan breakdown tujuan pembelajaran per pertemuan. Tentukan jumlah pertemuan berdasarkan alokasi waktu. Misalnya untuk alokasi ${timeAllocation || "24 JP"}, buatlah beberapa pertemuan yang realistis (misal 4 sampai 8 pertemuan). Tuliskan sub-tujuan spesifik untuk setiap pertemuan tersebut.]

D. INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN
[Tuliskan 4 poin indikator ketercapaian secara terukur dan operasional (menggunakan kata kerja operasional seperti menganalisis, mengoperasikan, menyusun, memvalidasi)]
1. [Indikator 1]
2. [Indikator 2]
3. [Indikator 3]
4. [Indikator 4]

E. TOPIK PEMBELAJARAN KONTEKSTUAL
[Uraikan satu studi kasus nyata atau isu kontekstual yang diangkat dalam materi ini untuk diselesaikan bersama]

F. KERANGKA PEMBELAJARAN PRAKTIK PEDAGOGIK
Model Pembelajaran: [Tentukan model yang paling sesuai, misalnya Project-Based Learning, Problem-Based Learning, Inquiry, atau Contextual Teaching & Learning]
Pendekatan: Deep Learning (Mindful, Meaningful, Joyful Learning)
- Mindful Learning: [Uraikan bagaimana guru memfasilitasi kesadaran penuh, hening sejenak (mindful breathing), atau journaling reflektif sebelum memulai pelajaran]
- Meaningful Learning: [Uraikan bagaimana pelajaran dikaitkan dengan konteks karir profesional atau kebutuhan dunia industri nyata]
- Joyful Learning: [Uraikan aktivitas menyenangkan seperti game edukatif, apresiasi positif, kuis interaktif, atau ice breaking penyemangat]
Metode Pembelajaran: [Tuliskan beberapa metode yang digunakan, contoh: Demonstrasi Interaktif, Diskusi Kelompok, Drill Praktik Mandiri, dan peer-tutoring]

KEMITRAAN PEMBELAJARAN
- Lingkungan Sekolah: [Bagaimana memaksimalkan fasilitas sekolah, lab komputer, atau kolaborasi antar guru]
- Lingkungan Luar Sekolah/Masyarakat: [Keterlibatan orang tua, kunjungan industri, atau studi banding ke UKM terdekat]
- Mitra Digital: [Software akuntansi, AI assist, video edukasi, platform e-learning]

LINGKUNGAN BELAJAR
- Ruang Fisik: [Penataan lab komputer, kenyamanan suhu ruang, sirkulasi udara, pencahayaan]
- Ruang Virtual: [Google Classroom, LMS sekolah, grup koordinasi digital]
- Budaya Belajar: [Saling menghargai, kolaboratif, tidak takut salah, jujur dalam bekerja]

PEMANFAATAN DIGITAL
[Uraikan teknologi digital, AI, cloud database, atau software khusus yang dioperasikan dalam pembelajaran ini]

G. LANGKAH-LANGKAH PEMBELAJARAN
[Berikan rincian langkah pembelajaran untuk contoh PERTEMUAN 1 (3 JP : 105 MENIT) secara mendalam, menarik, dan operasional.]
KEGIATAN PENDAHULUAN (15 MENIT)
- Orientasi: Salam pembuka, doa bersama dipimpin murid, dan presensi kehadiran.
- Apersepsi (Joyful): [Tuliskan kegiatan apersepsi yang menyenangkan, seperti mengaitkan materi dengan analogi kehidupan sehari-hari]
- Motivasi: [Kalimat motivasi inspiratif mengapa materi ini sangat penting untuk masa depan karir mereka]
- Penyampaian Tujuan: Guru memaparkan target kompetensi yang dicapai pada pertemuan ini.
- Asesmen Diagnostik: [Tuliskan instrumen pertanyaan cepat untuk mengukur kesiapan awal siswa sebelum belajar]

KEGIATAN INTI (75 MENIT)
- Eksplorasi Bahan: [Uraikan aktivitas siswa mengamati modul, video tutorial, atau demonstrasi awal dari guru]
- Eksperimen Keseimbangan / Eksperimen Praktis: [Uraikan simulasi praktis mandiri di mana siswa mencoba mengoperasikan atau menganalisis kasus secara langsung]
- Diskusi: [Uraikan bagaimana siswa saling bertukar pikiran, memecahkan error bersama dalam kelompok kecil, atau berdiskusi dengan guru]

KEGIATAN PENUTUP (15 MENIT)
- Refleksi: [Uraikan pertanyaan reflektif mendalam agar siswa menyadari apa yang mereka pelajari dan rasakan hari ini]
- Tindak Lanjut: [Tugas pengayaan ringan atau persiapan untuk pertemuan berikutnya]
- Penutup: Doa penutup dan salam hangat.

H. ASESMEN PEMBELAJARAN
[Uraikan strategi asesmen secara lengkap:
- Assessment As Learning (Penilaian diri dan penilaian sejawat dengan instrumen reflektif)
- Assessment For Learning (Umppan balik formatif real-time saat praktik di kelas)
- Assessment Of Learning (Evaluasi sumatif kinerja produk akhir atau tes praktis)]

=========================================
Di bagian paling bawah, sediakan format tanda tangan persis seperti ini (PENTING: Jangan isi nama Kepala Sekolah dan Wakabid Kurikulum, biarkan berupa titik-titik kosong atau kosongkan saja, sedangkan kolom Guru Mata Pelajaran diisi nama penyusun yaitu: ${authorName || "DIDIK PRIHANTOKO, SE"}):

.................., .........................

Mengetahui
Kepala Sekolah                  Wakabid Kurikulum                      Guru Mata Pelajaran



....................                   .............................                      ${authorName || "DIDIK PRIHANTOKO, SE"}
=========================================

Harap pastikan hasil RPP ini dirancang dengan standar kualitas tertinggi, bebas dari boilerplate kosong, dan langsung siap dipakai oleh guru profesional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Generate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Quick Ideas (Ide Modul, Ide Pertanyaan Pemantik, Ide Ice Breaking)
app.post("/api/ideas", async (req, res) => {
  try {
    const {
      type, // "modul" | "pemantik" | "icebreaking"
      userApiKey,
      subject,
      level,
      grade,
      semester,
      phase,
      major,
      topic,
      learningGoal,
    } = req.body;

    const ai = getGeminiClient(userApiKey);

    let prompt = "";
    if (type === "modul") {
      prompt = `Berikan ide modul pembelajaran / struktur materi singkat berlandaskan konsep DEEP LEARNING (Mindful, Meaningful, Joyful) untuk data berikut:
- Mata Pelajaran: ${subject || "Umum"}
- Jenjang: ${level || "Semua"}
- Kelas / Semester: ${grade || "Umum"} / ${semester || "1"}
- Fase: ${phase || "Umum"}
- Jurusan: ${major || "-"}
- Materi: ${topic || "Umum"}
- Tujuan: ${learningGoal || "Umum"}

Sediakan 3 ide skenario modul ajar kreatif lengkap dengan judul, fokus deep learning-nya, dan ringkasan aktivitas praktisnya. Gunakan bahasa Indonesia yang santun, kreatif, dan inspiratif. Sediakan dalam format Markdown yang rapi.`;
    } else if (type === "pemantik") {
      prompt = `Berikan ide pertanyaan pemantik (stimulating questions) yang memicu rasa ingin tahu mendalam, berpikir kritis, dan kesadaran (Mindful & Meaningful) untuk pembelajaran berikut:
- Mata Pelajaran: ${subject || "Umum"}
- Jurusan: ${major || "-"}
- Materi: ${topic || "Umum"}
- Tujuan: ${learningGoal || "Umum"}

Sediakan 5-7 pertanyaan pemantik inovatif yang tidak sekadar menanyakan definisi (bukan "apa itu..."), melainkan memicu pemikiran filosofis, analisis masalah nyata, dan relevansi langsung dengan masa depan siswa. Sediakan dalam format Markdown yang rapi.`;
    } else if (type === "icebreaking") {
      prompt = `Berikan ide aktivitas Ice Breaking (penyegar suasana pembelajaran) yang kreatif, menyenangkan (Joyful Learning), menantang otak, dan disesuaikan untuk jenjang pendidikan: ${level || "Semua"} (Kelas ${grade || "Umum"}).

Sediakan 3 opsi ice breaking seru yang bisa dimainkan dalam waktu 5-10 menit di kelas fisik maupun ruang virtual, lengkap dengan nama game, alat yang dibutuhkan, dan cara bermainnya. Buatlah interaktif dan edukatif. Sediakan dalam format Markdown yang rapi.`;
    } else {
      return res.status(400).json({ success: false, error: "Tipe ide tidak valid." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Ideas error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static assets or mount Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
