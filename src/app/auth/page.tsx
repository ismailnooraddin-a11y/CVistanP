'use client';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function AuthPage(){
 const supabase=createClient();
 const [mode,setMode]=useState<'email'|'phone'>('email'); const [value,setValue]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
 const site=process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
 async function google(){setBusy(true); const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${site}/auth/callback`}}); if(error){setMsg(error.message);setBusy(false)}}
 async function otp(){setBusy(true);setMsg(''); const options={shouldCreateUser:true,emailRedirectTo:`${site}/auth/callback`}; const {error}=mode==='email'?await supabase.auth.signInWithOtp({email:value,options}):await supabase.auth.signInWithOtp({phone:value,options:{shouldCreateUser:true}}); setMsg(error?error.message:`Check your ${mode} for the secure sign-in code/link.`);setBusy(false)}
 return <main className="auth-shell"><section className="auth-card"><h1 className="serif">Welcome to EstateFlow</h1><p className="sub">Sign in securely to continue.</p><div className="stack"><button className="btn btn-secondary" onClick={google} disabled={busy}>Continue with Google</button><div className="divider">or</div><div className="actions"><button className={`btn ${mode==='email'?'btn-accent':'btn-secondary'}`} onClick={()=>setMode('email')}>Email</button><button className={`btn ${mode==='phone'?'btn-accent':'btn-secondary'}`} onClick={()=>setMode('phone')}>Phone number</button></div><div className="field"><label>{mode==='email'?'Work email':'Phone number with country code'}</label><input className="input" type={mode==='email'?'email':'tel'} placeholder={mode==='email'?'name@company.com':'+964 750 000 0000'} value={value} onChange={e=>setValue(e.target.value)}/></div><button className="btn btn-primary" onClick={otp} disabled={busy||!value}>{busy?'Please wait…':'Continue securely'}</button>{msg&&<div className={`notice ${msg.toLowerCase().includes('error')?'error':''}`}>{msg}</div>}</div></section></main>
}
