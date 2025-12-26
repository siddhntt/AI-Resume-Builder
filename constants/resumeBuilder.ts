export const ResumeBuilderResponseFormat = `
interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string; // Professional summary (2-3 sentences)
  experience: {
    company: string;
    position: string;
    startDate: string; // Format: "MM/YYYY"
    endDate: string; // Format: "MM/YYYY" or "Present"
    responsibilities: string[]; // 3-5 bullet points
    achievements?: string[]; // Optional achievements
  }[];
  education: {
    degree: string; // e.g., "Bachelor of Science"
    field: string; // e.g., "Computer Science"
    institution: string;
    graduationYear: string;
    gpa?: string; // Optional
    honors?: string; // Optional
  }[];
  skills: {
    technical: string[]; // Technical skills, programming languages, tools
    soft: string[]; // Soft skills
  };
  certifications?: {
    name: string;
    issuer: string;
    date: string; // Format: "MM/YYYY"
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
}`;

export const prepareResumeBuilderInstructions = (careerDetails: string) =>
  `You are an expert resume builder specializing in creating ATS-friendly resumes.
  Your task is to analyze the user's career details provided in a paragraph format and structure it into a well-organized, professional resume.
  
  IMPORTANT GUIDELINES:
  1. Extract ALL information from the paragraph - don't make up or assume details
  2. Structure the information in a clear, professional format suitable for ATS systems
  3. Use action verbs and quantifiable achievements where possible
  4. Format dates consistently (MM/YYYY)
  5. Organize experience chronologically (most recent first)
  6. Extract technical skills, soft skills, education, work experience, certifications, and projects
  7. Create a compelling professional summary based on the provided information
  8. If information is missing (like dates, company names), use reasonable placeholders or omit that field
  9. Make the resume ATS-friendly by using standard section headers and clear formatting
  
  User's career details:
  ${careerDetails}
  
  Provide the structured resume data using the following format:
  ${ResumeBuilderResponseFormat}
  
  Return ONLY a valid JSON object matching this interface, without any markdown code blocks, explanations, or additional text.
  The JSON should be parseable and complete.`;

