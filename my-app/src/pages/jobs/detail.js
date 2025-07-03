import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import ApplyOverlay from '../../components/ApplyOverlay';
const JobDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplyOverlay, setShowApplyOverlay] = useState(false);
    const [applying, setApplying] = useState(false);
    console.log('JobDetail render - showApplyOverlay:', showApplyOverlay);
    // Fetch job details from API
    useEffect(() => {
        const fetchJob = async () => {
            var _a, _b;
            if (!id) {
                setError('Job ID is required');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError('');
                const jobData = await jobsAPI.getById(id);
                setJob(jobData);
            }
            catch (err) {
                console.error('Error fetching job:', err);
                setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to load job details');
            }
            finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);
    const handleApplySubmit = async (coverLetter) => {
        var _a, _b;
        if (!isAuthenticated) {
            alert('Please log in to apply for this job');
            navigate('/login');
            return;
        }
        if (!job) {
            alert('Job information not available');
            return;
        }
        try {
            setApplying(true);
            console.log('Submitting application for job:', job.id);
            console.log('Cover letter:', coverLetter);
            const result = await applicationsAPI.apply(job.id, coverLetter);
            console.log('Application submitted successfully:', result);
            // Show success message
            alert('Application submitted successfully!');
            setShowApplyOverlay(false);
        }
        catch (err) {
            console.error('Error submitting application:', err);
            const errorMessage = ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to submit application';
            alert(`Error: ${errorMessage}`);
        }
        finally {
            setApplying(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading job details..." })] }) }));
    }
    if (error || !job) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Job Not Found" }), _jsx("p", { className: "text-gray-600 mb-6", children: error || 'The job you are looking for does not exist.' }), _jsx(Link, { to: "/jobs", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700", children: "Back to Jobs" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-8", children: [_jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded", children: [_jsxs("p", { className: "text-sm", children: ["Debug: showApplyOverlay = ", showApplyOverlay.toString()] }), _jsxs("p", { className: "text-sm", children: ["Auth: isAuthenticated = ", isAuthenticated === null || isAuthenticated === void 0 ? void 0 : isAuthenticated.toString()] }), _jsxs("p", { className: "text-sm", children: ["User Role: ", user === null || user === void 0 ? void 0 : user.role] }), _jsx("button", { onClick: () => setShowApplyOverlay(!showApplyOverlay), className: "mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs", children: "Toggle Overlay" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("nav", { className: "flex mb-4", "aria-label": "Breadcrumb", children: _jsxs("ol", { className: "flex items-center space-x-4", children: [_jsx("li", { children: _jsx(Link, { to: "/jobs", className: "text-gray-500 hover:text-gray-700", children: "Jobs" }) }), _jsx("li", { children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "flex-shrink-0 h-5 w-5 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "ml-4 text-sm font-medium text-gray-500", children: "Job Details" })] }) })] }) }), _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: job.title }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Posted by ", job.company.name] })] }), _jsxs("div", { className: "flex space-x-3", children: [isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === 'candidate' && (_jsxs("button", { onClick: () => {
                                                    console.log('=== APPLY BUTTON CLICKED ===');
                                                    console.log('Current showApplyOverlay state:', showApplyOverlay);
                                                    console.log('Setting showApplyOverlay to true');
                                                    setShowApplyOverlay(true);
                                                    console.log('Apply overlay should now be visible');
                                                }, className: "inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Apply Now"] })), !isAuthenticated && (_jsxs("button", { onClick: () => navigate('/login'), className: "inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" }) }), "Login to Apply"] }))] })] })] }), _jsxs("div", { className: "bg-white shadow rounded-lg mb-8", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Job Information" }) }), _jsxs("div", { className: "px-6 py-4 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Status" }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'}`, children: job.status.charAt(0).toUpperCase() + job.status.slice(1) })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Posted" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: new Date(job.createdAt).toLocaleDateString() })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Description" }), _jsx("div", { className: "bg-gray-50 rounded-md p-4", children: _jsx("p", { className: "text-gray-900 whitespace-pre-wrap", children: job.description }) })] }), job.requirements && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Requirements" }), _jsx("div", { className: "bg-gray-50 rounded-md p-4", children: _jsx("p", { className: "text-gray-900 whitespace-pre-wrap", children: job.requirements }) })] })), job.assessmentLink && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Assessment Link" }), _jsx("div", { className: "bg-gray-50 rounded-md p-4", children: _jsx("a", { href: job.assessmentLink, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-500 underline", children: job.assessmentLink }) })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-2", children: "Company Information" }), _jsx("div", { className: "bg-gray-50 rounded-md p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: job.company.name }), job.company.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: job.company.description }))] }), job.company.website && (_jsx("div", { className: "text-right", children: _jsx("a", { href: job.company.website, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-blue-600 hover:text-blue-500", children: "Visit Website" }) }))] }) })] })] })] }), _jsx("div", { className: "flex justify-start", children: _jsxs(Link, { to: "/jobs", className: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back to Jobs"] }) })] }), _jsx(ApplyOverlay, { isVisible: showApplyOverlay, onClose: () => setShowApplyOverlay(false), jobTitle: job.title, onSubmit: handleApplySubmit, applying: applying })] }));
};
export default JobDetail;
