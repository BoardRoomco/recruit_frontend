import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { candidateAPI } from '../../services/api';
const CandidateProfile = () => {
    var _a;
    const [profile, setProfile] = useState(null);
    const [assessmentScores, setAssessmentScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await candidateAPI.getProfile();
                setProfile(data);
                // Fetch assessment scores
                console.log('Fetching assessment scores...');
                const scoresData = await candidateAPI.getAssessmentScores();
                console.log('Assessment scores response:', scoresData);
                setAssessmentScores(scoresData.assessmentScores || []);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch profile');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    const formatScore = (score) => {
        if (score === null)
            return 'N/A';
        return `${(score * 100).toFixed(1)}%`;
    };
    const getScoreColor = (score) => {
        if (score === null)
            return 'text-gray-500';
        if (score >= 0.8)
            return 'text-green-600';
        if (score >= 0.6)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    if (loading)
        return _jsx("div", { className: "text-gray-900", children: "Loading..." });
    if (error)
        return _jsxs("div", { className: "text-red-600", children: ["Error: ", error] });
    if (!profile)
        return _jsx("div", { className: "text-gray-900", children: "Profile not found." });
    return (_jsxs("div", { className: "max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow", children: [_jsx("h1", { className: "text-3xl font-bold mb-6 text-gray-900", children: "Candidate Profile" }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2 text-gray-900", children: [_jsxs("div", { children: [_jsx("strong", { children: "First Name:" }), " ", profile.firstName || 'Not set'] }), _jsxs("div", { children: [_jsx("strong", { children: "Last Name:" }), " ", profile.lastName || 'Not set'] }), _jsxs("div", { children: [_jsx("strong", { children: "Email:" }), " ", profile.email || ((_a = profile.user) === null || _a === void 0 ? void 0 : _a.email) || 'Not set'] })] }), _jsxs("div", { className: "space-y-2 text-gray-900", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Position:" }), " ", profile.currentPosition || 'Not set'] }), _jsxs("div", { children: [_jsx("strong", { children: "Education:" }), " ", profile.education || 'Not set'] })] })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Assessment Scores" }), assessmentScores.length === 0 ? (_jsxs("div", { className: "text-gray-500 text-center py-8", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCCA" }), _jsx("p", { children: "No assessment scores available yet." }), _jsx("p", { className: "text-sm", children: "Complete assessments to see your scores here." })] })) : (_jsx("div", { className: "space-y-4", children: assessmentScores.map((assessment) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: assessment.jobTitle }), _jsx("p", { className: "text-gray-600 text-sm", children: assessment.companyName })] }), _jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: "Completed" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Technical Accuracy" }), _jsx("div", { className: `text-lg font-semibold ${getScoreColor(assessment.technicalAccuracy)}`, children: formatScore(assessment.technicalAccuracy) })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Problem Solving" }), _jsx("div", { className: `text-lg font-semibold ${getScoreColor(assessment.problemSolving)}`, children: formatScore(assessment.problemSolving) })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Communication" }), _jsx("div", { className: `text-lg font-semibold ${getScoreColor(assessment.communication)}`, children: formatScore(assessment.communication) })] })] }), _jsx("div", { className: "mt-3 pt-3 border-t border-gray-100", children: _jsxs("div", { className: "text-xs text-gray-500", children: ["Assessment ID: ", assessment.assessmentId, " | Instance: ", assessment.instanceId] }) })] }, assessment.id))) }))] }), assessmentScores.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Assessment Statistics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: assessmentScores.length }), _jsx("div", { className: "text-sm text-blue-800", children: "Total Assessments" })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: assessmentScores.filter(a => a.technicalAccuracy && a.technicalAccuracy >= 0.8).length }), _jsx("div", { className: "text-sm text-green-800", children: "High Scores (80%+)" })] }), _jsxs("div", { className: "bg-purple-50 p-4 rounded-lg text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: assessmentScores.length > 0 ?
                                            Math.round(assessmentScores.length / 1) : 0 }), _jsx("div", { className: "text-sm text-purple-800", children: "Completion Rate" })] })] })] }))] }));
};
export default CandidateProfile;
