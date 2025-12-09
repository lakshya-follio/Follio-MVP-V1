import React, { useState } from 'react';
import {
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  UploadCloud,
  Wand2,
  Globe
} from 'lucide-react';
import type { User } from '../App';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Please contact the administrator.');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
      } else if (result.data.user) {
        onLogin({
          id: result.data.user.id,
          email: result.data.user.email || '',
          name: result.data.user.email?.split('@')[0]
        });
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'linkedin_oidc') => {
    setLoading(true);
    setError('');

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Please contact the administrator.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError('Social login failed');
    } finally {
      setLoading(false);
    }
  };

  const scrollToAuth = () => {
    const section = document.getElementById('auth-section');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headerAction = (
    <button
      onClick={scrollToAuth}
      className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-slate-900"
    >
      Access your account
      <ArrowRight className="h-4 w-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900">
      <BrandHeader subdued action={headerAction} />

      <main className="max-w-7xl mx-auto px-6">
        <section className="py-20 md:py-32 text-center">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/50 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm ring-1 ring-slate-100">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Build polished portfolios in minutes
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-7xl">
              Create Stunning Digital <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Portfolios Effortlessly</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-slate-600 md:text-2xl md:leading-relaxed max-w-2xl mx-auto">
              Follio helps individuals and businesses launch beautiful, customizable portfolios in minutes. No coding, just smart layouts crafted for you.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <button
                onClick={scrollToAuth}
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
              >
                Build your portfolio
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                onClick={scrollToAuth}
              >
                Explore the platform
              </button>
            </div>
          </div>

          <div className="mt-24 grid gap-8 md:grid-cols-3">
            {[{ icon: Layers, title: 'AI-Driven', description: 'Let Follio transform your content into a polished digital portfolio that reflects your brand.' }, { icon: Palette, title: 'Drag-and-Drop Simplicity', description: 'Choose layouts, tweak sections, and launch faster with intuitive tools.' }, { icon: Globe, title: 'Branded Customization', description: 'Match your colors, fonts, and voice to create a cohesive online presence.' }].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 text-left shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all hover:border-blue-200/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 text-blue-600 shadow-inner shadow-blue-100/50 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-12 shadow-xl shadow-slate-200/40 backdrop-blur-md">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">Why Follio?</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              We believe your digital presence deserves the same polish as your skills. Follio removes the noise and delivers beautiful, AI-powered portfolios that convert attention into opportunity.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[{ icon: UploadCloud, title: 'Upload Your Content', description: 'Drop your resume, copy, or assets into Follio. Our parser structures everything instantly.' }, { icon: Wand2, title: 'Let Follio Handle Design', description: 'AI suggests layouts, sections, and messaging that highlights what makes you unique.' }, { icon: Globe, title: 'Publish in Minutes', description: 'Launch a responsive, shareable site with custom domains and analytics built in.' }].map((item) => (
              <div key={item.title} className="group rounded-3xl bg-gradient-to-br from-slate-50 to-white p-8 text-left border border-slate-100 transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="auth-section" className="py-32">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 p-12 text-white shadow-2xl shadow-blue-500/30 ring-1 ring-white/20">
              <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">Ready to build your digital presence?</h2>
              <p className="mt-6 text-lg leading-relaxed text-blue-50">
                Get started with Follio and launch your professional portfolio in minutes. Sign in to continue designing, or create an account to unlock AI-crafted experiences tailored to you.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {[{ title: 'Smart personalization', description: 'Follio adapts layouts based on your industry and goals.' }, { title: 'Collaborative workflow', description: 'Invite clients or teammates to review and approve updates fast.' }, { title: 'Built-in analytics', description: 'Track engagement and understand how your portfolio performs.' }, { title: 'Seamless publishing', description: 'Connect your domain and go live with confidence.' }].map((benefit) => (
                  <div key={benefit.title} className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10 transition hover:bg-white/15">
                    <h3 className="text-lg font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-blue-50">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-2xl shadow-slate-200/50 backdrop-blur-md">
              <div className="mb-10">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  {isLogin ? 'Welcome back to Follio' : 'Join Follio today'}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  {isLogin
                    ? 'Sign in to keep building and refining your standout digital portfolio.'
                    : 'Create an account to craft a professional presence with AI-assisted storytelling.'}
                </p>
              </div>

              {error && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => handleSocialAuth('google')}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-[15px] font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialAuth('linkedin_oidc')}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0077B5] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#005f8d] hover:shadow-lg hover:shadow-[#0077B5]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              <div className="my-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                  <div className="relative group">
                    <Mail className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400 transition group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      {isLogin ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline decoration-2 underline-offset-4"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
};

export default LoginPage;