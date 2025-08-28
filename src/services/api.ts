import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { AssessmentScore } from "../types/assessment";

// API Configuration
const API_BASE_URL = "/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },


});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("recruit_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },


  (error) => {
    return Promise.reject(error);
  },


);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("recruit_auth_token");
      localStorage.removeItem("recruit_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },


);

// Types
export interface User {
  id: string;
  email: string;
  role: "candidate" | "employer";
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  assessmentLink?: string;
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

export interface Application {
  id: string;
  coverLetter?: string;
  status: string;
  candidateId: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    location?: string;
  };
  job?: {
    id: string;
    title: string;
    company?: {
      name: string;
    };
  };
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  experience: string;
  education: string;
  colareScore: number;
  skills: {
    technical: number;
    problemSolving: number;
    communication: number;
    fieldSkills?: Record<string, number>;
  };
  time: string;
  date: string;
  status: "recommended" | "review-again" | "not-interested";
  hasAssessment: boolean;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },



  register: async (
    email: string,
    password: string,
    role: "candidate" | "employer",
    firstName?: string,
    lastName?: string,
    companyName?: string,
  ): Promise<AuthResponse> => {
    const payload = {
      email,
      password,
      role,
      ...(role === "candidate" && { firstName, lastName }),
      ...(role === "employer" && { companyName }),
    };

    const response = await api.post("/auth/register", payload);
    return response.data;
  },



  // New resume upload and parsing endpoint (Step 1)
  uploadResumeAndParse: async (
    email: string,
    password: string,
    role: string,
    resumeFile: File,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      sessionId: string;
      parsedData: {
        firstName: string;
        lastName: string;
        email: string;
        currentPosition?: string;
        education?: string;
        confidence: number;
      };
      confidence: number;
    };
  }> => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("resumeFile", resumeFile);

    const response = await api.post("/auth/register/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },



  // Registration confirmation endpoint (Step 2)
  confirmRegistration: async (
    sessionId: string,
    parsedData: {
      firstName: string;
      lastName: string;
      email: string;
      currentPosition?: string;
      education?: string;
    },


  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/register/confirm", {
      sessionId,
      parsedData,
    });
    return response.data;
  },



  // Get session data endpoint
  getSessionData: async (
    sessionId: string,
  ): Promise<{
    success: boolean;
    data: {
      email: string;
      role: string;
      parsedData: {
        firstName: string;
        lastName: string;
        email: string;
        currentPosition?: string;
        education?: string;
        confidence: number;
      };
      confidence: number;
    };
  }> => {
    const response = await api.get(`/auth/register/session/${sessionId}`);
    return response.data;
  },


};

