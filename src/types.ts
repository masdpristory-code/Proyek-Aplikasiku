export interface RppFormData {
  schoolName: string;
  authorName: string;
  subject: string;
  level: "SD" | "MI" | "SMP" | "MTS" | "SMA" | "SMK" | "MA";
  grade: string;
  semester: "1" | "2";
  phase: "Fase A" | "Fase B" | "Fase C" | "Fase D" | "Fase E" | "Fase F";
  major: string;
  timeAllocation: string;
  academicYear: string;
  topic: string;
  learningGoal: string;
  selectedProfiles: string[];
}

export interface SavedRpp extends RppFormData {
  id: string;
  generatedText: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface IceBreaker {
  title: string;
  level: string;
  tools: string;
  howToPlay: string;
}

export interface LocalPreset {
  name: string;
  data: RppFormData;
}
