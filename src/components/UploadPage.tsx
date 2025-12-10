import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import type { User } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface UploadPageProps {
  onUpload: (file: File) => Promise<void> | void;
  user: User | null;
  onLoginRequest?: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, user, onLoginRequest }) => {
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
  ) : (
    onLoginRequest ? (
      <button
        onClick={onLoginRequest}
        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-white hover:text-blue-800"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </button>
    ) : null
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-6 py-24">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm ring-1 ring-blue-100/50">
              Step 1 of 3 · Upload
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Upload your resume to craft your <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Follio presence</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Drop in your latest resume and we will translate it into a polished, on-brand digital portfolio. Keep your story consistent across every touchpoint.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="group rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-md transition hover:border-blue-200/60 hover:bg-white hover:shadow-xl hover:shadow-blue-500/15">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-blue-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 group-hover:bg-blue-100">
                  <Upload className="h-3.5 w-3.5" />
                  Smart import
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Upload PDF or DOCX files and let our parser structure your experience, education, and highlights instantly.
                </p>
              </div>
              <div className="group rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-sky-500/5 backdrop-blur-md transition hover:border-sky-200/60 hover:bg-white hover:shadow-xl hover:shadow-sky-500/10">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-sky-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700 group-hover:bg-sky-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Guided polish
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Use the next steps to fine-tune messaging, imagery, and calls to action that match your brand voice.
                </p>
              </div>
              <div className="group rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-blue-500/5 backdrop-blur-md transition hover:border-indigo-200/60 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-indigo-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700 group-hover:bg-indigo-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure storage
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  Your documents are encrypted at rest with Supabase so your credentials and achievements stay protected.
                </p>
              </div>
              <div className="group rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg shadow-sky-500/5 backdrop-blur-md transition hover:border-sky-200/60 hover:bg-white hover:shadow-xl hover:shadow-sky-500/10">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-sky-100/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700 group-hover:bg-sky-100">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Ready to publish
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  In just a few clicks, publish a responsive Follio that is easy to share with clients, recruiters, and teams.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-2xl shadow-blue-500/15 backdrop-blur-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upload resume</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">PDF or DOCX · up to 10MB</p>
              </div>
              <div className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                Auto-parse enabled
              </div>
            </div>
            {!uploadedFile ? (
              <div
                className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${dragActive
                  ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
                  : 'border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div
                    className={`rounded-2xl p-5 transition-all duration-300 ${dragActive
                      ? 'bg-blue-100 text-blue-600 scale-110 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:scale-110'
                      }`}
                  >
                    <Upload className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Drag and drop your resume</h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">or click below to choose a file from your device</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95">
                    <Upload className="h-4 w-4" />
                    Choose file
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                    />
                  </label>
                  <p className="text-xs font-medium text-slate-400">Supported formats: PDF, DOCX (max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-center">
                <div className="inline-flex items-center gap-4 rounded-3xl border border-sky-200 bg-sky-50/50 px-6 py-4 text-left shadow-sm backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sky-800">File uploaded successfully</p>
                    <p className="text-xs font-medium text-sky-600">{uploadedFile.name}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="ml-2 rounded-full p-2 text-sky-600 transition hover:bg-sky-100 hover:text-sky-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FileText className="h-4 w-4" />
                    <span>{uploadedFile.name}</span>
                    <span className="text-slate-400">·</span>
                    <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <button
                  onClick={processUpload}
                  disabled={uploading}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {uploading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Parse resume & build profile
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-600">
                <X className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-12 shadow-lg shadow-blue-500/10 backdrop-blur-md">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100 md:mx-0">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart parsing</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                Advanced AI extracts your experience, education, and signature skills automatically so you can focus on storytelling.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100 md:mx-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Effortless editing</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                Review every section with inline controls that match our polished design system—no clunky forms or modals.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100 md:mx-0">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Portfolio ready</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
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