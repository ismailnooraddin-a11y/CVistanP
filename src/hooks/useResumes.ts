import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { API_PATHS } from '@/lib/constants';
import { MAX_DRAFT_CVS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

interface SavedResume {
  id: string;
  title: string;
  selected_template: string;
  status: string;
  updated_at: string;
  language: string;
  resume_personal_info: { full_name: string; job_title: string; email: string }[] | null;
}

interface UseResumesReturn {
  resumes: SavedResume[];
  loading: boolean;
  error: string | null;
  draftCount: number;
  canCreateNew: boolean;
  reachedDraftLimit: boolean;
  fetchResumes: () => Promise<void>;
  createResume: (data: CreateResumeData) => Promise<string | null>;
  updateResume: (id: string, data: UpdateResumeData) => Promise<boolean>;
  deleteResume: (id: string) => Promise<boolean>;
  duplicateResume: (id: string) => Promise<string | null>;
}

interface CreateResumeData {
  language: 'en' | 'ar';
  title?: string;
  selectedTemplate?: string;
  personalInfo?: any;
}

interface UpdateResumeData {
  personalInfo?: any;
  experience?: any[];
  education?: any[];
  skills?: any[];
  languages?: any[];
  certifications?: any[];
  volunteer?: any[];
  links?: any[];
  status?: 'draft' | 'finalized';
}

export function useResumes(): UseResumesReturn {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draftCount = resumes.filter((r) => r.status === 'draft').length;
  const canCreateNew = !user || draftCount < MAX_DRAFT_CVS;
  const reachedDraftLimit = draftCount >= MAX_DRAFT_CVS;

  const fetchResumes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('resumes')
        .select('id, title, selected_template, status, updated_at, language, resume_personal_info(full_name, job_title, email)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setResumes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createResume = useCallback(async (data: CreateResumeData): Promise<string | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_PATHS.RESUME, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          language: data.language,
          title: data.title || 'My Resume',
          selectedTemplate: data.selectedTemplate || 'balanced-modern',
          personalInfo: data.personalInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create resume');
      }

      await fetchResumes();
      return result.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchResumes]);

  const updateResume = useCallback(async (id: string, data: UpdateResumeData): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_PATHS.RESUME_BY_ID(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...data,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update resume');
      }

      await fetchResumes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchResumes]);

  const deleteResume = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from('resumes').delete().eq('id', id);

      if (deleteError) throw deleteError;

      setResumes((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const duplicateResume = useCallback(async (id: string): Promise<string | null> => {
    if (!user || reachedDraftLimit) return null;

    setLoading(true);
    setError(null);

    try {
      const resumeToDuplicate = resumes.find((r) => r.id === id);
      if (!resumeToDuplicate) throw new Error('Resume not found');

      return await createResume({
        language: resumeToDuplicate.language as 'en' | 'ar',
        title: `${resumeToDuplicate.title} (Copy)`,
        selectedTemplate: resumeToDuplicate.selected_template,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate resume');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, resumes, reachedDraftLimit, createResume]);

  return {
    resumes,
    loading,
    error,
    draftCount,
    canCreateNew,
    reachedDraftLimit,
    fetchResumes,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
  };
}
