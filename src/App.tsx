import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import ParsedInfoPage from './components/ParsedInfoPage';
import Dashboard from './components/Dashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toaster } from './components/ui/Toaster';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const [currentPage, setCurrentPage] = useState<'login' | 'upload' | 'parsed' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          });
          // Check if user has completed onboarding
          const { data } = await supabase
            .from('profiles')
            .select('resume_data')
            .eq('id', session.user.id)
            .single();
          
          if (data?.resume_data) {
            setParsedData(data.resume_data);
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('upload');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('upload');
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    // Simulate parsing delay
    setTimeout(() => {
      setCurrentPage('parsed');
    }, 1500);
  };

  const handleSave = async (data: ParsedResumeData) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: data.profile.name,
          resume_data: data
        });
      
      setParsedData(data);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUploadedFile(null);
    setParsedData(null);
    setCurrentPage('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'upload' && <UploadPage onUpload={handleUpload} user={user} />}
      {currentPage === 'parsed' && (
        <ParsedInfoPage 
          uploadedFile={uploadedFile}
          onSave={handleSave}
          onBack={() => setCurrentPage('upload')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={user}
          parsedData={parsedData}
          onLogout={handleLogout}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;