// Jobs API
export const jobsAPI = {
  getAll: async (
    page = 1,
    limit = 10,
  ): Promise<{ jobs: Job[]; pagination: any }> => {
    const response = await api.get(`/jobs?page=${page}&limit=${limit}`);
    return response.data.data;
  },



  getById: async (id: string): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data.job;
  },



  create: async (jobData: {
    title: string;
    description: string;
    requirements?: string;
    assessmentLink?: string;
  }): Promise<{ job: Job }> => {
    const response = await api.post("/jobs", jobData);
    return response.data.data;
  },



  update: async (id: string, jobData: Partial<Job>): Promise<{ job: Job }> => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data.data;
  },



  delete: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },



  getByCompany: async (companyId: string): Promise<Job[]> => {
    const response = await api.get(`/jobs/company/${companyId}`);
    return response.data.data.jobs;
  },



  getJobCandidates: async (jobId: string): Promise<Candidate[]> => {
    const response = await api.get(`/jobs/${jobId}/candidates`);
    return response.data.data.candidates;
  },



  sendAssessmentEmail: async (applicationId: string): Promise<{ assessmentUrl: string }> => {
    const response = await api.post(`/applications/${applicationId}/send-assessment`);
    return response.data.data;
  },

  getJobCandidatesWithScores: async (
    jobId: string,
  ): Promise<{
    candidates: Candidate[];
    totalCandidates: number;
    candidatesWithAssessments: number;
  }> => {
    const response = await api.get(`/jobs/${jobId}/candidates-with-scores`);
    return response.data.data;
  },



  // Enhanced function to get candidates with both assessment scores and profile data
  getJobCandidatesWithProfiles: async (
    jobId: string,
  ): Promise<{
    candidates: Candidate[];
    totalCandidates: number;
    candidatesWithAssessments: number;
  }> => {
    // First get the basic candidate data with assessment scores
    const response = await api.get(`/jobs/${jobId}/candidates-with-scores`);
    const candidatesData = response.data.data;

    // For each candidate, fetch their profile data
    const enhancedCandidates = await Promise.all(
      candidatesData.candidates.map(async (candidate: any) => {
        try {
          // Fetch candidate profile data using the same API as candidate profile page
          const profileResponse = await api.get(
            `/candidates/${candidate.id}/profile`,
          );
          const profileData = profileResponse.data.data.candidate;

          // Merge profile data with assessment data
          return {
            ...candidate,
            name: `${profileData.firstName} ${profileData.lastName}`,
            experience: profileData.currentPosition || "Not specified",
            education: profileData.education || "Not specified",
            email: profileData.email || "Not specified",
          };
        } catch (error) {
          console.error(
            `Error fetching profile for candidate ${candidate.id}:`,
            error,
          );
          // Return original candidate data if profile fetch fails
          return candidate;
        }
      }),
    );

    return {
      candidates: enhancedCandidates,
      totalCandidates: candidatesData.totalCandidates,
      candidatesWithAssessments: candidatesData.candidatesWithAssessments,
    };
  },



  // Upload candidate resume for a specific job
  uploadCandidateResume: async (jobId: string, resumeFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append('resumeFile', resumeFile);

    const response = await api.post(`/jobs/${jobId}/upload-candidate-resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },


};

// Applications API
export const applicationsAPI = {
  apply: async (
    jobId: string,
    coverLetter?: string,
  ): Promise<{ application: Application }> => {
    const response = await api.post("/applications", { jobId, coverLetter });
    return response.data.data;
  },



  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get("/candidates/applications");
    return response.data.data.applications;
  },



  getCompanyApplications: async (): Promise<Application[]> => {
    const response = await api.get("/companies/applications");
    return response.data.data.applications;
  },



  updateStatus: async (
    applicationId: string,
    status: string,
  ): Promise<{ application: Application }> => {
    const response = await api.put(
      `/companies/applications/${applicationId}/status`,
      { status },
    );
    return response.data.data;
  },



  withdraw: async (applicationId: string): Promise<void> => {
    await api.delete(`/candidates/applications/${applicationId}`);
  },


};

// Profile API
export const profileAPI = {
  getCandidateProfile: async (): Promise<any> => {
    const response = await api.get("/candidates/profile");
    return response.data.data.candidate;
  },



  updateCandidateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    location?: string;
  }): Promise<any> => {
    const response = await api.put("/candidates/profile", profileData);
    return response.data.data.candidate;
  },



  getCompanyProfile: async (): Promise<any> => {
    const response = await api.get("/companies/profile");
    return response.data.data.company;
  },



  updateCompanyProfile: async (profileData: {
    name?: string;
    description?: string;
    website?: string;
  }): Promise<any> => {
    const response = await api.put("/companies/profile", profileData);
    return response.data.data.company;
  },


};

// Dashboard API
export const dashboardAPI = {
  getCompanyDashboard: async (): Promise<any> => {
    const response = await api.get("/companies/dashboard");
    return response.data.data;
  },



  getCompanyAnalytics: async (): Promise<any> => {
    const response = await api.get("/companies/analytics");
    return response.data.data;
  },


};

export const candidateAPI = {
  getProfile: async () => {
    const response = await api.get("/candidates/profile");
    return response.data.data.candidate;
  },



  getAssessmentScores: async () => {
    const response = await api.get("/candidates/assessment-scores");
    // Transform any field-specific scores into the new format if needed
    const scores = response.data.data.assessmentScores.map((score: any) => ({
      ...score,
      // If old format scores exist, convert them to fieldSkills format
      fieldSkills: score.fieldSkills || {},
    }));
    return { assessmentScores: scores };
  },



  getCandidateAssessment: async (
    candidateId: string,
    jobId: string,
  ): Promise<{
    candidate: {
      id: string;
      name: string;
      email: string;
      education: string;
      currentPosition: string;
    };
    assessment: {
      id: string;
      instanceId: string;
      colareScore: number;
      coreScores: {
        technical: number;
        problemSolving: number;
        communication: number;
      };
      fieldSkills: Array<{
        name: string;
        score: number;
        originalName: string;
      }>;
      status: string;
      completedAt: string;
    } | null;
    hasAssessment: boolean;
  }> => {
    const response = await api.get(
      `/candidates/${candidateId}/assessment/${jobId}`,
    );
    return response.data.data;
  },


};

export default api;
