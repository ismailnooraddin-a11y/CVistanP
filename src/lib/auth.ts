import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export async function requireUser(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect('/auth');
  return {supabase,user};
}
export async function requireMembership(){
  const {supabase,user}=await requireUser();
  const {data:membership}=await supabase.from('branch_memberships').select('*, branches(*)').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
  if(!membership) redirect('/onboarding');
  return {supabase,user,membership};
}
