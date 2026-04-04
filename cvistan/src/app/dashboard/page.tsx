'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/FormElements';

interface SavedResume {
  id: string;
  title: string;
  selected_template: string;
  status: string;
  updated_at: string;
  resume_personal_info: { full_name: string; job_title: string }[] | null;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/signin';
        return;
      }
      const { data } = await supabase
        .from('resumes')
        .select('id, title, selected_template, status, updated_at, resume_personal_info(full_name, job_title)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setResumes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      await supabase.from('resumes').delete().eq('id', id);
      setResumes((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <nav className="bg-white border-b border-surface-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Cvistan</span>
          </a>
<div className="flex items-center gap-4">
            <a href="/learn" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">Learn about CVs</a>
            <a href="/account" className="text-sm text-surface-500 hover:text-surface-700">Account</a>
          </div>        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-surface-800">My Resumes</h1>
          <Button onClick={() => window.location.href = '/builder'}>
            <Plus className="w-4 h-4" />
            New Resume
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-surface-400">Loading...</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-100">
            <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500 mb-4">No resumes yet. Start building one!</p>
            <Button onClick={() => window.location.href = '/builder'}>
              <Plus className="w-4 h-4" />
              Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => {
              const pi = r.resume_personal_info?.[0];
              return (
                <div key={r.id} className="bg-white rounded-xl border border-surface-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-surface-800">{pi?.full_name || r.title}</h3>
                      {pi?.job_title && <p className="text-sm text-surface-500">{pi.job_title}</p>}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-surface-400 mb-4">
                    <Clock className="w-3 h-3" />
                    {new Date(r.updated_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.location.href = `/builder?id=${r.id}`}>
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteResume(r.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
