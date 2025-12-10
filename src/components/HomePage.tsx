import React, { useState } from 'react';
import { Upload, X, CheckCircle, Sparkles, Layers, Palette, Globe, UploadCloud, Wand2, ArrowRight } from 'lucide-react';
import type { User } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface HomePageProps {
    onUpload: (file: File) => Promise<void> | void;
    onDemoLoad: () => void;
    user: User | null;
    onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onUpload, onDemoLoad, user, onLoginClick }) => {
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
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-800"
        >
            Sign in
            <ArrowRight className="h-4 w-4" />
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900 font-sans selection:bg-blue-100">
            <BrandHeader subdued action={headerAction} />

            <main className="mx-auto w-full max-w-7xl px-6">
                {/* Hero Section */}
                <section className="py-24 md:py-32 text-center animate-fade-in">
                    <div className="mx-auto max-w-4xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm ring-1 ring-blue-100/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            Build polished portfolios in minutes
                        </span>
                        <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-7xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Create Stunning Digital <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 bg-clip-text text-transparent">Portfolios</span> Effortlessly
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:text-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            Follio helps individuals and businesses launch beautiful, customizable portfolios in minutes. No coding, just smart layouts crafted for you.
                        </p>
                        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={scrollToUpload}
                                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                            >
                                Start Building
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                className="group inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-blue-600"
                                onClick={scrollToUpload}
                            >
                                Upload Resume
                                <span className="block h-px w-0 bg-blue-600 transition-all group-hover:w-full"></span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-24 grid gap-8 md:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        {[{ icon: Layers, title: 'AI-Driven', description: 'Let Follio transform your content into a polished digital portfolio that reflects your brand.' }, { icon: Palette, title: 'Drag-and-Drop', description: 'Choose layouts, tweak sections, and launch faster with intuitive tools.' }, { icon: Globe, title: 'Customization', description: 'Match your colors, fonts, and voice to create a cohesive online presence.' }].map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/60 p-10 text-left shadow-lg shadow-blue-500/5 backdrop-blur-md transition-all hover:border-blue-200/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upload Section */}
                <section id="upload-section" className="py-24 md:py-32">
                    <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
                        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                                    Upload your resume to craft your <span className="text-blue-600">Follio presence</span>
                                </h2>
                                <p className="text-lg font-medium leading-relaxed text-slate-600">
                                    Drop in your latest resume and we will translate it into a polished, on-brand digital portfolio. Keep your story consistent across every touchpoint.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        Smart Import
                                    </h4>
                                    <p className="pl-4 text-sm leading-relaxed text-slate-600">Instantly structures your experience and education.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                                        Guided Polish
                                    </h4>
                                    <p className="pl-4 text-sm leading-relaxed text-slate-600">Fine-tune messaging to match your brand voice.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                        Secure Storage
                                    </h4>
                                    <p className="pl-4 text-sm leading-relaxed text-slate-600">Encrypted at rest to keep your data safe.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        Ready to Publish
                                    </h4>
                                    <p className="pl-4 text-sm leading-relaxed text-slate-600">Launch a responsive site in just a few clicks.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-2xl shadow-blue-500/15 backdrop-blur-md animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Upload resume</h2>
                                    <p className="text-sm font-medium text-slate-500">PDF or DOCX · up to 10MB</p>
                                </div>
                                <div className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                                    Auto-parse
                                </div>
                            </div>
                            {!uploadedFile ? (
                                <>
                                    <div
                                        className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${dragActive
                                            ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
                                            : 'border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/50'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100 transition-transform group-hover:scale-110">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">Drag and drop your resume</h3>
                                        <p className="mt-2 text-sm font-medium text-slate-500">or click to browse</p>
                                        <p className="mt-2 text-xs font-medium text-slate-400">PDF, DOCX up to 10MB</p>

                                        <label className="absolute inset-0 cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.docx,.doc"
                                                onChange={handleFileInput}
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={onDemoLoad}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                        >
                                            Try with demo data
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8 text-center py-8">
                                    <div className="inline-flex items-center gap-4 rounded-3xl border border-sky-200 bg-sky-50/50 px-6 py-4 text-left">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sky-800">File uploaded</p>
                                            <p className="text-xs font-medium text-sky-600">{uploadedFile?.name}</p>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="ml-4 rounded-full p-2 text-sky-600 transition hover:bg-sky-100 hover:text-sky-800"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={processUpload}
                                        disabled={uploading}
                                        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Processing...
                                            </span>
                                        ) : (
                                            'Parse Resume'
                                        )}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-center text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Why Follio Section */}
                <section className="py-24 md:py-32 border-t border-slate-200/60">
                    <div className="mx-auto max-w-4xl text-center mb-16">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Why Follio?</h2>
                        <p className="mt-6 text-lg font-medium leading-relaxed text-slate-600">
                            We believe your digital presence deserves the same polish as your skills. Follio removes the noise and delivers beautiful, AI-powered portfolios that convert attention into opportunity.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[{ icon: UploadCloud, title: 'Upload Content', description: 'Drop your resume, copy, or assets into Follio. Our parser structures everything instantly.' }, { icon: Wand2, title: 'AI Design', description: 'AI suggests layouts, sections, and messaging that highlights what makes you unique.' }, { icon: Globe, title: 'Instant Publish', description: 'Launch a responsive, shareable site with custom domains and analytics built in.' }].map((item) => (
                            <div key={item.title} className="group rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 text-left transition-all hover:border-blue-200/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.description}</p>
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
