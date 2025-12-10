import { useState, useEffect } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ParsedInfoPage from './components/ParsedInfoPage';
import Dashboard from './components/Dashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toaster } from './components/ui/Toaster';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import { parseResumeFile, getDummyResumeData } from './utils/resumeParser';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ParsedResumeData {
  profile: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'parsed' | 'dashboard'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setConfigError('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    const client = supabase;

    const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): User => ({
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || ''
    });

    const fetchResumeData = async (supabaseUser: SupabaseUser): Promise<ParsedResumeData | null> => {
      const { data, error: profileError } = await client
        .from('profiles')
        .select('resume_data')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          return null;
        }

        throw profileError;
      }

      return (data?.resume_data as ParsedResumeData | null) ?? null;
    };

    const populateSessionState = async (session: Session) => {
      const supabaseUser = session.user;
      const appUser = mapSupabaseUserToAppUser(supabaseUser);

      if (!isMounted) {
        return;
      }

      setUser(appUser);

      const resumeData = await fetchResumeData(supabaseUser);

      if (!isMounted) {
        return;
      }

      if (resumeData) {
        setParsedData(resumeData);
        setCurrentPage('dashboard');
      }
      // Note: We don't force 'upload' here if no data, to respect the initial state or pending actions
    };

    const bootstrapSession = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) {
          throw error;
        }

        if (!isMounted) return;

        if (session?.user) {
          await populateSessionState(session);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setConfigError('We could not reach Supabase. Please verify your Supabase configuration.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const { data: authSubscription } = client.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setParsedData(null);
        setCurrentPage('home');
        return;
      }

      if (!session?.user) {
        setUser(null);
        // Do not clear parsedData or reset page here - let guest mode persist
        return;
      }

      const appUser = mapSupabaseUserToAppUser(session.user);
      setUser(appUser);

      if (event === 'SIGNED_IN') {
        try {
          const resumeData = await fetchResumeData(session.user);

          if (!isMounted) {
            return;
          }

          // Case 1: Pending File (User tried to upload via drag-drop on Login page or was redirected)
          if (pendingFile) {
            try {
              const parsed = await parseResumeFile(pendingFile);
              setUploadedFile(pendingFile);
              setParsedData(parsed);
              setPendingFile(null);
              setCurrentPage('parsed');
              return; // Exit early since we're going to parsed page
            } catch (parseError) {
              console.error('Resume parsing failed:', parseError);
              setPendingFile(null);
            }
          }

          // Case 2: Guest Data Exists (User acted as guest, then logged in)
          // We assume if parsedData is not null, it's fresh from the current session/demo
          // We prioritize this over DB data so they can save/merge it.
          // BUT we only stay on 'parsed' if that's where they were coming from, or redirect there.
          if (parsedData) {
            // User has guest data. We should probably let them Review & Save it.
            // The user specifically asked for "the parsing page".
            setCurrentPage('parsed');
            return;
          }

          // Case 3: Load from DB or Default
          if (resumeData) {
            setParsedData(resumeData);
            setCurrentPage('dashboard');
          } else {
            // No existing resume data and no pending file - stay on upload/home page
            setCurrentPage('home');
          }
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
          if (isMounted) {
            setConfigError('We could not reach Supabase. Please verify your Supabase configuration.');
          }
        }
      }
    });

    bootstrapSession();

    return () => {
      isMounted = false;
      authSubscription?.subscription.unsubscribe();
    };
  }, [pendingFile, parsedData]); // Added parsedData dependency to ensure effect sees latest state

  const handleLogin = (userData: User) => {
    // The auth listener will handle setting the user and fetching data
  };

  const handleDemoLoad = () => {
    const dummyData = getDummyResumeData();
    setParsedData(dummyData);
    // Create a dummy file object for display purposes
    const dummyFile = new File([''], 'demo-resume.pdf', { type: 'application/pdf' });
    setUploadedFile(dummyFile);
    setCurrentPage('parsed');
  };

  const handleUpload = async (file: File) => {
    // Guest Mode: Allow upload/parsing without login
    try {
      const parsed = await parseResumeFile(file);
      setUploadedFile(file);
      setParsedData(parsed);
      setCurrentPage('parsed');
    } catch (error) {
      console.error('Resume parsing failed:', error);
      const message = error instanceof Error && error.message
        ? error.message
        : 'We could not parse that resume. Please try another file.';
      throw new Error(message);
    }
  };

  const handleLoginRequest = () => {
    // Helper to send guest to login page
    setCurrentPage('login');
  };

  const handleSave = async (data: ParsedResumeData) => {
    // If guest tries to save, send them to login
    // We update parsedData state first so it persists through the transition
    if (!user) {
      setParsedData(data);
      setCurrentPage('login');
      return;
    }

    if (!supabase) {
      setConfigError('Supabase is not available. Please check your configuration.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: data.profile.name,
          resume_data: data
        });

      if (error) {
        throw error;
      }

      setParsedData(data);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Save error:', error);
      setConfigError('Unable to save your profile to Supabase. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      setUploadedFile(null);
      setParsedData(null);
      setCurrentPage('login');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setUploadedFile(null);
    setParsedData(null);
    setCurrentPage('home');
  };

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100 p-6 text-center">
        <div className="max-w-xl rounded-3xl border border-red-200/60 bg-white/90 p-10 shadow-xl shadow-red-200/30 backdrop-blur">
          <h1 className="text-2xl font-semibold text-red-600">Configuration required</h1>
          <p className="mt-4 text-sm text-slate-600">{configError}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-slate-400">Deploy guidance</p>
          <p className="mt-2 text-sm text-slate-500">
            Update the deployment environment with your Supabase credentials and redeploy to restore full functionality.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 text-slate-900 font-sans selection:bg-blue-100">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'home' && (
        <HomePage
          onUpload={handleUpload}
          onDemoLoad={handleDemoLoad}
          user={user}
          onLoginClick={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'parsed' && (
        <ParsedInfoPage
          uploadedFile={uploadedFile}
          initialData={parsedData}
          onSave={handleSave}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          parsedData={parsedData}
          onLogout={handleLogout}
          onLoginRequest={handleLoginRequest}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;