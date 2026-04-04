'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBuilderStore } from '@/store/builder';
import { Button } from '@/components/ui/FormElements';
import {
  FileText, Plus, Pencil, Trash2, Clock, Download, Mail,
  LogOut, BookOpen, Copy, ChevronRight, User,
} from 'lucide-react';

interface SavedResume {
  id: string;
  title: string;
  selected_template: string;
  status: string;
  updated_at: string;
  language: string;
  resume_personal_info: { full_name: string; job_title: string; email: string }[] | null;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      setUserEmail(user.email || '');
      const { data } = await supabase
        .from('resumes')
        .select('id, title, selected_template, status, updated_at, language, resume_personal_info(full_name, job_title, email)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setResumes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setSigningOut(false);
    }
  };

  const handleNewCv = () => {
    resetBuilder();
    router.push('/builder');
  };

  const handleEditCv = (id: string) => {
    router.push(`/builder?id=${id}`);
  };

  const handleDuplicateCv = async (resume: SavedResume) => {
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const pi = resume.resume_personal_info?.[0];
      const { data } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          language: resume.language,
          title: `${resume.title} (Copy)`,
          selected_template: resume.selected_template,
          status: 'draft',
        })
        .select()
        .single();

      if (data) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCv = async (id: string) => {
    if (!confirm('Are you sure you want to delete this CV? This cannot be undone.')) return;
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      await supabase.from('resumes').delete().eq('id', id);
      setResumes((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Nav */}
      <nav className="bg-white border-b border-surface-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Cvistan</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/learn" className="text-sm text-surface-500 hover:text-brand-600 transition-colors hidden sm:block">
              Learn about CVs
            </a>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome section */}
        <div className="bg-white rounded-2xl border border-surface-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-800">
                Welcome back!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-surface-400" />
                <p className="text-sm text-surface-500">{userEmail}</p>
              </div>
            </div>
            <Button onClick={handleNewCv} size="lg">
              <Plus className="w-4 h-4" />
              Create New CV
            </Button>
          </div>
        </div>

        {/* Quick tip */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand-800 font-medium">Pro tip: Create multiple CVs for different jobs</p>
            <p className="text-xs text-brand-600 mt-0.5">Tailor your CV for each application. Highlight the skills and experience most relevant to each position.</p>
          </div>
        </div>

        {/* Resumes list */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-surface-800">
            My CVs {resumes.length > 0 && <span className="text-surface-400 font-normal text-sm">({resumes.length})</span>}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16 text-surface-400">
            <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
            Loading your CVs...
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
            <FileText className="w-14 h-14 text-surface-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-700 mb-2">No CVs yet</h3>
            <p className="text-sm text-surface-400 mb-6 max-w-xs mx-auto">
              Create your first CV and start applying for jobs with confidence.
            </p>
            <Button onClick={handleNewCv} size="lg">
              <Plus className="w-4 h-4" />
              Create Your First CV
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => {
              const pi = r.resume_personal_info?.[0];
              return (
                <div key={r.id} className="bg-white rounded-xl border border-surface-100 hover:border-surface-200 hover:shadow-md transition-all group">
                  {/* Card header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-800 truncate">
                          {pi?.full_name || r.title}
                        </h3>
                        {pi?.job_title && (
                          <p className="text-sm text-surface-500 truncate">{pi.job_title}</p>
                        )}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${
                        r.status === 'finalized'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status === 'finalized' ? 'Complete' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(r.updated_at)}
                      </span>
                      <span className="uppercase">{r.language}</span>
                      <span className="truncate">{r.selected_template}</span>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="border-t border-surface-100 px-5 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleEditCv(r.id)}
                      className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <div className="w-px h-4 bg-surface-200"></div>
                    <button
                      onClick={() => handleDuplicateCv(r)}
                      className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
                      title="Duplicate this CV"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Duplicate
                    </button>
                    <div className="flex-1"></div>
                    <button
                      onClick={() => handleDeleteCv(r.id)}
                      className="flex items-center gap-1 text-sm text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete this CV"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add new card */}
            <button
              onClick={handleNewCv}
              className="bg-white rounded-xl border-2 border-dashed border-surface-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all p-5 flex flex-col items-center justify-center min-h-[160px] group"
            >
              <div className="w-12 h-12 bg-surface-100 group-hover:bg-brand-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-surface-400 group-hover:text-brand-600 transition-colors" />
              </div>
              <p className="text-sm font-medium text-surface-500 group-hover:text-brand-600 transition-colors">
                Create New CV
              </p>
              <p className="text-xs text-surface-400 mt-1">
                Tailored for a different job
              </p>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
