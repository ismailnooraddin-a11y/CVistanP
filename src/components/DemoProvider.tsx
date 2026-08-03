'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createSeedState } from '@/lib/demoData';
import { DemoState } from '@/lib/types';

const STORAGE_KEY = 'estateflow-demo-v5';
const BRANCH_KEY = 'estateflow-active-branch-v5';

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;
  updateState: (updater: (current: DemoState) => DemoState) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function safeParse(value: string | null): DemoState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as DemoState;
    if (!parsed.company || !Array.isArray(parsed.contacts) || !Array.isArray(parsed.properties)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function DemoProvider({ children }: { children: React.ReactNode }) {
  const seed = useMemo(() => createSeedState(), []);
  const [state, setState] = useState<DemoState>(seed);
  const [activeBranchId, setActiveBranchIdState] = useState(seed.branches[0]?.id || '');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
    if (stored) setState(stored);
    const storedBranch = window.localStorage.getItem(BRANCH_KEY);
    if (storedBranch && (stored || seed).branches.some((branch) => branch.id === storedBranch)) setActiveBranchIdState(storedBranch);
    setReady(true);
  }, [seed]);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn('EstateFlow demo storage is full; current changes remain available until refresh.', error); }
  }, [ready, state]);

  const setActiveBranchId = useCallback((branchId: string) => {
    setActiveBranchIdState(branchId);
    try { window.localStorage.setItem(BRANCH_KEY, branchId); } catch { /* Branch selection still works in memory. */ }
  }, []);

  const updateState = useCallback((updater: (current: DemoState) => DemoState) => setState((current) => updater(current)), []);

  const resetDemo = useCallback(() => {
    const next = createSeedState();
    setState(next);
    setActiveBranchIdState(next.branches[0]?.id || '');
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.localStorage.setItem(BRANCH_KEY, next.branches[0]?.id || '');
    } catch { /* The in-memory reset still succeeds. */ }
  }, []);

  const value = useMemo(() => ({ state, ready, activeBranchId, setActiveBranchId, updateState, resetDemo }), [state, ready, activeBranchId, setActiveBranchId, updateState, resetDemo]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside DemoProvider');
  return value;
}
