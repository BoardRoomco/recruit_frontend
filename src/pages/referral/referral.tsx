import React, { useState } from 'react';
import TitleLogo from '../../assets/titlelogo.svg';

// API configuration
const API_BASE_URL = 'http://localhost:5001'; // Local development
// const API_BASE_URL = 'https://api.colare.co'; // Production

export default function ReferralPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('fieldOfInterest', fieldOfInterest);
      formData.append('resumeFile', resumeFile!);

      // Submit referral to backend
      const response = await fetch(`${API_BASE_URL}/api/candidates/referral/submit`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess('Thank you! Your referral has been submitted successfully. You will be added to the appropriate talent pool.');
        setName('');
        setEmail('');
        setFieldOfInterest('');
        setResumeFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setError(result.message || 'Failed to submit referral. Please try again.');
      }
    } catch (err) {
      console.error('Referral submission error:', err);
      setError('Failed to submit referral. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softLavender flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-4xl font-fustat font-bold text-graphite mb-4">
            Join the Colare Candidate Pool
          </h1>
          <p className="text-center text-lg text-graphite/80 font-dmsans max-w-md">
            Submit your information and resume to join our talent network
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-violet/50"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-violet/50"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Field of Interest */}
            <div>
              <label htmlFor="fieldOfInterest" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Field of Interest *
              </label>
              <select
                id="fieldOfInterest"
                name="fieldOfInterest"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 text-graphite font-dmsans focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-violet/50"
                value={fieldOfInterest}
                onChange={(e) => setFieldOfInterest(e.target.value)}
              >
                <option value="">Select a field of interest</option>
                <option value="electrical">Electrical Engineering</option>
                <option value="mechanical">Mechanical Engineering</option>
              </select>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume-upload" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Resume *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-violet/50 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-violet hover:text-corePurple focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        required
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, or DOCX up to 10MB
                  </p>
                  {resumeFile && (
                    <p className="text-sm text-violet font-medium">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !fieldOfInterest || !resumeFile}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-violet to-corePurple hover:from-corePurple hover:to-violet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-dmsans transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Join the Pool'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-dmsans text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-dmsans text-sm">{success}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
