import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        assessmentLink: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchJob = async () => {
            var _a, _b;
            if (!id)
                return;
            try {
                setLoading(true);
                const jobData = await jobsAPI.getById(id);
                setJob(jobData);
                setFormData({
                    title: jobData.title,
                    description: jobData.description,
                    requirements: jobData.requirements || '',
                    assessmentLink: jobData.assessmentLink || '',
                    status: jobData.status
                });
            }
            catch (err) {
                setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to load job details');
            }
            finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = async (e) => {
        var _a, _b;
        e.preventDefault();
        if (!id)
            return;
        setSaving(true);
        setError('');
        try {
            await jobsAPI.update(id, formData);
            navigate(`/dashboard/jobs/${id}`);
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to update job');
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading job details..." })] }) }));
    }
    if (error || !job) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Job Not Found" }), _jsx("p", { className: "text-gray-600 mb-6", children: error || 'The job you are looking for does not exist.' }), _jsx(Link, { to: "/dashboard", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700", children: "Back to Dashboard" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("nav", { className: "flex mb-4", "aria-label": "Breadcrumb", children: _jsxs("ol", { className: "flex items-center space-x-4", children: [_jsx("li", { children: _jsx(Link, { to: "/dashboard", className: "text-gray-500 hover:text-gray-700", children: "Dashboard" }) }), _jsx("li", { children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "flex-shrink-0 h-5 w-5 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }), _jsx(Link, { to: `/dashboard/jobs/${job.id}`, className: "ml-4 text-sm font-medium text-gray-500 hover:text-gray-700", children: "Job Details" })] }) }), _jsx("li", { children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "flex-shrink-0 h-5 w-5 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "ml-4 text-sm font-medium text-gray-500", children: "Edit Job" })] }) })] }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Edit Job" }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Update the details for \"", job.title, "\""] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-md", children: _jsx("p", { className: "text-red-600", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Job Title *" }), _jsx("input", { type: "text", id: "title", name: "title", value: formData.title, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "e.g., Senior Software Engineer" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Job Description *" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleChange, required: true, rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Describe the role, responsibilities, and what you're looking for in a candidate..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "requirements", className: "block text-sm font-medium text-gray-700 mb-2", children: "Requirements" }), _jsx("textarea", { id: "requirements", name: "requirements", value: formData.requirements, onChange: handleChange, rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "List the skills, experience, and qualifications required for this position..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "assessmentLink", className: "block text-sm font-medium text-gray-700 mb-2", children: "Assessment Link" }), _jsx("input", { type: "url", id: "assessmentLink", name: "assessmentLink", value: formData.assessmentLink, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "https://example.com/assessment" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Optional: Provide a link to an assessment or test that candidates should complete." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { id: "status", name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "closed", children: "Closed" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6", children: [_jsx(Link, { to: `/dashboard/jobs/${job.id}`, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: saving ? 'Saving...' : 'Save Changes' })] })] })] }) }) }));
};
export default EditJob;
