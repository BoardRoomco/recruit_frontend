export interface AssessmentScore {
  id: string;
  instanceId: string;
  assessmentId: string;
  jobTitle: string;
  companyName: string;
  technicalAccuracy: number | null;
  problemSolving: number | null;
  communication: number | null;
  fieldSkills?: Record<string, number>; // Dynamic field-specific skills
  status: string;
  completedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  assessmentLink?: string;
  assessmentField?: string; // Type of assessment (e.g., "electrical", "mechanical")
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    description?: string;
    website?: string;
  };
  _count?: {
    applications: number;
  };
}
