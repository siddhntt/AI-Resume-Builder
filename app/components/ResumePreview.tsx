import { useState } from 'react';
import type { ResumeData } from '~/lib/resumePdf';

interface ResumePreviewProps {
    resumeData: ResumeData;
    onEdit: (data: ResumeData) => void;
    onDownload: (data: ResumeData) => void;
}

export default function ResumePreview({ resumeData, onEdit, onDownload }: ResumePreviewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<ResumeData>(resumeData);

    const handleSave = () => {
        onEdit(editedData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData(resumeData);
        setIsEditing(false);
    };

    const updateField = (path: string[], value: any) => {
        const newData = JSON.parse(JSON.stringify(editedData)); // Deep clone
        
        // Handle array index updates (e.g., ['experience', '0'] with partial object)
        if (path.length === 2 && !isNaN(Number(path[1]))) {
            const arrayPath = path[0];
            const index = Number(path[1]);
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Merge partial object with existing array item
                newData[arrayPath][index] = { ...newData[arrayPath][index], ...value };
            } else {
                newData[arrayPath][index] = value;
            }
        } else {
            // Handle nested object/primitive updates
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (Array.isArray(current[key])) {
                    current = current[key];
                } else if (typeof current[key] === 'object' && current[key] !== null) {
                    current[key] = { ...current[key] };
                    current = current[key];
                } else {
                    current[key] = {};
                    current = current[key];
                }
            }
            
            const finalKey = path[path.length - 1];
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                current[finalKey] = { ...current[finalKey], ...value };
            } else {
                current[finalKey] = value;
            }
        }
        
        setEditedData(newData);
    };

    const addItem = (path: string[], newItem: any) => {
        const newData = JSON.parse(JSON.stringify(editedData)); // Deep clone
        let current: any = newData;
        
        for (const key of path) {
            if (Array.isArray(current[key])) {
                current = current[key];
            } else if (typeof current[key] === 'object' && current[key] !== null) {
                current[key] = { ...current[key] };
                current = current[key];
            } else {
                current[key] = [];
                current = current[key];
            }
        }
        
        current.push(newItem);
        setEditedData(newData);
    };

    const removeItem = (path: string[], index: number) => {
        const newData = JSON.parse(JSON.stringify(editedData)); // Deep clone
        let current: any = newData;
        
        for (const key of path) {
            if (Array.isArray(current[key])) {
                current = current[key];
            } else if (typeof current[key] === 'object' && current[key] !== null) {
                current[key] = { ...current[key] };
                current = current[key];
            }
        }
        
        current.splice(index, 1);
        setEditedData(newData);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gradient">Resume Preview</h2>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="primary-button w-fit px-6"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                            >
                                Edit Resume
                            </button>
                            <button
                                onClick={() => onDownload(isEditing ? editedData : resumeData)}
                                className="primary-button w-fit px-6"
                            >
                                Download PDF
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* Personal Information */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-div">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={editedData.personalInfo.name}
                                    onChange={(e) => updateField(['personalInfo', 'name'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="form-div">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editedData.personalInfo.email}
                                    onChange={(e) => updateField(['personalInfo', 'email'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="form-div">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={editedData.personalInfo.phone}
                                    onChange={(e) => updateField(['personalInfo', 'phone'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="form-div">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={editedData.personalInfo.location}
                                    onChange={(e) => updateField(['personalInfo', 'location'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="form-div">
                                <label>LinkedIn (optional)</label>
                                <input
                                    type="text"
                                    value={editedData.personalInfo.linkedin || ''}
                                    onChange={(e) => updateField(['personalInfo', 'linkedin'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="form-div">
                                <label>GitHub (optional)</label>
                                <input
                                    type="text"
                                    value={editedData.personalInfo.github || ''}
                                    onChange={(e) => updateField(['personalInfo', 'github'], e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-2xl font-bold text-gray-900">{resumeData.personalInfo.name}</p>
                            <p className="text-gray-600">
                                {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.location}
                            </p>
                            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github || resumeData.personalInfo.portfolio) && (
                                <p className="text-gray-600">
                                    {resumeData.personalInfo.linkedin && `LinkedIn: ${resumeData.personalInfo.linkedin} | `}
                                    {resumeData.personalInfo.github && `GitHub: ${resumeData.personalInfo.github} | `}
                                    {resumeData.personalInfo.portfolio && `Portfolio: ${resumeData.personalInfo.portfolio}`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                {resumeData.summary && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Professional Summary</h3>
                        {isEditing ? (
                            <textarea
                                value={editedData.summary}
                                onChange={(e) => updateField(['summary'], e.target.value)}
                                rows={4}
                                className="w-full p-2 border rounded-lg"
                            />
                        ) : (
                            <p className="text-gray-700">{resumeData.summary}</p>
                        )}
                    </div>
                )}

                {/* Experience */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Professional Experience</h3>
                        {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="mb-6 last:mb-0">
                                {isEditing ? (
                                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-div">
                                                <label>Position</label>
                                                <input
                                                    type="text"
                                                    value={editedData.experience[idx].position}
                                                    onChange={(e) => updateField(['experience', idx.toString()], { position: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Company</label>
                                                <input
                                                    type="text"
                                                    value={editedData.experience[idx].company}
                                                    onChange={(e) => updateField(['experience', idx.toString()], { company: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Start Date (MM/YYYY)</label>
                                                <input
                                                    type="text"
                                                    value={editedData.experience[idx].startDate}
                                                    onChange={(e) => updateField(['experience', idx.toString()], { startDate: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>End Date (MM/YYYY or Present)</label>
                                                <input
                                                    type="text"
                                                    value={editedData.experience[idx].endDate}
                                                    onChange={(e) => updateField(['experience', idx.toString()], { endDate: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-div">
                                            <label>Responsibilities (one per line)</label>
                                            <textarea
                                                value={editedData.experience[idx].responsibilities.join('\n')}
                                                onChange={(e) => updateField(['experience', idx.toString()], { 
                                                    responsibilities: e.target.value.split('\n').filter(r => r.trim()) 
                                                })}
                                                rows={4}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem(['experience'], idx)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Experience
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-lg text-gray-900">{exp.position}</p>
                                                <p className="text-gray-600">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                                            </div>
                                        </div>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                            {exp.responsibilities.map((resp, rIdx) => (
                                                <li key={rIdx}>{resp}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => addItem(['experience'], {
                                    company: '',
                                    position: '',
                                    startDate: '',
                                    endDate: '',
                                    responsibilities: []
                                })}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                + Add Experience
                            </button>
                        )}
                    </div>
                )}

                {/* Education */}
                {resumeData.education && resumeData.education.length > 0 && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Education</h3>
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                {isEditing ? (
                                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-div">
                                                <label>Degree</label>
                                                <input
                                                    type="text"
                                                    value={editedData.education[idx].degree}
                                                    onChange={(e) => updateField(['education', idx.toString()], { degree: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Field</label>
                                                <input
                                                    type="text"
                                                    value={editedData.education[idx].field}
                                                    onChange={(e) => updateField(['education', idx.toString()], { field: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Institution</label>
                                                <input
                                                    type="text"
                                                    value={editedData.education[idx].institution}
                                                    onChange={(e) => updateField(['education', idx.toString()], { institution: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Graduation Year</label>
                                                <input
                                                    type="text"
                                                    value={editedData.education[idx].graduationYear}
                                                    onChange={(e) => updateField(['education', idx.toString()], { graduationYear: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(['education'], idx)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Education
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">
                                        <span className="font-bold">{edu.degree} in {edu.field}</span> - {edu.institution} | {edu.graduationYear}
                                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                                        {edu.honors && ` | ${edu.honors}`}
                                    </p>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => addItem(['education'], {
                                    degree: '',
                                    field: '',
                                    institution: '',
                                    graduationYear: ''
                                })}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                + Add Education
                            </button>
                        )}
                    </div>
                )}

                {/* Skills */}
                {resumeData.skills && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="form-div">
                                    <label>Technical Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={editedData.skills.technical.join(', ')}
                                        onChange={(e) => updateField(['skills'], {
                                            ...editedData.skills,
                                            technical: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                        })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div className="form-div">
                                    <label>Soft Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={editedData.skills.soft.join(', ')}
                                        onChange={(e) => updateField(['skills'], {
                                            ...editedData.skills,
                                            soft: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                        })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {resumeData.skills.technical && resumeData.skills.technical.length > 0 && (
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Technical: </span>
                                        {resumeData.skills.technical.join(', ')}
                                    </p>
                                )}
                                {resumeData.skills.soft && resumeData.skills.soft.length > 0 && (
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Soft Skills: </span>
                                        {resumeData.skills.soft.join(', ')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Certifications */}
                {resumeData.certifications && resumeData.certifications.length > 0 && (
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Certifications</h3>
                        {resumeData.certifications.map((cert, idx) => (
                            <div key={idx} className="mb-2 last:mb-0">
                                {isEditing ? (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="form-div">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    value={editedData.certifications![idx].name}
                                                    onChange={(e) => updateField(['certifications', idx.toString()], { name: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Issuer</label>
                                                <input
                                                    type="text"
                                                    value={editedData.certifications![idx].issuer}
                                                    onChange={(e) => updateField(['certifications', idx.toString()], { issuer: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label>Date</label>
                                                <input
                                                    type="text"
                                                    value={editedData.certifications![idx].date}
                                                    onChange={(e) => updateField(['certifications', idx.toString()], { date: e.target.value })}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(['certifications'], idx)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Certification
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">{cert.name} - {cert.issuer} | {cert.date}</p>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => addItem(['certifications'], {
                                    name: '',
                                    issuer: '',
                                    date: ''
                                })}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                + Add Certification
                            </button>
                        )}
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                    <div className="pb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Projects</h3>
                        {resumeData.projects.map((project, idx) => (
                            <div key={idx} className="mb-6 last:mb-0">
                                {isEditing ? (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                        <div className="form-div">
                                            <label>Project Name</label>
                                            <input
                                                type="text"
                                                value={editedData.projects![idx].name}
                                                onChange={(e) => updateField(['projects', idx.toString()], { name: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="form-div">
                                            <label>Description</label>
                                            <textarea
                                                value={editedData.projects![idx].description}
                                                onChange={(e) => updateField(['projects', idx.toString()], { description: e.target.value })}
                                                rows={3}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="form-div">
                                            <label>Technologies (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={editedData.projects![idx].technologies.join(', ')}
                                                onChange={(e) => updateField(['projects', idx.toString()], { 
                                                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                                })}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="form-div">
                                            <label>URL (optional)</label>
                                            <input
                                                type="text"
                                                value={editedData.projects![idx].url || ''}
                                                onChange={(e) => updateField(['projects', idx.toString()], { url: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem(['projects'], idx)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove Project
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-bold text-lg text-gray-900">{project.name}</p>
                                        {project.url && (
                                            <p className="text-blue-600 text-sm mb-2">{project.url}</p>
                                        )}
                                        <p className="text-gray-700 mb-2">{project.description}</p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <p className="text-gray-600 text-sm">
                                                Technologies: {project.technologies.join(', ')}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => addItem(['projects'], {
                                    name: '',
                                    description: '',
                                    technologies: [],
                                    url: ''
                                })}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                + Add Project
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

