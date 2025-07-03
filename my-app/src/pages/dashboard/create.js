import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
const CreateJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        assessmentLink: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = async (e) => {
        var _a, _b;
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await jobsAPI.create(formData);
            navigate('/dashboard');
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to create job');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Create New Job" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Fill in the details below to create a new job posting." })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-md", children: _jsx("p", { className: "text-red-600", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Job Title *" }), _jsx("input", { type: "text", id: "title", name: "title", value: formData.title, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "e.g., Senior Software Engineer" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Job Description *" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleChange, required: true, rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Describe the role, responsibilities, and what you're looking for in a candidate..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "requirements", className: "block text-sm font-medium text-gray-700 mb-2", children: "Requirements" }), _jsx("textarea", { id: "requirements", name: "requirements", value: formData.requirements, onChange: handleChange, rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "List the skills, experience, and qualifications required for this position..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "assessmentLink", className: "block text-sm font-medium text-gray-700 mb-2", children: "Assessment Link" }), _jsx("input", { type: "url", id: "assessmentLink", name: "assessmentLink", value: formData.assessmentLink, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "https://example.com/assessment" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Optional: Provide a link to an assessment or test that candidates should complete." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { id: "status", name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "closed", children: "Closed" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6", children: [_jsx("button", { type: "button", onClick: () => navigate('/dashboard/jobs'), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Creating...' : 'Create Job' })] })] })] }) }) }));
};
export default CreateJob;
