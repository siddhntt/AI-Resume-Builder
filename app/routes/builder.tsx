import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import ResumePreview from "~/components/ResumePreview";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { prepareResumeBuilderInstructions } from "../../constants/resumeBuilder";
import { generateResumePDF, type ResumeData } from "~/lib/resumePdf";
import { extractJSON } from "~/lib/utils";

export default function Builder() {
    const { auth, isLoading, ai } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [careerDetails, setCareerDetails] = useState('');
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleBuild = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!careerDetails.trim()) {
            setStatusText('Please provide your career details');
            return;
        }

        setIsProcessing(true);
        setStatusText('Analyzing your career details...');

        try {
            // Use AI to parse and structure the career details
            const response = await ai.chat(
                prepareResumeBuilderInstructions(careerDetails),
                { model: "fake" }
            );

            if (!response) {
                setStatusText('Error: Failed to process your details. Please try again.');
                setIsProcessing(false);
                return;
            }

            const responseText = typeof response.message.content === 'string'
                ? response.message.content
                : response.message.content[0].text;

            // Check if response is an error message (not JSON)
            const trimmedText = responseText.trim();
            const isErrorResponse = !trimmedText.startsWith('{') && !trimmedText.startsWith('[');
            
            if (isErrorResponse) {
                // Handle error messages from AI service
                let errorMessage = 'Error: Failed to process your career details. ';
                
                if (trimmedText.toLowerCase().includes('usage limit') || 
                    trimmedText.toLowerCase().includes('limit')) {
                    errorMessage = 'AI Usage Limit Reached: You have reached your AI usage limit. Please try again later or upgrade your account.';
                } else if (trimmedText.toLowerCase().includes('error')) {
                    errorMessage = `Error: ${trimmedText}`;
                } else {
                    errorMessage = `Error: ${trimmedText}`;
                }
                
                console.error('AI Service Error:', trimmedText);
                setStatusText(errorMessage);
                setIsProcessing(false);
                return;
            }

            setStatusText('Structuring your resume...');

            // Extract JSON from response
            try {
                const cleanedJSON = extractJSON(responseText);
                
                // Validate that we have valid JSON
                if (!cleanedJSON || cleanedJSON.trim().length === 0) {
                    throw new Error('Empty JSON response');
                }
                
                const parsedData: ResumeData = JSON.parse(cleanedJSON);
                
                // Validate that parsed data has expected structure
                if (!parsedData || typeof parsedData !== 'object' || !parsedData.personalInfo) {
                    throw new Error('Invalid resume data structure');
                }

                setResumeData(parsedData);
                setShowPreview(true);
                setIsProcessing(false);
                setStatusText('');
            } catch (parseError) {
                console.error('Failed to parse resume data:', parseError);
                console.error('Raw response text:', responseText);
                
                let errorMessage = 'Error: Failed to parse resume data. ';
                
                if (parseError instanceof SyntaxError) {
                    errorMessage += 'The AI response was not in the expected format. ';
                }
                
                // Check for usage limit in the text
                if (trimmedText.toLowerCase().includes('usage limit') || 
                    trimmedText.toLowerCase().includes('limit')) {
                    errorMessage = 'AI Usage Limit Reached: You have reached your AI usage limit. Please try again later or upgrade your account.';
                } else {
                    errorMessage += 'Please check your input and try again.';
                }
                
                setStatusText(errorMessage);
                setIsProcessing(false);
            }

        } catch (error) {
            console.error('Failed to build resume:', error);
            setStatusText('Error: Failed to build resume. Please check your input and try again.');
            setIsProcessing(false);
        }
    };

    const handleEdit = (data: ResumeData) => {
        setResumeData(data);
    };

    const handleDownload = (data: ResumeData) => {
        // Generate PDF
        const pdfBlob = generateResumePDF(data);

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleStartOver = () => {
        setShowPreview(false);
        setResumeData(null);
        setCareerDetails('');
        setStatusText('');
    };

    if (!isLoading && !auth.isAuthenticated) {
        navigate('/auth?next=/builder');
    }

    if (showPreview && resumeData) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover">
                <Navbar />
                <section className="main-section">
                    <div className="flex flex-col items-center w-full">
                        <button
                            onClick={handleStartOver}
                            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full self-start"
                        >
                            ← Start Over
                        </button>
                        <ResumePreview
                            resumeData={resumeData}
                            onEdit={handleEdit}
                            onDownload={handleDownload}
                        />
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Build Your ATS-Friendly Resume</h1>
                    {isProcessing ? (
                        <>
                            <h2 className={statusText.toLowerCase().includes('error') || statusText.toLowerCase().includes('limit') 
                                ? 'text-red-600' 
                                : ''}>{statusText}</h2>
                            {statusText.toLowerCase().includes('error') || statusText.toLowerCase().includes('limit') ? (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-2xl">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                                            <p className="text-red-800">{statusText}</p>
                                            {statusText.toLowerCase().includes('usage limit') && (
                                                <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                                                    <p className="text-sm text-red-700">
                                                        <strong>What you can do:</strong>
                                                    </p>
                                                    <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                                                        <li>Wait a few minutes and try again</li>
                                                        <li>Check your Puter.com account usage limits</li>
                                                        <li>Consider upgrading your account if you need more AI requests</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img src="/images/resume-scan.gif" className="w-full" />
                            )}
                        </>
                    ) : (
                        <h2>Share your career journey and we'll create a professional resume for you</h2>
                    )}
                    {!isProcessing && (
                        <form onSubmit={handleBuild} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="career-details">
                                    Your Career Details
                                    <span className="text-sm text-gray-500 block mt-1">
                                        Include: Your name, contact info, work experience, education, skills, projects, certifications, and any other relevant details
                                    </span>
                                </label>
                                <textarea
                                    id="career-details"
                                    name="career-details"
                                    rows={12}
                                    placeholder="Example: My name is John Doe. I'm a software engineer with 5 years of experience. I work at Tech Corp as a Senior Developer since 2020. Previously, I worked at Startup Inc from 2018 to 2020 as a Junior Developer. I have a Bachelor's degree in Computer Science from State University, graduated in 2018. I'm skilled in JavaScript, React, Node.js, Python, and AWS. I've built several web applications and mobile apps. I'm certified in AWS Solutions Architect. You can reach me at john.doe@email.com, phone: 123-456-7890, located in San Francisco, CA. My LinkedIn is linkedin.com/in/johndoe and GitHub is github.com/johndoe..."
                                    value={careerDetails}
                                    onChange={(e) => setCareerDetails(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="primary-button" type="submit" disabled={!careerDetails.trim()}>
                                Generate Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

