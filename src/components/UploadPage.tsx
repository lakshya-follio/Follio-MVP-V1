import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import type { User } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface UploadPageProps {
  onUpload: (file: File) => Promise<void> | void;
  user: User | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, user }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const processUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    setError('');
    try {
      await onUpload(uploadedFile);
    } catch (error) {
      console.error('Upload processing failed:', error);
      const message = error instanceof Error ? error.message : 'We could not parse that resume. Please try a different file.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const headerAction = user ? (
    <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm">
      Signed in as
      <span className="font-semibold text-slate-900">{user.name || user.email}</span>
    </div>
  ) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF] text-slate-900">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Step 1 of 3 · Upload
            </span>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
                Upload your resume to craft your Follio presence
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Drop in your latest resume and we will translate it into a polished, on-brand digital portfolio. Keep your story consistent across every touchpoint.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  <Upload className="h-3.5 w-3.5" />
                  Smart import
                </div>
                <p className="text-sm text-slate-600">
                  Upload PDF or DOCX files and let our parser structure your experience, education, and highlights instantly.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Guided polish
                </div>
                <p className="text-sm text-slate-600">
                  Use the next steps to fine-tune messaging, imagery, and calls to action that match your brand voice.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure storage
                </div>
                <p className="text-sm text-slate-600">
                  Your documents are encrypted at rest with Supabase so your credentials and achievements stay protected.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Ready to publish
                </div>
                <p className="text-sm text-slate-600">
                  In just a few clicks, publish a responsive Follio that is easy to share with clients, recruiters, and teams.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-cyan-500/10 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Upload resume</h2>
                <p className="text-sm text-slate-500">PDF or DOCX · up to 10MB</p>
              </div>
              <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                Auto-parse enabled
              </div>
            </div>
            {!uploadedFile ? (
              <div
                className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-50/70'
                    : 'border-slate-200/80 hover:border-cyan-200'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`rounded-full p-4 ${
                      dragActive ? 'bg-cyan-100/80 text-cyan-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Drag and drop your resume</h3>
                    <p className="mt-2 text-sm text-slate-500">or click below to choose a file from your device</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl">
                    <Upload className="h-4 w-4" />
                    Choose file
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                    />
                  </label>
                  <p className="text-xs text-slate-400">Supported formats: PDF, DOCX (max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-left shadow-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">File uploaded successfully</p>
                    <p className="text-xs text-emerald-600">{uploadedFile.name}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="ml-2 rounded-full p-1 transition hover:bg-emerald-100"
                  >
                    <X className="h-4 w-4 text-emerald-600" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <FileText className="h-4 w-4" />
                  <span>{uploadedFile.name}</span>
                  <span>({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button
                  onClick={processUpload}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Parse resume
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 shadow-sm backdrop-blur">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 md:mx-0">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Smart parsing</h3>
              <p className="text-sm text-slate-600">
                Advanced AI extracts your experience, education, and signature skills automatically so you can focus on storytelling.
              </p>
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 md:mx-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Effortless editing</h3>
              <p className="text-sm text-slate-600">
                Review every section with inline controls that match our polished design system—no clunky forms or modals.
              </p>
            </div>
            <div className="space-y-3 text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 md:mx-0">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Portfolio ready</h3>
              <p className="text-sm text-slate-600">
                Instantly transform your documents into a shareable Follio site with responsive layouts and branded theming.
              </p>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default UploadPage;