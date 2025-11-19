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
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to upload
      </button>
      <button
        onClick={handleSave}
        disabled={loading || !parsedData}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        Save profile
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF]">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-cyan-500/10">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <h2 className="text-xl font-semibold text-slate-900">Parsing your resume...</h2>
            <p className="mt-2 text-sm text-slate-500">We are preparing your Follio content blueprint.</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF]">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-cyan-500/10">
            <h2 className="text-2xl font-semibold text-slate-900">We could not parse that file</h2>
            <p className="mt-3 text-sm text-slate-600">Please verify the format and try uploading again.</p>
            <button
              onClick={onBack}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF] text-slate-900">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-cyan-50/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                <Sparkles className="h-3.5 w-3.5" />
                Step 2 of 3 · Review & edit
              </span>
              <h1 className="mt-4 text-2xl font-semibold text-slate-900">Craft your narrative</h1>
              <p className="mt-2 text-sm text-slate-600">
                Fine-tune the copy pulled from your resume so your final Follio mirrors the voice, achievements, and details you want clients to see.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100/80 text-cyan-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{uploadedFile?.name}</p>
                      <p className="text-xs text-slate-500">
                        {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Upload a resume to continue'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="hidden items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-700 transition hover:bg-cyan-100 lg:inline-flex"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save progress
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">Resume preview</h2>
              <p className="mt-2 text-sm text-slate-600">A live preview of your uploaded resume will appear here.</p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-10 text-center">
                <div className="mx-auto mb-4 h-20 w-16 rounded-lg bg-slate-200" />
                <p className="text-sm text-slate-500">Preview not available in this demo environment.</p>
                <p className="mt-2 text-xs text-slate-400">{uploadedFile?.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
              <button
                onClick={() => toggleSection('profile')}
                className="flex w-full items-center justify-between rounded-3xl p-6 text-left transition hover:bg-slate-50/80"
              >
                <h2 className="text-lg font-semibold text-slate-900">Profile information</h2>
                {expandedSections.profile ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSections.profile && (
                <div className="space-y-4 px-6 pb-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
                      <input
                        type="text"
                        value={parsedData.profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
                      <input
                        type="text"
                        value={parsedData.profile.location}
                        onChange={(e) => updateProfile('location', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Professional headline</label>
                    <input
                      type="text"
                      value={parsedData.profile.headline}
                      onChange={(e) => updateProfile('headline', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                      <input
                        type="email"
                        value={parsedData.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</label>
                      <input
                        type="tel"
                        value={parsedData.profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
              <button
                onClick={() => toggleSection('experience')}
                className="flex w-full items-center justify-between rounded-3xl p-6 text-left transition hover:bg-slate-50/80"
              >
                <h2 className="text-lg font-semibold text-slate-900">Work experience ({parsedData.experience.length})</h2>
                {expandedSections.experience ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSections.experience && (
                <div className="space-y-5 px-6 pb-6">
                  {parsedData.experience.map((exp, index) => (
                    <div key={exp.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm flex items-center gap-2 font-semibold uppercase tracking-wide text-cyan-700">
                          Experience #{index + 1}
                        </h3>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="rounded-full p-1 text-red-500 transition hover:bg-red-100/60"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End date</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add experience
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
              <button
                onClick={() => toggleSection('education')}
                className="flex w-full items-center justify-between rounded-3xl p-6 text-left transition hover:bg-slate-50/80"
              >
                <h2 className="text-lg font-semibold text-slate-900">Education ({parsedData.education.length})</h2>
                {expandedSections.education ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSections.education && (
                <div className="space-y-5 px-6 pb-6">
                  {parsedData.education.map((edu, index) => (
                    <div key={edu.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Education #{index + 1}</h3>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="rounded-full p-1 text-red-500 transition hover:bg-red-100/60"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">School</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End date</label>
                          <input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add education
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
              <button
                onClick={() => toggleSection('skills')}
                className="flex w-full items-center justify-between rounded-3xl p-6 text-left transition hover:bg-slate-50/80"
              >
                <h2 className="text-lg font-semibold text-slate-900">Skills ({parsedData.skills.length})</h2>
                {expandedSections.skills ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSections.skills && (
                <div className="space-y-4 px-6 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-700"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="rounded-full p-0.5 transition hover:bg-indigo-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
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
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      onClick={handleAddSkillFromInput}
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
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
    </div>
  );
};

export default ParsedInfoPage;
