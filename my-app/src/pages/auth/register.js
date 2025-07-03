import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate',
        firstName: '',
        lastName: '',
        companyName: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, uploadResumeAndParse, confirmRegistration } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFileChange = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
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
    const handleSubmit = async (e) => {
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
                const result = await uploadResumeAndParse(formData.email, formData.password, formData.role, resumeFile);
                setSessionId(result.sessionId);
                setParsedData(result.parsedData);
                setStep(2);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Resume upload failed');
            }
            finally {
                setIsSubmitting(false);
            }
        }
        else {
            // For employers, use regular registration
            if (!formData.companyName) {
                setError('Company name is required for employers');
                return;
            }
            setIsSubmitting(true);
            try {
                await register(formData.email, formData.password, formData.role, formData.firstName, formData.lastName, formData.companyName);
                navigate('/dashboard');
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Registration failed');
            }
            finally {
                setIsSubmitting(false);
            }
        }
    };
    const handleConfirmRegistration = async (e) => {
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Registration confirmation failed');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleEditParsedData = (field, value) => {
        if (parsedData) {
            setParsedData(prev => prev ? Object.assign(Object.assign({}, prev), { [field]: value }) : null);
        }
    };
    const handleBackToStep1 = () => {
        setStep(1);
        setError('');
    };
    // Step 2: Review parsed data (only for candidates)
    if (step === 2 && formData.role === 'candidate') {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Review Your Information" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Please review the information extracted from your resume" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleConfirmRegistration, children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "First Name" }), _jsx("input", { type: "text", value: (parsedData === null || parsedData === void 0 ? void 0 : parsedData.firstName) || '', onChange: (e) => handleEditParsedData('firstName', e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Last Name" }), _jsx("input", { type: "text", value: (parsedData === null || parsedData === void 0 ? void 0 : parsedData.lastName) || '', onChange: (e) => handleEditParsedData('lastName', e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { type: "email", value: (parsedData === null || parsedData === void 0 ? void 0 : parsedData.email) || '', onChange: (e) => handleEditParsedData('email', e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Current Position" }), _jsx("input", { type: "text", value: (parsedData === null || parsedData === void 0 ? void 0 : parsedData.currentPosition) || '', onChange: (e) => handleEditParsedData('currentPosition', e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Education" }), _jsx("input", { type: "text", value: (parsedData === null || parsedData === void 0 ? void 0 : parsedData.education) || '', onChange: (e) => handleEditParsedData('education', e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" })] }), (parsedData === null || parsedData === void 0 ? void 0 : parsedData.confidence) && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded", children: [_jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Confidence Score:" }), " ", parsedData.confidence, "%"] }), _jsx("p", { className: "text-xs mt-1", children: "This indicates how confident our system is in extracting your information." })] }))] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { type: "button", onClick: handleBackToStep1, className: "flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Back" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", children: isSubmitting ? 'Creating Account...' : 'Create Account' })] })] })] }) }));
    }
    // Step 1: Initial registration form
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Create your account" }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Or", ' ', _jsx(Link, { to: "/login", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "sign in to your existing account" })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "I am a..." }), _jsxs("select", { name: "role", value: formData.role, onChange: handleChange, className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", children: [_jsx("option", { value: "candidate", children: "Job Seeker" }), _jsx("option", { value: "employer", children: "Employer" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "Enter your email", value: formData.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "new-password", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "Enter your password", value: formData.password, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "Confirm your password", value: formData.confirmPassword, onChange: handleChange })] }), formData.role === 'candidate' && (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsx("label", { htmlFor: "resumeFile", className: "block text-sm font-medium text-gray-700", children: "Upload Resume (PDF or DOCX) *" }), _jsx("input", { id: "resumeFile", name: "resumeFile", type: "file", accept: ".pdf,.docx", onChange: handleFileChange, className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Maximum file size: 10MB. We'll automatically extract your information." })] }) })), formData.role === 'employer' && (_jsxs("div", { children: [_jsx("label", { htmlFor: "companyName", className: "block text-sm font-medium text-gray-700", children: "Company Name" }), _jsx("input", { id: "companyName", name: "companyName", type: "text", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "Enter your company name", value: formData.companyName, onChange: handleChange })] }))] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isSubmitting, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting
                                    ? (formData.role === 'candidate' ? 'Uploading Resume...' : 'Creating account...')
                                    : (formData.role === 'candidate' ? 'Upload Resume & Continue' : 'Create account') }) })] })] }) }));
};
export default Register;
