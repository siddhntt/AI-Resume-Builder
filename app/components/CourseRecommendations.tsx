import { useState } from 'react';

interface Course {
    title: string;
    provider: string;
    skill: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration?: string;
    url?: string;
    description?: string;
}

interface CourseRecommendationsProps {
    courses?: Course[];
    missingSkills?: string[];
}

export default function CourseRecommendations({ courses, missingSkills }: CourseRecommendationsProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    if (!courses || courses.length === 0) {
        return null;
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner":
                return "bg-green-100 text-green-800";
            case "Intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "Advanced":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getProviderIcon = (provider: string) => {
        const lowerProvider = provider.toLowerCase();
        if (lowerProvider.includes('aws')) return '☁️';
        if (lowerProvider.includes('google')) return '🔵';
        if (lowerProvider.includes('microsoft') || lowerProvider.includes('azure')) return '🔷';
        if (lowerProvider.includes('coursera')) return '📚';
        if (lowerProvider.includes('udemy')) return '🎓';
        if (lowerProvider.includes('edx')) return '📖';
        if (lowerProvider.includes('freecodecamp') || lowerProvider.includes('free code camp')) return '🆓';
        if (lowerProvider.includes('pluralsight')) return '💻';
        return '📝';
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Recommended Courses & Certifications</h3>
                    <p className="text-sm text-gray-600">Bridge your skill gaps with these targeted learning resources</p>
                </div>
            </div>

            {missingSkills && missingSkills.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Skills to focus on:</p>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-4 mt-2">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{getProviderIcon(course.provider)}</span>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                                        <p className="text-sm text-gray-600">{course.provider}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                                        {course.level}
                                    </span>
                                    {course.duration && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            ⏱️ {course.duration}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        🎯 {course.skill}
                                    </span>
                                </div>

                                {course.description && (
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                        {course.description}
                                    </p>
                                )}

                                {course.url && (
                                    <a
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        View Course
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Tip:</span> Focus on courses that directly address your missing skills. 
                    Complete certifications from recognized providers to add credibility to your resume.
                </p>
            </div>
        </div>
    );
}

