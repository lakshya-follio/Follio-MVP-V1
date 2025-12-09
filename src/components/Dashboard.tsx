import React from 'react';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  Code,
  LogOut,
  CreditCard as Edit,
  ArrowRight
} from 'lucide-react';
import type { User as UserType, ParsedResumeData } from '../App';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

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
      if (!user || parsedData || !supabase || !isSupabaseConfigured) {
        setLoading(false);
        return;
      }

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

  const headerAction = (
    <div className="flex items-center gap-3">
      {user && (
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
          Signed in as
          <span className="font-semibold text-slate-900">{user.name || user.email}</span>
        </div>
      )}
      <button
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-blue-500/15">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <h2 className="text-xl font-semibold text-slate-900">Loading your profile...</h2>
            <p className="mt-2 text-sm text-slate-500">We are fetching your saved Follio details.</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-blue-500/15">
            <h2 className="text-2xl font-semibold text-slate-900">Your Follio is almost ready</h2>
            <p className="mt-3 text-sm text-slate-600">
              Upload your resume to unlock the personalized dashboard and publishing tools.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Begin upload
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-24">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 p-12 text-white shadow-2xl shadow-blue-500/30 ring-1 ring-white/20">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-white shadow-inner shadow-white/10 backdrop-blur-sm">
                <UserIcon className="h-12 w-12" />
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{profileData.profile.name}</h1>
                  <p className="mt-3 text-xl font-medium text-cyan-50">{profileData.profile.headline}</p>
                </div>
                <div className="grid gap-4 text-sm font-medium text-cyan-50/90 md:grid-cols-2">
                  {profileData.profile.location && (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4.5 w-4.5" />
                      <span>{profileData.profile.location}</span>
                    </div>
                  )}
                  {profileData.profile.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4.5 w-4.5" />
                      <span>{profileData.profile.email}</span>
                    </div>
                  )}
                  {profileData.profile.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4.5 w-4.5" />
                      <span>{profileData.profile.phone}</span>
                    </div>
                  )}
                </div>
                <button className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 hover:-translate-y-0.5 active:scale-95">
                  <Edit className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Refine profile details
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-slate-200/60 bg-white/80 p-8 shadow-lg shadow-blue-500/10 backdrop-blur-md transition hover:border-blue-200/50 hover:shadow-blue-500/15">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Snapshot</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Follio progress overview</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <div className="group rounded-3xl border border-blue-100 bg-blue-50/50 p-5 text-blue-700 transition hover:bg-blue-50">
                  <div className="text-4xl font-bold tracking-tighter text-blue-800">{profileData.experience.length}</div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide opacity-80">Roles captured</p>
                </div>
                <div className="group rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 text-emerald-700 transition hover:bg-emerald-50">
                  <div className="text-4xl font-bold tracking-tighter text-emerald-800">{profileData.education.length}</div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide opacity-80">Education entries</p>
                </div>
                <div className="group rounded-3xl border border-indigo-100 bg-indigo-50/50 p-5 text-indigo-700 transition hover:bg-indigo-50">
                  <div className="text-4xl font-bold tracking-tighter text-indigo-800">{profileData.skills.length}</div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide opacity-80">Skills highlighted</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/60 bg-white/80 p-8 shadow-lg shadow-blue-500/10 backdrop-blur-md transition hover:border-blue-200/50 hover:shadow-blue-500/15">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">Next steps to launch</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">Complete these finishing touches to publish your Follio with confidence.</p>
              <div className="mt-6 space-y-4 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition hover:bg-slate-50">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  Add project imagery and testimonials for visual impact.
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition hover:bg-slate-50">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  Customize your call-to-action links and contact preferences.
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition hover:bg-slate-50">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                  Connect your custom domain before sharing broadly.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-xl shadow-cyan-500/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Work experience</h3>
              <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                {profileData.experience.length} roles
              </span>
            </div>
            <div className="mt-8 space-y-6">
              {profileData.experience.map((exp) => (
                <div key={exp.id} className="group rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 transition hover:border-blue-200/60 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{exp.company}</p>
                      <h4 className="mt-1 text-lg font-bold text-slate-900">{exp.role}</h4>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString()} –{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-slate-600">
                      {exp.highlights.map((highlight, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-xl shadow-blue-500/10 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">Education</h3>
                <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                  {profileData.education.length} schools
                </span>
              </div>
              <div className="mt-8 space-y-5">
                {profileData.education.map((edu) => (
                  <div key={edu.id} className="group rounded-3xl border border-emerald-100/60 bg-emerald-50/30 p-6 transition hover:border-emerald-200 hover:bg-emerald-50/60">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{edu.school}</p>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">{edu.degree}</h4>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString()} –{' '}
                      {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-xl shadow-blue-500/10 backdrop-blur-md">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Skills & tools</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">Key strengths we highlight prominently on your Follio.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2.5 rounded-full border border-indigo-200 bg-indigo-50/50 px-5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100/80 hover:text-indigo-800"
                  >
                    <Code className="h-4 w-4" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default Dashboard;