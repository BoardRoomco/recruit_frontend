import axios from 'axios';
// API Configuration
const API_BASE_URL = 'https://recruitbackend-production.up.railway.app/api';
// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('recruit_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
api.interceptors.response.use((response) => response, (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // Token expired or invalid
        localStorage.removeItem('recruit_auth_token');
        localStorage.removeItem('recruit_user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (email, password, role, firstName, lastName, companyName) => {
        const payload = Object.assign(Object.assign({ email,
            password,
            role }, (role === 'candidate' && { firstName, lastName })), (role === 'employer' && { companyName }));
        const response = await api.post('/auth/register', payload);
        return response.data;
    },
    // New resume upload and parsing endpoint (Step 1)
    uploadResumeAndParse: async (email, password, role, resumeFile) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('resumeFile', resumeFile);
        const response = await api.post('/auth/register/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    // Registration confirmation endpoint (Step 2)
    confirmRegistration: async (sessionId, parsedData) => {
        const response = await api.post('/auth/register/confirm', {
            sessionId,
            parsedData
        });
        return response.data;
    },
    // Get session data endpoint
    getSessionData: async (sessionId) => {
        const response = await api.get(`/auth/register/session/${sessionId}`);
        return response.data;
    }
};
// Jobs API
export const jobsAPI = {
    getAll: async (page = 1, limit = 10) => {
        const response = await api.get(`/jobs?page=${page}&limit=${limit}`);
        return response.data.data;
    },
    getById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data.data.job;
    },
    create: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data.data;
    },
    update: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data.data;
    },
    delete: async (id) => {
        await api.delete(`/jobs/${id}`);
    },
    getByCompany: async (companyId) => {
        const response = await api.get(`/jobs/company/${companyId}`);
        return response.data.data.jobs;
    },
};
// Applications API
export const applicationsAPI = {
    apply: async (jobId, coverLetter) => {
        const response = await api.post('/applications', { jobId, coverLetter });
        return response.data.data;
    },
    getMyApplications: async () => {
        const response = await api.get('/candidates/applications');
        return response.data.data.applications;
    },
    getCompanyApplications: async () => {
        const response = await api.get('/companies/applications');
        return response.data.data.applications;
    },
    updateStatus: async (applicationId, status) => {
        const response = await api.put(`/companies/applications/${applicationId}/status`, { status });
        return response.data.data;
    },
    withdraw: async (applicationId) => {
        await api.delete(`/candidates/applications/${applicationId}`);
    },
};
// Profile API
export const profileAPI = {
    getCandidateProfile: async () => {
        const response = await api.get('/candidates/profile');
        return response.data.data.candidate;
    },
    updateCandidateProfile: async (profileData) => {
        const response = await api.put('/candidates/profile', profileData);
        return response.data.data.candidate;
    },
    getCompanyProfile: async () => {
        const response = await api.get('/companies/profile');
        return response.data.data.company;
    },
    updateCompanyProfile: async (profileData) => {
        const response = await api.put('/companies/profile', profileData);
        return response.data.data.company;
    },
};
// Dashboard API
export const dashboardAPI = {
    getCompanyDashboard: async () => {
        const response = await api.get('/companies/dashboard');
        return response.data.data;
    },
    getCompanyAnalytics: async () => {
        const response = await api.get('/companies/analytics');
        return response.data.data;
    },
};
export const candidateAPI = {
    getProfile: async () => {
        const response = await api.get('/candidates/profile');
        return response.data.data.candidate;
    },
    getAssessmentScores: async () => {
        const response = await api.get('/candidates/assessment-scores');
        return response.data.data;
    }
};
export default api;
