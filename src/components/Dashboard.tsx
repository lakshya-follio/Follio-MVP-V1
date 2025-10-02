import { supabase } from '../App';
import React from 'react';
import { User, MapPin, Mail, Phone, Building, GraduationCap, Code, LogOut, CreditCard as Edit } from 'lucide-react';
import type { User as UserType, ParsedResumeData } from '../App';
import follioIcon from '../assets/follio-icon.svg';

interface DashboardProps {
  user: UserType | null;
  parsedData: ParsedResumeData | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, parsedData, onLogout }) => {
  const [profileData, setProfileData] = React.useState<ParsedResumeData | null>(parsedData);
  const [loading, setLoading] = React.useState(!parsedData);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || parsedData) return;
      
      try {
        const { data } = await supabase.from('profiles')
          .select('resume_data')
          .eq('id', user.id)
          .single();
        
        if (data?.resume_data) {
          setProfileData(data.resume_data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, parsedData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your profile...</h2>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No profile data found</h2>
          <p className="text-gray-600 mb-4">Please upload and parse your resume first.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-200"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src={follioIcon} alt="Follio" className="w-8 h-8" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  Follio Dashboard
                </h1>
              </div>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Summary Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profileData.profile.name}</h2>
              <p className="text-cyan-100 text-lg mb-4">{profileData.profile.headline}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {profileData.profile.location && (
                  <div className="flex items-center gap-2 text-cyan-100">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileData.profile.location}</span>
                  </div>
                )}
                {profileData.profile.email && (
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData.profile.email}</span>
                  </div>
                )}
                {profileData.profile.phone && (
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profileData.profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.experience.length}
                </div>
                <div className="text-gray-600">Work Experience</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.education.length}
                </div>
                <div className="text-gray-600">Education</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profileData.skills.length}
                </div>
                <div className="text-gray-600">Skills</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-600" />
              Work Experience
            </h3>
            <div className="space-y-4">
              {profileData.experience.map((exp, index) => (
                <div key={exp.id} className="border-l-4 border-cyan-200 pl-4 pb-4">
                  <h4 className="font-medium text-gray-900">{exp.role}</h4>
                  <p className="text-cyan-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - 
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Education
            </h3>
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={edu.id} className="border-l-4 border-green-200 pl-4 pb-4">
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-green-600 font-medium">{edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString()} - 
                    {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🚀 What's Next?
          </h3>
          <p className="text-gray-700 mb-4">
            Your profile is ready! Here are some suggested next steps to make the most of Folio:
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Add project uploads and portfolio items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Customize your portfolio theme and layout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Share your portfolio with recruiters and hiring managers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;