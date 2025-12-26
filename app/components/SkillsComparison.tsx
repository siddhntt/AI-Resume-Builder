import React from 'react';
import { cn } from "~/lib/utils";

interface SkillsComparisonProps {
  resumeSkills?: string[];
  jobRequiredSkills?: string[];
  missingSkills?: string[];
  recommendedSkills?: string[];
}

const SkillsComparison: React.FC<SkillsComparisonProps> = ({
  resumeSkills = [],
  jobRequiredSkills = [],
  missingSkills = [],
  recommendedSkills = [],
}) => {
  // Calculate match percentage
  const matchPercentage = jobRequiredSkills.length > 0
    ? Math.round(((jobRequiredSkills.length - missingSkills.length) / jobRequiredSkills.length) * 100)
    : 0;

  const SkillTag = ({ skill, variant }: { skill: string; variant: 'resume' | 'job' | 'missing' | 'recommended' }) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-sm font-medium transition-all";
    const variantClasses = {
      resume: "bg-green-100 text-green-700 border border-green-200",
      job: "bg-blue-100 text-blue-700 border border-blue-200",
      missing: "bg-red-100 text-red-700 border border-red-200",
      recommended: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };

    return (
      <span className={cn(baseClasses, variantClasses[variant])}>
        {skill}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 space-y-6">
      {/* Header with match percentage */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Skills Analysis</h2>
          <p className="text-gray-600">
            Comparison between your resume skills and job requirements
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{matchPercentage}%</div>
          <div className="text-sm text-gray-500">Match Rate</div>
        </div>
      </div>

      {/* Skills Match Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Resume Skills</div>
          <div className="text-2xl font-bold text-green-600">{resumeSkills.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Job Required</div>
          <div className="text-2xl font-bold text-blue-600">{jobRequiredSkills.length}</div>
        </div>
      </div>

      {/* Resume Skills Section */}
      {resumeSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/icons/check.svg" alt="Check" className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Skills in Your Resume</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} variant="resume" />
            ))}
          </div>
        </div>
      )}

      {/* Job Required Skills Section */}
      {jobRequiredSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/icons/info.svg" alt="Info" className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Skills Required by Job</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobRequiredSkills.map((skill, index) => {
              const isMissing = missingSkills.includes(skill);
              return (
                <SkillTag 
                  key={index} 
                  skill={skill} 
                  variant={isMissing ? "missing" : "job"} 
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Missing Skills Section */}
      {missingSkills.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src="/icons/warning.svg" alt="Warning" className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-red-700">Missing Skills (Add These!)</h3>
          </div>
          <p className="text-sm text-red-600 mb-3">
            These skills are required by the job but not found in your resume. Consider adding them to improve your match.
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Skills Section */}
      {recommendedSkills.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src="/icons/pin.svg" alt="Pin" className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-yellow-700">Recommended Skills</h3>
          </div>
          <p className="text-sm text-yellow-600 mb-3">
            These additional skills would strengthen your resume for this role.
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} variant="recommended" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {resumeSkills.length === 0 && jobRequiredSkills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No skill data available. Skills will be extracted during resume analysis.</p>
        </div>
      )}
    </div>
  );
};

export default SkillsComparison;

