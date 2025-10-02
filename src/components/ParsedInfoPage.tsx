import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { mockParseResume } from '../utils/resumeParser';
import type { ParsedResumeData } from '../App';

interface ParsedInfoPageProps {
  uploadedFile: File | null;
  onSave: (data: ParsedResumeData) => void;
  onBack: () => void;
}

const ParsedInfoPage: React.FC<ParsedInfoPageProps> = ({ 
  uploadedFile, 
  onSave, 
  onBack 
}) => {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    experience: true,
    education: true,
    skills: true
  });

  useEffect(() => {
    if (uploadedFile) {
      // Simulate parsing delay
      setTimeout(() => {
        const mockData = mockParseResume(uploadedFile);
        setParsedData(mockData);
        setLoading(false);
      }, 2000);
    }
  }, [uploadedFile]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
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
      highlights: []
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
      experience: parsedData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.filter(exp => exp.id !== id)
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
      education: parsedData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.filter(edu => edu.id !== id)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Parsing your resume...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to parse resume</h2>
          <p className="text-gray-600 mb-4">Please try uploading a different file</p>
          <button onClick={onBack} className="text-cyan-600 hover:text-cyan-700">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Review & Edit</h1>
              <p className="text-sm text-gray-600">
                {uploadedFile?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-200"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* PDF Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h2>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
              <p className="text-gray-600">
                PDF preview would appear here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {uploadedFile?.name}
              </p>
            </div>
          </div>

          {/* Parsed Data Form */}
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <button
                onClick={() => toggleSection('profile')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                {expandedSections.profile ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.profile && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={parsedData.profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={parsedData.profile.location}
                        onChange={(e) => updateProfile('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={parsedData.profile.headline}
                      onChange={(e) => updateProfile('headline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={parsedData.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={parsedData.profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <button
                onClick={() => toggleSection('experience')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Work Experience ({parsedData.experience.length})
                </h2>
                {expandedSections.experience ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.experience && (
                <div className="p-6 pt-0">
                  <div className="space-y-6">
                    {parsedData.experience.map((exp, index) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">
                            Experience #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addExperience}
                    className="mt-4 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <button
                onClick={() => toggleSection('education')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Education ({parsedData.education.length})
                </h2>
                {expandedSections.education ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.education && (
                <div className="p-6 pt-0">
                  <div className="space-y-6">
                    {parsedData.education.map((edu, index) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">
                            Education #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              School
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addEducation}
                    className="mt-4 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Skills ({parsedData.skills.length})
                </h2>
                {expandedSections.skills ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.skills && (
                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="hover:bg-cyan-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a skill..."]') as HTMLInputElement;
                        if (input.value.trim()) {
                          addSkill(input.value);
                          input.value = '';
                        }
                      }}
                      className="flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-2 rounded-lg hover:bg-cyan-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParsedInfoPage;