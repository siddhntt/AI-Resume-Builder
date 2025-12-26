interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    basicInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        portfolio?: string;
        totalExperience?: string; // e.g., "5 years" or "3 months"
        currentRole?: string;
        education?: {
            degree?: string;
            field?: string;
            institution?: string;
            graduationYear?: string;
        }[];
        summary?: string;
    };
    predictedJobRoles?: {
        role: string; // Job title
        confidence: number; // 0-100, how well the resume matches this role
        matchingSkills: string[]; // Skills from resume that match this role
        missingSkills?: string[]; // Skills typically needed for this role but not in resume
        description?: string; // Brief description of why this role fits
    }[];
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
        resumeSkills?: string[]; // Skills extracted from the resume
        jobRequiredSkills?: string[]; // Skills required by the job description
        missingSkills?: string[]; // Skills in job description but not in resume
        recommendedSkills?: string[]; // Additional skills recommended to add
    };
    recommendedCourses?: {
        title: string;
        provider: string;
        skill: string;
        level: "Beginner" | "Intermediate" | "Advanced";
        duration?: string;
        url?: string;
        description?: string;
    }[];
}
