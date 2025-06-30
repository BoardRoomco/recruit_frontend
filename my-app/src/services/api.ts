import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'http://3.16.183.0:3000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('recruit_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('recruit_auth_token');
      localStorage.removeItem('recruit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'employer';
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
  salary?: string;
  location?: string;
  type?: string;
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
    location?: string;
    company?: {
      name: string;
    };
  };
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (
    email: string, 
    password: string, 
    role: 'candidate' | 'employer',
    firstName?: string,
    lastName?: string,
    companyName?: string
  ): Promise<AuthResponse> => {
    const payload = {
      email,
      password,
      role,
      ...(role === 'candidate' && { firstName, lastName }),
      ...(role === 'employer' && { companyName })
    };
    
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
};

// Jobs API
export const jobsAPI = {
  getAll: async (page = 1, limit = 10): Promise<{ jobs: Job[]; pagination: any }> => {
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
    salary?: string;
    location?: string;
    type?: string;
  }): Promise<{ job: Job }> => {
    const response = await api.post('/jobs', jobData);
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
};

// Applications API
export const applicationsAPI = {
  apply: async (jobId: string, coverLetter?: string): Promise<{ application: Application }> => {
    const response = await api.post('/applications', { jobId, coverLetter });
    return response.data.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get('/candidates/applications');
    return response.data.data.applications;
  },

  getCompanyApplications: async (): Promise<Application[]> => {
    const response = await api.get('/companies/applications');
    return response.data.data.applications;
  },

  updateStatus: async (applicationId: string, status: string): Promise<{ application: Application }> => {
    const response = await api.put(`/companies/applications/${applicationId}/status`, { status });
    return response.data.data;
  },

  withdraw: async (applicationId: string): Promise<void> => {
    await api.delete(`/candidates/applications/${applicationId}`);
  },
};

// Profile API
export const profileAPI = {
  getCandidateProfile: async (): Promise<any> => {
    const response = await api.get('/candidates/profile');
    return response.data.data.candidate;
  },

  updateCandidateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    location?: string;
  }): Promise<any> => {
    const response = await api.put('/candidates/profile', profileData);
    return response.data.data.candidate;
  },

  getCompanyProfile: async (): Promise<any> => {
    const response = await api.get('/companies/profile');
    return response.data.data.company;
  },

  updateCompanyProfile: async (profileData: {
    name?: string;
    description?: string;
    website?: string;
  }): Promise<any> => {
    const response = await api.put('/companies/profile', profileData);
    return response.data.data.company;
  },
};

// Dashboard API
export const dashboardAPI = {
  getCompanyDashboard: async (): Promise<any> => {
    const response = await api.get('/companies/dashboard');
    return response.data.data;
  },

  getCompanyAnalytics: async (): Promise<any> => {
    const response = await api.get('/companies/analytics');
    return response.data.data;
  },
};

export default api; 