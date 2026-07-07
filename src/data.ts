import { LocalPreset, IceBreaker } from "./types";

export const JENJANG_LIST = ["SD", "MI", "SMP", "MTS", "SMA", "SMK", "MA"] as const;

export const KELAS_MAP: Record<string, string[]> = {
  SD: ["1", "2", "3", "4", "5", "6"],
  MI: ["1", "2", "3", "4", "5", "6"],
  SMP: ["7", "8", "9"],
  MTS: ["7", "8", "9"],
  SMA: ["10", "11", "12"],
  SMK: ["10", "11", "12"],
  MA: ["10", "11", "12"],
};

export const FASE_MAP: Record<string, string> = {
  "1": "Fase A",
  "2": "Fase A",
  "3": "Fase B",
  "4": "Fase B",
  "5": "Fase C",
  "6": "Fase C",
  "7": "Fase D",
  "8": "Fase D",
  "9": "Fase D",
  "10": "Fase E",
  "11": "Fase F",
  "12": "Fase F",
};

export const PROFIL_LULUSAN = [
  { id: "DPL 1", label: "DPL 1: Keimanan dan Ketakwaan terhadap Tuhan YME, dan Berakhlak Mulia" },
  { id: "DPL 2", label: "DPL 2: Kewargaan (Kebinekaan Global)" },
  { id: "DPL 3", label: "DPL 3: Penalaran Kritis" },
  { id: "DPL 4", label: "DPL 4: Kreativitas" },
  { id: "DPL 5", label: "DPL 5: Kolaborasi (Gotong Royong)" },
  { id: "DPL 6", label: "DPL 6: Kemandirian" },
  { id: "DPL 7", label: "DPL 7: Kesehatan (Kesejahteraan Jiwa Raga)" },
  { id: "DPL 8", label: "DPL 8: Komunikasi" },
];

export const PRESET_TEMPLATES: LocalPreset[] = [
  {
    name: "SMK - Komputer Akuntansi (Fase F)",
    data: {
      schoolName: "SMK Teknologi Digital",
      authorName: "DIDIK PRIHANTOKO, SE",
      subject: "Komputer Akuntansi",
      level: "SMK",
      grade: "11",
      semester: "1",
      phase: "Fase F",
      major: "Akuntansi dan Keuangan Lembaga",
      timeAllocation: "24 JP (8 kali pertemuan @3 JP)",
      academicYear: "2025/2026",
      topic: "Program Komputer Akuntansi pada Perusahaan Manufaktur",
      learningGoal: "Memahami dan mengoperasikan program komputer akuntansi untuk mencatat transaksi keuangan perusahaan",
      selectedProfiles: ["DPL 3", "DPL 4", "DPL 6"],
    }
  },
  {
    name: "SMA - Kimia Hijau (Fase E)",
    data: {
      schoolName: "SMA Nusantara Bangsa",
      authorName: "Rina Wijayanti, S.Pd",
      subject: "Kimia",
      level: "SMA",
      grade: "10",
      semester: "1",
      phase: "Fase E",
      major: "IPA",
      timeAllocation: "12 JP (4 kali pertemuan @3 JP)",
      academicYear: "2025/2026",
      topic: "Prinsip Kimia Hijau dalam Pembangunan Berkelanjutan",
      learningGoal: "Menganalisis pentingnya prinsip kimia hijau untuk mengurangi dampak negatif polusi terhadap lingkungan",
      selectedProfiles: ["DPL 1", "DPL 3", "DPL 5"],
    }
  },
  {
    name: "SMP - Ilmu Pengetahuan Alam (Fase D)",
    data: {
      schoolName: "SMP Indonesia Jaya",
      authorName: "Budi Santoso, M.Pd",
      subject: "Ilmu Pengetahuan Alam",
      level: "SMP",
      grade: "8",
      semester: "1",
      phase: "Fase D",
      major: "",
      timeAllocation: "15 JP (5 kali pertemuan @3 JP)",
      academicYear: "2025/2026",
      topic: "Sistem Pencernaan Manusia dan Pola Hidup Sehat",
      learningGoal: "Memahami struktur dan fungsi organ pencernaan serta merancang menu makanan sehat berimbang",
      selectedProfiles: ["DPL 3", "DPL 7", "DPL 8"],
    }
  },
  {
    name: "SD - Matematika Pecahan (Fase C)",
    data: {
      schoolName: "SD Cerdas Mulia",
      authorName: "Siti Rahma, S.Pd",
      subject: "Matematika",
      level: "SD",
      grade: "5",
      semester: "1",
      phase: "Fase C",
      major: "",
      timeAllocation: "18 JP (6 kali pertemuan @3 JP)",
      academicYear: "2025/2026",
      topic: "Penjumlahan dan Pengurangan Bilangan Pecahan",
      learningGoal: "Menyelesaikan masalah sehari-hari yang berkaitan dengan penjumlahan pecahan penyebut berbeda",
      selectedProfiles: ["DPL 3", "DPL 4", "DPL 5"],
    }
  }
];

