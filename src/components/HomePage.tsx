import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Sparkles, Layers, Palette, Globe, UploadCloud, Wand2, ArrowRight, ShieldCheck } from 'lucide-react';
import type { User } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface HomePageProps {
    onUpload: (file: File) => Promise<void> | void;
    user: User | null;
    onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onUpload, user, onLoginClick }) => {
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

    const scrollToUpload = () => {
        const section = document.getElementById('upload-section');
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const headerAction = user ? (
        <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm">
            Signed in as
            <span className="font-semibold text-slate-900">{user.name || user.email}</span>
        </div>
    ) : (
        <button
            onClick={onLoginClick}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-slate-900"
        >
            Sign in
            <ArrowRight className="h-4 w-4" />
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5FBFF] via-white to-[#ECF8FF] text-slate-900">
            <BrandHeader subdued action={headerAction} />

            <main className="mx-auto w-full max-w-6xl px-4">
                {/* Hero Section */}
                <section className="py-16 md:py-24 text-center">
                    <div className="mx-auto max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                            <Sparkles className="w-4 h-4 text-cyan-500" />
                            Build polished portfolios in minutes
                        </span>
                        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
                            Create Stunning Digital Portfolios Effortlessly
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 md:text-xl">
                            Follio helps individuals and businesses launch beautiful, customizable portfolios in minutes. No coding, just smart layouts crafted for you.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                onClick={scrollToUpload}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Start Building
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                className="inline-flex items-center gap-2 text-base font-semibold text-cyan-600 hover:text-cyan-700"
                                onClick={scrollToUpload}
                            >
                                Upload Resume
                            </button>
                        </div>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-3">
                        {[{ icon: Layers, title: 'AI-Driven', description: 'Let Follio transform your content into a polished digital portfolio that reflects your brand.' }, { icon: Palette, title: 'Drag-and-Drop Simplicity', description: 'Choose layouts, tweak sections, and launch faster with intuitive tools.' }, { icon: Globe, title: 'Branded Customization', description: 'Match your colors, fonts, and voice to create a cohesive online presence.' }].map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 text-cyan-600">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upload Section */}
                <section id="upload-section" className="py-16">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                                Step 1 of 3 · Upload
                            </span>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900">
                                    Upload your resume to craft your Follio presence
                                </h2>
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
                                    className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${dragActive
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
                                            className={`rounded-full p-4 ${dragActive ? 'bg-cyan-100/80 text-cyan-600' : 'bg-slate-100 text-slate-500'
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
                    </div>
                </section>

                {/* Why Follio Section */}
                <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm mb-16">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-3xl font-semibold text-slate-900">Why Follio?</h2>
                        <p className="mt-4 text-slate-600">
                            We believe your digital presence deserves the same polish as your skills. Follio removes the noise and delivers beautiful, AI-powered portfolios that convert attention into opportunity.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {[{ icon: UploadCloud, title: 'Upload Your Content', description: 'Drop your resume, copy, or assets into Follio. Our parser structures everything instantly.' }, { icon: Wand2, title: 'Let Follio Handle Design', description: 'AI suggests layouts, sections, and messaging that highlights what makes you unique.' }, { icon: Globe, title: 'Publish in Minutes', description: 'Launch a responsive, shareable site with custom domains and analytics built in.' }].map((item) => (
                            <div key={item.title} className="rounded-2xl bg-gradient-to-br from-[#F5FBFF] to-white p-6 text-left">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <AppFooter />
        </div>
    );
};

export default HomePage;
