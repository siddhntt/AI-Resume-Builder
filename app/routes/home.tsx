import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Resume Builder & Analyzer</h1>
        <h2>Create professional resumes or analyze existing ones with AI-powered insights</h2>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap gap-6 justify-center w-full max-w-6xl mt-8">
        <div className="flex flex-col gap-4 bg-white rounded-2xl p-8 w-full md:w-[400px] shadow-lg">
          <h3 className="text-2xl font-bold text-gradient">Build Resume</h3>
          <p className="text-dark-200">
            Share your career details in a paragraph, and we'll create a professional, ATS-friendly resume for you. 
            Download it as a PDF ready for job applications.
          </p>
          <Link to="/builder" className="primary-button w-fit text-center">
            Start Building
          </Link>
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-2xl p-8 w-full md:w-[400px] shadow-lg">
          <h3 className="text-2xl font-bold text-gradient">Analyze Resume</h3>
          <p className="text-dark-200">
            Upload your existing resume and get AI-powered feedback on ATS compatibility, 
            content quality, structure, and skills matching for your target job.
          </p>
          <Link to="/upload" className="primary-button w-fit text-center">
            Analyze Now
          </Link>
        </div>
      </div>

      {/* Previous Resumes Section */}
      {!loadingResumes && resumes.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-3xl font-bold text-gradient mb-6">Your Resume Analyses</h2>
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      )}

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center mt-10">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}
    </section>
  </main>
}
