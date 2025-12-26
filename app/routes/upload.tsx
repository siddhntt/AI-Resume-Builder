import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID, extractJSON} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        let feedbackText = '';
        try {
            if (typeof feedback.message.content === 'string') {
                feedbackText = feedback.message.content;
            } else if (Array.isArray(feedback.message.content) && feedback.message.content.length > 0) {
                feedbackText = feedback.message.content[0].text || '';
            } else {
                console.error('Unexpected feedback structure:', feedback);
                return setStatusText('Error: Unexpected response format from AI service');
            }
        } catch (e) {
            console.error('Error extracting feedback text:', e);
            console.error('Full feedback object:', feedback);
            return setStatusText('Error: Failed to extract response from AI service');
        }

        // Check if response is an error message (not JSON)
        const trimmedText = feedbackText.trim();
        const isErrorResponse = !trimmedText.startsWith('{') && !trimmedText.startsWith('[');
        
        if (isErrorResponse) {
            // Handle error messages from AI service
            let errorMessage = 'Error: Failed to analyze resume. ';
            
            if (trimmedText.toLowerCase().includes('usage limit') || 
                trimmedText.toLowerCase().includes('limit')) {
                errorMessage = 'AI Usage Limit Reached: Puter.com reports you have reached your AI usage limit. Please check your Puter.com account dashboard for usage details, wait for the limit to reset, or upgrade your account for more AI requests.';
            } else if (trimmedText.toLowerCase().includes('error')) {
                errorMessage = `Error: ${trimmedText}`;
            } else {
                errorMessage = `Error: ${trimmedText}`;
            }
            
            console.error('AI Service Error:', trimmedText);
            console.error('If Puter dashboard shows 0% usage, try refreshing the Puter dashboard or signing out and back in.');
            setStatusText(errorMessage);
            setIsProcessing(false);
            return;
        }

        // Extract JSON from response (handles markdown code blocks)
        try {
            const cleanedJSON = extractJSON(feedbackText);
            
            // Validate that we have valid JSON
            if (!cleanedJSON || cleanedJSON.trim().length === 0) {
                throw new Error('Empty JSON response');
            }
            
            const parsedFeedback = JSON.parse(cleanedJSON);
            
            console.log('=== AI RESPONSE DEBUG ===');
            console.log('Full parsed feedback:', JSON.stringify(parsedFeedback, null, 2));
            console.log('Overall Score:', parsedFeedback.overallScore);
            console.log('ATS Score:', parsedFeedback.ATS?.score);
            console.log('Skills:', parsedFeedback.skills);
            console.log('========================');
            
            // Validate that parsed feedback has expected structure
            if (!parsedFeedback || typeof parsedFeedback !== 'object') {
                throw new Error('Invalid feedback structure');
            }
            
            // Check if AI returned empty/zero data (fake model issue)
            const hasValidScores = 
                parsedFeedback.overallScore > 0 ||
                (parsedFeedback.ATS?.score ?? 0) > 0 ||
                (parsedFeedback.toneAndStyle?.score ?? 0) > 0;
                
            if (!hasValidScores) {
                console.error('AI returned all zero scores - fake model may not support complex prompts');
                setStatusText('Error: AI model returned invalid data. The "fake" model may not support complex analysis. Please contact support or try a different Puter account.');
                setIsProcessing(false);
                return;
            }
            
            data.feedback = parsedFeedback;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error('Failed to parse feedback:', error);
            console.error('Raw feedback text:', feedbackText);
            
            let errorMessage = 'Error: Failed to parse analysis results. ';
            
            if (error instanceof SyntaxError) {
                errorMessage += 'The AI response was not in the expected format. ';
            } else if (error instanceof Error) {
                errorMessage += error.message;
            }
            
            errorMessage += ' Please try again.';
            
            // If it's a usage limit error that wasn't caught earlier
            if (feedbackText && (feedbackText.toLowerCase().includes('usage limit') || 
                feedbackText.toLowerCase().includes('limit'))) {
                errorMessage = 'AI Usage Limit Reached: You have reached your AI usage limit. Please try again later or upgrade your account.';
            }
            
            setStatusText(errorMessage);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
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
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
