import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText
} from 'lucide-react';
import { parseResumeFile } from '../utils/resumeParser';
import type { ParsedResumeData } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface ParsedInfoPageProps {
  uploadedFile: File | null;
  initialData: ParsedResumeData | null;
  onSave: (data: ParsedResumeData) => void;
  onBack: () => void;
}

const ParsedInfoPage: React.FC<ParsedInfoPageProps> = ({ uploadedFile, initialData, onSave, onBack }) => {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    experience: true,
    education: true,
    skills: true
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setParsedData(initialData);
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      return;
    }

    if (!uploadedFile) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const parseFile = async () => {
      setLoading(true);
      try {
        const parsed = await parseResumeFile(uploadedFile);
        if (isMounted) {
          setParsedData(parsed);
        }
      } catch (error) {
        console.error('Resume parsing failed:', error);
        if (isMounted) {
          setParsedData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    parseFile();

    return () => {
      isMounted = false;
    };
  }, [uploadedFile, initialData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateProfile = (field: string, value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      profile: {
        ...parsedData.profile,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    if (!parsedData) return;
    const newExp = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      highlights: [] as string[]
    };
    setParsedData({
      ...parsedData,
      experience: [...parsedData.experience, newExp]
    });
  };

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.filter((exp) => exp.id !== id)
    });
  };

  const addEducation = () => {
    if (!parsedData) return;
    const newEdu = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    };
    setParsedData({
      ...parsedData,
      education: [...parsedData.education, newEdu]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.filter((edu) => edu.id !== id)
    });
  };

  const addSkill = (skill: string) => {
    if (!parsedData || !skill.trim()) return;
    setParsedData({
      ...parsedData,
      skills: [...parsedData.skills, skill.trim()]
    });
  };

  const removeSkill = (index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    if (parsedData) {
      onSave(parsedData);
    }
  };

  const handleAddSkillFromInput = () => {
    if (!skillInput.trim()) return;
    addSkill(skillInput);
    setSkillInput('');
  };

  const headerAction = (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-primary/10  bg-white px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-secondary hover:border-primary/20"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to upload
      </button>
      <button
        onClick={handleSave}
        disabled={loading || !parsedData}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:scale-[1.02] disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        Save profile
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-secondary">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16 animate-fade-in">
          <div className="rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-primary/5">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <h2 className="text-xl font-serif font-medium text-primary">Parsing your resume...</h2>
            <p className="mt-2 text-sm text-primary/60">We are preparing your Follio content blueprint.</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex min-h-screen flex-col bg-secondary">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16 animate-fade-in">
          <div className="max-w-md rounded-3xl bg-surface p-10 text-center shadow-sm ring-1 ring-primary/5">
            <h2 className="text-2xl font-serif font-medium text-primary">We could not parse that file</h2>
            <p className="mt-3 text-sm text-primary/60">Please verify the format and try uploading again.</p>
            <button
              onClick={onBack}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              Try another file
            </button>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary text-primary font-sans selection:bg-accent/30">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-24">
        <section className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="rounded-3xl bg-surface p-10 shadow-sm ring-1 ring-primary/5">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/70">
                <Sparkles className="h-3.5 w-3.5" />
                Step 2 of 3 · Review & edit
              </span>
              <h1 className="mt-6 text-4xl font-serif font-medium tracking-tight text-primary">Craft your narrative</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-primary/70">
                Fine-tune the copy pulled from your resume so your final Follio mirrors the voice, achievements, and details you want clients to see.
              </p>
              <div className="mt-8 rounded-2xl border border-primary/5 bg-secondary p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{uploadedFile?.name}</p>
                      <p className="text-xs font-medium text-primary/50">
                        {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Upload a resume to continue'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="hidden items-center gap-2 rounded-xl border border-primary/10 bg-white px-4 py-2 text-xs font-medium text-primary transition-all hover:bg-secondary lg:inline-flex"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save progress
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-surface p-10 shadow-sm ring-1 ring-primary/5">
              <h2 className="text-xl font-serif font-medium text-primary">Resume preview</h2>
              <p className="mt-2 text-sm font-medium text-primary/60">A live preview of your uploaded resume will appear here.</p>
              <div className="mt-6 rounded-2xl border border-primary/5 bg-secondary p-12 text-center">
                <div className="mx-auto mb-4 h-24 w-20 rounded-xl bg-primary/10 shadow-inner" />
                <p className="text-sm font-medium text-primary/50">Preview not available in this demo environment.</p>
                <p className="mt-2 text-xs font-medium text-primary/40">{uploadedFile?.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-3xl bg-surface shadow-sm ring-1 ring-primary/5 transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('profile')}
                className="flex w-full items-center justify-between rounded-3xl p-8 text-left transition hover:bg-secondary/30"
              >
                <h2 className="text-xl font-serif font-medium text-primary">Profile information</h2>
                {expandedSections.profile ? (
                  <ChevronUp className="h-6 w-6 text-primary/40" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary/40" />
                )}
              </button>

              {expandedSections.profile && (
                <div className="space-y-6 px-8 pb-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Full name</label>
                      <input
                        type="text"
                        value={parsedData.profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-secondary/50 px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Location</label>
                      <input
                        type="text"
                        value={parsedData.profile.location}
                        onChange={(e) => updateProfile('location', e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-secondary/50 px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Professional headline</label>
                    <input
                      type="text"
                      value={parsedData.profile.headline}
                      onChange={(e) => updateProfile('headline', e.target.value)}
                      className="w-full rounded-xl border border-primary/10 bg-secondary/50 px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-0"
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Email</label>
                      <input
                        type="email"
                        value={parsedData.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-secondary/50 px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Phone</label>
                      <input
                        type="tel"
                        value={parsedData.profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-secondary/50 px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-surface shadow-sm ring-1 ring-primary/5 transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('experience')}
                className="flex w-full items-center justify-between rounded-3xl p-8 text-left transition hover:bg-secondary/30"
              >
                <h2 className="text-xl font-serif font-medium text-primary">Work experience ({parsedData.experience.length})</h2>
                {expandedSections.experience ? (
                  <ChevronUp className="h-6 w-6 text-primary/40" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary/40" />
                )}
              </button>

              {expandedSections.experience && (
                <div className="space-y-6 px-8 pb-8">
                  {parsedData.experience.map((exp, index) => (
                    <div key={exp.id} className="rounded-2xl border border-primary/5 bg-secondary p-6 transition-all hover:bg-white hover:shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-xs font-medium uppercase tracking-wide text-primary/50 bg-accent/20 px-3 py-1 rounded-full">
                          Experience #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="rounded-full p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:ring-0"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-primary/60">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 text-sm font-medium text-primary outline-none transition-all focus:border-primary/30 focus:ring-0"
                          />
                        </div>
                      </div>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Start date</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">End date</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-primary/10 bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-secondary hover:shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add experience
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-surface shadow-sm ring-1 ring-primary/5 transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('education')}
                className="flex w-full items-center justify-between rounded-3xl p-8 text-left transition hover:bg-secondary/30"
              >
                <h2 className="text-xl font-serif font-medium text-primary">Education ({parsedData.education.length})</h2>
                {expandedSections.education ? (
                  <ChevronUp className="h-6 w-6 text-primary/40" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary/40" />
                )}
              </button>

              {expandedSections.education && (
                <div className="space-y-6 px-8 pb-8">
                  {parsedData.education.map((edu, index) => (
                    <div key={edu.id} className="rounded-2xl border border-primary/5 bg-secondary p-6 transition-all hover:bg-white hover:shadow-sm">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-xs font-medium uppercase tracking-wide text-primary/50 bg-accent/20 px-3 py-1 rounded-full">Education #{index + 1}</h3>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="rounded-full p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">School</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Start date</label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">End date</label>
                          <input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-primary/10 bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-secondary hover:shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add education
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-surface shadow-sm ring-1 ring-primary/5 transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('skills')}
                className="flex w-full items-center justify-between rounded-3xl p-8 text-left transition hover:bg-secondary/30"
              >
                <h2 className="text-xl font-serif font-medium text-primary">Skills ({parsedData.skills.length})</h2>
                {expandedSections.skills ? (
                  <ChevronUp className="h-6 w-6 text-primary/40" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary/40" />
                )}
              </button>

              {expandedSections.skills && (
                <div className="space-y-6 px-8 pb-8">
                  <div className="flex flex-wrap gap-3">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-accent/20 px-5 py-2 text-sm font-medium text-primary transition-all hover:bg-accent/30"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="rounded-full p-0.5 transition hover:bg-indigo-200 hover:text-indigo-900"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillFromInput();
                        }
                      }}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      onClick={handleAddSkillFromInput}
                      className="inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 hover:shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add skill
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div >
  );
};

export default ParsedInfoPage;
