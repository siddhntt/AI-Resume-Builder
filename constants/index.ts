export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      basicInfo?: {
        name?: string; // Full name from resume
        email?: string; // Email address
        phone?: string; // Phone number
        location?: string; // City, State or City, Country
        linkedin?: string; // LinkedIn profile URL
        github?: string; // GitHub profile URL
        portfolio?: string; // Portfolio website URL
        totalExperience?: string; // Total years/months of experience (e.g., "5 years", "2 years 3 months")
        currentRole?: string; // Current job title/position
        education?: {
          degree?: string; // e.g., "Bachelor of Science", "Master of Arts"
          field?: string; // e.g., "Computer Science", "Business Administration"
          institution?: string; // University/College name
          graduationYear?: string; // Year of graduation
        }[];
        summary?: string; // Professional summary or objective from resume
      };
      predictedJobRoles?: {
        role: string; // Job title (e.g., "Frontend Developer", "Data Scientist", "Product Manager")
        confidence: number; // 0-100, how well the resume matches this role based on skills and experience
        matchingSkills: string[]; // Skills from resume that match this role
        missingSkills?: string[]; // Skills typically needed for this role but not found in resume
        description?: string; // Brief explanation of why this role is a good fit
      }[]; // Provide 3-5 most suitable job roles based on skills and experience
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
        resumeSkills: string[]; // Extract all technical and soft skills mentioned in the resume (e.g., ["JavaScript", "React", "Python", "Team Leadership"])
        jobRequiredSkills: string[]; // Extract all skills required or mentioned in the job description (e.g., ["React", "TypeScript", "Node.js", "AWS"])
        missingSkills: string[]; // Skills that are in jobRequiredSkills but NOT in resumeSkills (e.g., ["TypeScript", "AWS"])
        recommendedSkills: string[]; // Additional skills that would strengthen the resume for this role (e.g., ["Docker", "GraphQL"])
      };
      recommendedCourses?: {
        title: string; // Course or certification name
        provider: string; // Platform/provider (e.g., "Coursera", "Udemy", "AWS", "Google")
        skill: string; // Which missing/recommended skill this course addresses
        level: "Beginner" | "Intermediate" | "Advanced";
        duration?: string; // Estimated duration (e.g., "6 weeks", "40 hours")
        url?: string; // Course URL if available
        description?: string; // Brief description of what the course covers
      }[]; // Provide 4-5 courses/certifications that help bridge skill gaps
    }`;

export const prepareInstructions = ({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description for the job user is applying to to give more detailed feedback.
      If provided, take the job description into consideration.
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      
      IMPORTANT - BASIC INFO EXTRACTION:
      1. Extract all personal and professional information from the resume:
         - Name, email, phone, location
         - LinkedIn, GitHub, portfolio URLs if present
         - Total years/months of work experience
         - Current job title/role
         - Education details (degree, field, institution, graduation year)
         - Professional summary/objective if present
      
      IMPORTANT - JOB ROLE PREDICTION:
      1. Based on the skills, experience, and education extracted from the resume, predict 3-5 most suitable job roles.
      2. For each predicted role:
         - Calculate confidence score (0-100) based on how well the resume matches typical requirements for that role
         - List matching skills from the resume that are relevant to this role
         - List missing skills that are typically needed for this role but not found in the resume
         - Provide a brief description explaining why this role is a good fit
      3. Consider the combination of technical skills, soft skills, experience level, and education when predicting roles.
      4. Be realistic and accurate - don't suggest roles that clearly don't match the candidate's profile.
      
      IMPORTANT - SKILL EXTRACTION AND COMPARISON:
      1. Extract ALL technical skills, programming languages, frameworks, tools, and soft skills from the resume into resumeSkills array.
      2. Extract ALL skills mentioned or required in the job description into jobRequiredSkills array.
      3. Compare the two lists and identify missingSkills - skills that are in jobRequiredSkills but NOT in resumeSkills.
      4. Suggest recommendedSkills - additional relevant skills that would strengthen the resume for this specific role, even if not explicitly mentioned in the job description.
      5. Be comprehensive and specific with skill names (e.g., "React" not just "JavaScript framework", "AWS" not just "cloud").
      
      IMPORTANT - COURSE AND CERTIFICATION RECOMMENDATIONS:
      1. Based on the missingSkills and recommendedSkills, suggest 4-5 relevant courses or certifications.
      2. Focus on courses that directly address the skill gaps identified.
      3. Include a mix of:
         - Industry-recognized certifications (e.g., AWS Certified Solutions Architect, Google Cloud Professional, Microsoft Azure Fundamentals)
         - Popular online courses from reputable platforms (e.g., Coursera, Udemy, edX, Pluralsight)
         - Free resources when appropriate (e.g., freeCodeCamp, Khan Academy)
      4. For each recommendation, provide:
         - Course/certification title
         - Provider/platform name
         - Which skill it addresses
         - Difficulty level (Beginner/Intermediate/Advanced)
         - Estimated duration if known
         - Brief description of what it covers
      5. Prioritize courses that are most relevant to the job role and missing skills.
      6. Include both free and paid options when possible.
      
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;
