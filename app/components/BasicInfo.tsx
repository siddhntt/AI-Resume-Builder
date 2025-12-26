import React from 'react';
import { cn } from "~/lib/utils";

interface BasicInfoProps {
  basicInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    totalExperience?: string;
    currentRole?: string;
    education?: {
      degree?: string;
      field?: string;
      institution?: string;
      graduationYear?: string;
    }[];
    summary?: string;
  };
}

const BasicInfo: React.FC<BasicInfoProps> = ({ basicInfo }) => {
  if (!basicInfo) {
    return null;
  }

  const InfoRow = ({ label, value, icon }: { label: string; value?: string; icon?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-2">
        {icon && (
          <img src={icon} alt={label} className="w-5 h-5 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-0.5">{label}</p>
          <p className="text-base font-medium text-gray-800 break-words">{value}</p>
        </div>
      </div>
    );
  };

  const LinkRow = ({ label, url, icon }: { label: string; url?: string; icon?: string }) => {
    if (!url) return null;
    return (
      <div className="flex items-start gap-3 py-2">
        {icon && (
          <img src={icon} alt={label} className="w-5 h-5 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-0.5">{label}</p>
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-blue-600 hover:text-blue-800 break-words underline"
          >
            {url}
          </a>
        </div>
      </div>
    );
  };

  const hasAnyInfo = 
    basicInfo.name || 
    basicInfo.email || 
    basicInfo.phone || 
    basicInfo.location || 
    basicInfo.linkedin || 
    basicInfo.github || 
    basicInfo.portfolio || 
    basicInfo.totalExperience || 
    basicInfo.currentRole || 
    basicInfo.education?.length || 
    basicInfo.summary;

  if (!hasAnyInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/icons/info.svg" alt="Info" className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Extracted Information</h2>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        {(basicInfo.name || basicInfo.email || basicInfo.phone || basicInfo.location) && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
            <div className="space-y-1">
              <InfoRow label="Name" value={basicInfo.name} />
              <InfoRow label="Email" value={basicInfo.email} />
              <InfoRow label="Phone" value={basicInfo.phone} />
              <InfoRow label="Location" value={basicInfo.location} />
            </div>
          </div>
        )}

        {/* Professional Links */}
        {(basicInfo.linkedin || basicInfo.github || basicInfo.portfolio) && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Professional Links</h3>
            <div className="space-y-1">
              <LinkRow label="LinkedIn" url={basicInfo.linkedin} />
              <LinkRow label="GitHub" url={basicInfo.github} />
              <LinkRow label="Portfolio" url={basicInfo.portfolio} />
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {basicInfo.summary && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{basicInfo.summary}</p>
          </div>
        )}

        {/* Experience & Role */}
        {(basicInfo.totalExperience || basicInfo.currentRole) && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Experience</h3>
            <div className="space-y-1">
              <InfoRow label="Current Role" value={basicInfo.currentRole} />
              <InfoRow label="Total Experience" value={basicInfo.totalExperience} />
            </div>
          </div>
        )}

        {/* Education */}
        {basicInfo.education && basicInfo.education.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Education</h3>
            <div className="space-y-4">
              {basicInfo.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  {edu.degree && edu.field && (
                    <p className="text-base font-semibold text-gray-800">
                      {edu.degree} in {edu.field}
                    </p>
                  )}
                  {edu.institution && (
                    <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                  )}
                  {edu.graduationYear && (
                    <p className="text-sm text-gray-500 mt-1">Graduated: {edu.graduationYear}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;

