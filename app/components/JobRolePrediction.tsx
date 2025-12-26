import React from 'react';
import { cn } from "~/lib/utils";

interface JobRolePredictionProps {
  predictedJobRoles?: {
    role: string;
    confidence: number;
    matchingSkills: string[];
    missingSkills?: string[];
    description?: string;
  }[];
}

const JobRolePrediction: React.FC<JobRolePredictionProps> = ({ predictedJobRoles = [] }) => {
  if (!predictedJobRoles || predictedJobRoles.length === 0) {
    return null;
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 70) return 'High Match';
    if (confidence >= 50) return 'Good Match';
    return 'Moderate Match';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/icons/pin.svg" alt="Job Roles" className="w-6 h-6" />
        <div>
          <h2 className="text-2xl font-bold">Recommended Job Roles</h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your skills, experience, and education
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {predictedJobRoles.map((jobRole, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            {/* Header with Role and Confidence */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{jobRole.role}</h3>
                {jobRole.description && (
                  <p className="text-sm text-gray-600 mb-3">{jobRole.description}</p>
                )}
              </div>
              <div className="ml-4 text-right">
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold border",
                    getConfidenceColor(jobRole.confidence)
                  )}
                >
                  {jobRole.confidence}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getConfidenceLabel(jobRole.confidence)}
                </p>
              </div>
            </div>

            {/* Matching Skills */}
            {jobRole.matchingSkills && jobRole.matchingSkills.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/icons/check.svg" alt="Check" className="w-4 h-4" />
                  <p className="text-sm font-semibold text-green-700">
                    Matching Skills ({jobRole.matchingSkills.length})
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobRole.matchingSkills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {jobRole.missingSkills && jobRole.missingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img src="/icons/warning.svg" alt="Warning" className="w-4 h-4" />
                  <p className="text-sm font-semibold text-amber-700">
                    Skills to Consider Adding ({jobRole.missingSkills.length})
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobRole.missingSkills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> These role predictions are based on the skills and experience found in your resume. 
          Consider developing the suggested missing skills to improve your match for these roles.
        </p>
      </div>
    </div>
  );
};

export default JobRolePrediction;