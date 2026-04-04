'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Globe, Download, Mail, ChevronRight, BookOpen } from 'lucide-react';
import { useBuilderStore } from '@/store/builder';
import { AppLanguage } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const setLanguage = useBuilderStore((s) => s.setLanguage);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleStart = (lang: AppLanguage) => {
    setLanguage(lang);
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-surface-900">Cvistan</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/learn" className="text-sm text-surface-500 hover:text-brand-600 transition-colors hidden sm:flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Learn about CVs
          </a>
          <a href="/auth/signin" className="text-sm text-surface-500 hover:text-surface-700 transition-colors hidden sm:block">
            Sign In
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-tight tracking-tight">
            Build a CV that <br className="hidden sm:block" />
            <span className="text-brand-600">stands out</span>
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-surface-500 max-w-xl mx-auto leading-relaxed">
            Professional templates, live preview, instant PDF export. No sign-up needed — start building right now.
          </p>

          <div className="mt-4">
            {!showLangPicker ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLangPicker(true)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-brand-600/25 hover:bg-brand-700 transition-colors"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <p className="text-surface-500 text-sm font-medium">Choose your language:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStart('en')}
                    className="flex items-center gap-2 bg-white border-2 border-surface-200 hover:border-brand-400 text-surface-800 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
                  >
                    <Globe className="w-4 h-4" />
                    English
                  </button>
                  <button
                    onClick={() => handleStart('ar')}
                    className="flex items-center gap-2 bg-white border-2 border-surface-200 hover:border-brand-400 text-surface-800 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
                  >
                    <Globe className="w-4 h-4" />
                    العربية
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Learn about CVs link */}
          <div className="mt-5">
            
              href="/learn"
              className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-600 transition-colors font-medium group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              New to CVs? Learn what makes a great CV
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            { icon: FileText, title: 'Professional Templates', desc: 'ATS-friendly, modern, and elegant designs that adapt to your content.' },
            { icon: Globe, title: 'English & Arabic', desc: 'Full RTL support. Build your CV in the language that works for you.' },
            { icon: Download, title: 'Instant PDF Export', desc: 'Download your CV as a polished PDF with one click.' },
            { icon: Mail, title: 'Email & Telegram', desc: 'Send your CV directly to your inbox or Telegram.' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-surface-100 hover:border-surface-200 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-surface-800 mb-2">{f.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-400">
          <span>&copy; {new Date().getFullYear()} Cvistan</span>
          <div className="flex gap-6">
            <a href="/learn" className="hover:text-surface-600 transition-colors">Learn about CVs</a>
            <a href="/privacy" className="hover:text-surface-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-surface-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