export const LOCAL_ICE_BREAKERS: IceBreaker[] = [
  {
    title: "Game 'Tepuk Angka' (Joyful Mind)",
    level: "SD / MI",
    tools: "Tangan Kosong",
    howToPlay: "Guru menyebutkan instruksi angka. Jika ganjil tepuk tangan 1 kali, jika genap hening atau bergaya patung. Melatih kefokusan anak-anak secara gembira."
  },
  {
    title: "Tebak Kata Berantai (Collaborative Focus)",
    level: "SMP / MTS",
    tools: "Kertas Kecil",
    howToPlay: "Siswa berbaris membelakangi guru. Siswa paling depan membaca kata kunci dari guru, lalu memperagakan gerakan tubuh tanpa suara ke teman di belakangnya secara berantai. Melatih komunikasi nonverbal dan tawa segar."
  },
  {
    title: "Analogi Asosiasi Kata (Cognitive Refresh)",
    level: "SMA / SMK / MA",
    tools: "Tangan Kosong",
    howToPlay: "Siswa bergantian menyebutkan satu kata yang berhubungan dengan kata sebelumnya secepat mungkin dalam waktu 2 detik (contoh: Komputer -> Data -> Akuntansi -> Angka -> Uang). Jika telat atau salah asosiasi, harus berpose lucu. Sangat baik untuk menyegarkan otak sebelum pelajaran berat."
  }
];

// Offline fallback databases based on subject / topic selection
export const LOCAL_DB_IDEAS = {
  modules: [
    {
      subject: "Komputer Akuntansi",
      topic: "Program Komputer Akuntansi pada Perusahaan",
      ideas: `### Ide Modul Pembelajaran Offline (Komputer Akuntansi)

1. **Modul 'Akuntan Digital Masa Depan' (Meaningful)**
   * **Fokus**: Menghubungkan pencatatan jurnal digital dengan kebutuhan riil UMKM sekitar sekolah. Siswa langsung mempraktikkan penginputan nota belanja toko kelontong asli ke dalam sistem MYOB/Zahir/Spreadsheet.
   * **Aktivitas**: Observasi warung, merancang daftar akun, entri data transaksi, dan mencetak laporan laba rugi sederhana.

2. **Modul 'Laboratorium Transaksi Virtual' (Joyful)**
   * **Fokus**: Bermain peran (Role-Play) di mana lab komputer disimulasikan sebagai Departemen Keuangan sebuah perusahaan korporat.
   * **Aktivitas**: Siswa dibagi menjadi bagian Kasir, Supplier, Bagian Piutang, dan Kepala Keuangan. Mereka saling berinteraksi melakukan transaksi fisik dan menginputnya ke software secara real-time.`
    }
  ],
  questions: [
    {
      subject: "Komputer Akuntansi",
      topic: "Program Komputer Akuntansi pada Perusahaan",
      questions: `### Ide Pertanyaan Pemantik Offline (Komputer Akuntansi)

1. *"Jika semua uang di dunia ini diubah menjadi digital dalam waktu semalam, apa yang akan terjadi pada profesi seorang akuntan tradisional?"*
2. *"Mengapa sebuah kesalahan kecil berupa satu digit angka nol (0) di software akuntansi dapat menghancurkan kredibilitas seluruh perusahaan?"*
3. *"Bagaimana sistem komputer akuntansi dapat membantu pemilik warung kecil di dekat rumah kita mengambil keputusan bisnis yang cerdas?"*
4. *"Apakah software komputer akuntansi bisa menggantikan nilai kejujuran manusia dalam melaporkan pajak?"*`
    }
  ]
};
