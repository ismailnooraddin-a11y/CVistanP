import { useCallback, useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/builder';
import { API_PATHS, AUTO_SAVE_DEBOUNCE_MS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

interface UseAutoSaveOptions {
  resumeId?: string;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave({
  resumeId,
  enabled = true,
  onSuccess,
  onError,
}: UseAutoSaveOptions = {}) {
  const { user } = useAuth();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  const resume = useBuilderStore((state) => state.resume);

  const save = useCallback(async () => {
    if (!user || !resumeId) return;

    const stateHash = JSON.stringify(resume);
    if (stateHash === lastSaveRef.current) return;

    try {
      const response = await fetch(API_PATHS.RESUME_BY_ID(resumeId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          personalInfo: resume.personalInfo,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          languages: resume.languages,
          certifications: resume.certifications,
          volunteer: resume.volunteer,
          links: resume.links,
        }),
      });

      if (!response.ok) throw new Error('Save failed');
      lastSaveRef.current = stateHash;
      onSuccess?.();
    } catch (err) {
      onError?.(err as Error);
    }
  }, [user, resumeId, resume, onSuccess, onError]);

  useEffect(() => {
    if (!enabled || !user || !resumeId) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(save, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [enabled, user, resumeId, resume, save]);

  return { save, isLastSave: lastSaveRef.current };
}
