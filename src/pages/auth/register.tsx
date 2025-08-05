import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ParsedData {
  firstName: string;
  lastName: string;
  email: string;
  currentPosition?: string;
  education?: string;
  confidence: number;
}

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as 'candidate' | 'employer',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, uploadResumeAndParse, confirmRegistration } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('docx')) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'candidate') {
      // For candidates, require resume upload
      if (!resumeFile) {
        setError('Please upload your resume');
        return;
      }
      
      // Use resume upload flow for candidates
      setIsSubmitting(true);
      try {
        const result = await uploadResumeAndParse(
          formData.email,
          formData.password,
          formData.role,
          resumeFile
        );
        
        setSessionId(result.sessionId);
        setParsedData(result.parsedData);
        setStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Resume upload failed');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For employers, use regular registration
      if (!formData.companyName) {
        setError('Company name is required for employers');
        return;
      }

      setIsSubmitting(true);
      try {
        await register(
          formData.email,
          formData.password,
          formData.role,
          formData.firstName,
          formData.lastName,
          formData.companyName
        );
        navigate('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!parsedData) {
      setError('No parsed data available');
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmRegistration(sessionId, parsedData);
      navigate('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration confirmation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditParsedData = (field: keyof ParsedData, value: string) => {
    if (parsedData) {
      setParsedData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError('');
  };

  // Step 2: Review parsed data (only for candidates)
  if (step === 2 && formData.role === 'candidate') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Review Your Information
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please review the information extracted from your resume
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleConfirmRegistration}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={parsedData?.firstName || ''}
                  onChange={(e) => handleEditParsedData('firstName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={parsedData?.lastName || ''}
                  onChange={(e) => handleEditParsedData('lastName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={parsedData?.email || ''}
                  onChange={(e) => handleEditParsedData('email', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Position
                </label>
                <input
                  type="text"
                  value={parsedData?.currentPosition || ''}
                  onChange={(e) => handleEditParsedData('currentPosition', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <input
                  type="text"
                  value={parsedData?.education || ''}
                  onChange={(e) => handleEditParsedData('education', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>

              {parsedData?.confidence && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  <p className="text-sm">
                    <strong>Confidence Score:</strong> {parsedData.confidence}%
                  </p>
                  <p className="text-xs mt-1">
                    This indicates how confident our system is in extracting your information.
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 1: Initial registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="candidate">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Conditional fields based on role */}
            {formData.role === 'candidate' && (
              <>
                {/* Resume Upload for Candidates */}
                <div>
                  <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700">
                    Upload Resume (PDF or DOCX) *
                  </label>
                  <input
                    id="resumeFile"
                    name="resumeFile"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum file size: 10MB. We'll automatically extract your information.
                  </p>
                </div>
              </>
            )}

            {formData.role === 'employer' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (formData.role === 'candidate' ? 'Uploading Resume...' : 'Creating account...') 
                : (formData.role === 'candidate' ? 'Upload Resume & Continue' : 'Create account')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;