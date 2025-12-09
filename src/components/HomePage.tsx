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
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-slate-900"
        >
            Sign in
            <ArrowRight className="h-4 w-4" />
        </button>
    );

    return (
        <div className="min-h-screen bg-secondary text-primary font-sans selection:bg-accent/30">
            <BrandHeader subdued action={headerAction} />

            <main className="mx-auto w-full max-w-7xl px-6">
                {/* Hero Section */}
                <section className="py-24 md:py-32 text-center animate-fade-in">
                    <div className="mx-auto max-w-4xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/60 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <Sparkles className="w-3 h-3 text-accent" />
                            Build polished portfolios in minutes
                        </span>
                        <h1 className="mt-8 text-5xl font-serif font-medium leading-[1.1] tracking-tight text-primary md:text-7xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Create Stunning Digital Portfolios Effortlessly
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-primary/70 md:text-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            Follio helps individuals and businesses launch beautiful, customizable portfolios in minutes. No coding, just smart layouts crafted for you.
                        </p>
                        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={scrollToUpload}
                                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:scale-105"
                            >
                                Start Building
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/70"
                                onClick={scrollToUpload}
                            >
                                Upload Resume
                                <span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-24 grid gap-8 md:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        {[{ icon: Layers, title: 'AI-Driven', description: 'Let Follio transform your content into a polished digital portfolio that reflects your brand.' }, { icon: Palette, title: 'Drag-and-Drop', description: 'Choose layouts, tweak sections, and launch faster with intuitive tools.' }, { icon: Globe, title: 'Customization', description: 'Match your colors, fonts, and voice to create a cohesive online presence.' }].map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-3xl bg-surface p-10 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                                    <feature.icon className="w-6 h-6 stroke-1" />
                                </div>
                                <h3 className="text-xl font-serif font-medium text-primary">{feature.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-primary/60">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Upload Section */}
                <section id="upload-section" className="py-24 md:py-32">
                    <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
                        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="space-y-6">
                                <h2 className="text-4xl font-serif font-medium leading-tight text-primary md:text-5xl">
                                    Upload your resume to craft your Follio presence
                                </h2>
                                <p className="text-lg font-light leading-relaxed text-primary/70">
                                    Drop in your latest resume and we will translate it into a polished, on-brand digital portfolio. Keep your story consistent across every touchpoint.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="font-serif text-lg font-medium text-primary">Smart Import</h4>
                                    <p className="text-sm leading-relaxed text-primary/60">Instantly structures your experience and education.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-serif text-lg font-medium text-primary">Guided Polish</h4>
                                    <p className="text-sm leading-relaxed text-primary/60">Fine-tune messaging to match your brand voice.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-serif text-lg font-medium text-primary">Secure Storage</h4>
                                    <p className="text-sm leading-relaxed text-primary/60">Encrypted at rest to keep your data safe.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-serif text-lg font-medium text-primary">Ready to Publish</h4>
                                    <p className="text-sm leading-relaxed text-primary/60">Launch a responsive site in just a few clicks.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-primary/5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-serif font-medium text-primary">Upload resume</h2>
                                    <p className="text-sm text-primary/50">PDF or DOCX · up to 10MB</p>
                                </div>
                                <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary/60">
                                    Auto-parse
                                </div>
                            </div>
                            {!uploadedFile ? (
                                <div
                                    className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${dragActive
                                        ? 'border-primary bg-secondary'
                                        : 'border-primary/10 hover:border-primary/30 hover:bg-secondary/50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary transition-transform group-hover:scale-110">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-medium text-primary">Drag and drop your resume</h3>
                                    <p className="mt-2 text-sm text-primary/50">or click to browse</p>
                                    <p className="mt-2 text-xs text-primary/40">PDF, DOCX up to 10MB</p>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDemoLoad();
                                            }}
                                            className="text-xs font-medium text-primary/40 hover:text-primary transition-colors underline decoration-primary/20 hover:decoration-primary"
                                        >
                                            Try with demo data
                                        </button>
                                    </div>

                                    <label className="absolute inset-0 cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx,.doc"
                                            onChange={handleFileInput}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-8 text-center py-8">
                                    <div className="inline-flex items-center gap-4 rounded-2xl bg-secondary px-6 py-4 text-left">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-primary">File uploaded</p>
                                            <p className="text-xs text-primary/50">{uploadedFile?.name}</p>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="ml-4 rounded-full p-2 text-primary/40 transition hover:bg-white hover:text-primary"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={processUpload}
                                        disabled={uploading}
                                        className="w-full rounded-xl bg-primary py-4 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Processing...
                                            </span>
                                        ) : (
                                            'Parse Resume'
                                        )}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mt-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Why Follio Section */}
                <section className="py-24 md:py-32 border-t border-primary/5">
                    <div className="mx-auto max-w-4xl text-center mb-16">
                        <h2 className="text-4xl font-serif font-medium text-primary md:text-5xl">Why Follio?</h2>
                        <p className="mt-6 text-lg font-light leading-relaxed text-primary/70">
                            We believe your digital presence deserves the same polish as your skills. Follio removes the noise and delivers beautiful, AI-powered portfolios that convert attention into opportunity.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[{ icon: UploadCloud, title: 'Upload Content', description: 'Drop your resume, copy, or assets into Follio. Our parser structures everything instantly.' }, { icon: Wand2, title: 'AI Design', description: 'AI suggests layouts, sections, and messaging that highlights what makes you unique.' }, { icon: Globe, title: 'Instant Publish', description: 'Launch a responsive, shareable site with custom domains and analytics built in.' }].map((item) => (
                            <div key={item.title} className="group rounded-3xl bg-secondary p-8 text-left transition-all hover:bg-surface hover:shadow-sm">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 stroke-1" />
                                </div>
                                <h3 className="text-xl font-serif font-medium text-primary">{item.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-primary/60">{item.description}</p>
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
