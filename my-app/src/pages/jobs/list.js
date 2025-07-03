import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await jobsAPI.getAll();
                setJobs(data.jobs);
            }
            catch (err) {
                setError('Failed to load jobs');
                console.error('Error fetching jobs:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-xl", children: "Loading jobs..." }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-xl text-red-600", children: error }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Available Jobs" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Find your next career opportunity" })] }), jobs.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No jobs available" }), _jsx("p", { className: "text-gray-600", children: "Check back later for new opportunities!" })] })) : (_jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: jobs.map((job) => (_jsx("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: _jsx(Link, { to: `/jobs/${job.id}`, className: "hover:text-indigo-600 transition-colors duration-200", children: job.title }) }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: job.company.name }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'}`, children: job.status })] }) }), _jsx("p", { className: "text-gray-600 text-sm mt-3 line-clamp-3", children: job.description.length > 150
                                        ? `${job.description.substring(0, 150)}...`
                                        : job.description }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx(Link, { to: `/jobs/${job.id}`, className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium", children: "View Details \u2192" }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Posted ", new Date(job.createdAt).toLocaleDateString()] })] })] }) }, job.id))) }))] }) }));
};
export default JobList;
