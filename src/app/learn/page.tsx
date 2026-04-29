'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, User, AlignLeft, Briefcase, GraduationCap, Wrench, Globe2, Award, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    icon: FileText,
    color: 'bg-brand-500',
    title: 'What is a CV?',
    titleAr: 'ما هي السيرة الذاتية؟',
    content: 'A CV (Curriculum Vitae) is a document that summarizes your education, work experience, skills, and achievements. It is your first impression to employers — think of it as your professional story on paper.',
    contentAr: 'السيرة الذاتية هي وثيقة تلخص تعليمك وخبراتك المهنية ومهاراتك وإنجازاتك. إنها انطباعك الأول لدى أصحاب العمل — فكر فيها كقصتك المهنية على ورق.',
    tip: 'A good CV gets you an interview. An interview gets you the job.',
    tipAr: 'السيرة الذاتية الجيدة تحصل لك على مقابلة. والمقابلة تحصل لك على الوظيفة.',
  },
  {
    icon: User,
    color: 'bg-emerald-500',
    title: 'Personal Information',
    titleAr: 'المعلومات الشخصية',
    content: 'This is the header of your CV. Include your full name, job title, phone number, email, and location. This helps employers know who you are and how to reach you.',
    contentAr: 'هذا هو رأس سيرتك الذاتية. أضف اسمك الكامل، المسمى الوظيفي، رقم الهاتف، البريد الإلكتروني، والموقع. يساعد هذا أصحاب العمل على معرفتك وكيفية التواصل معك.',
    tip: 'Use a professional email address. yourname@email.com looks much better than coolguy99@email.com',
    tipAr: 'استخدم بريداً إلكترونياً احترافياً. اسمك@email.com أفضل بكثير من عنوان عشوائي',
  },
  {
    icon: AlignLeft,
    color: 'bg-violet-500',
    title: 'Professional Summary',
    titleAr: 'الملخص المهني',
    content: 'A short paragraph (2-4 sentences) at the top of your CV that highlights who you are, your key experience, and what you are looking for. Think of it as your elevator pitch.',
    contentAr: 'فقرة قصيرة (٢-٤ جمل) في أعلى سيرتك الذاتية تبرز من أنت، وخبرتك الأساسية، وما تبحث عنه. فكر فيها كعرض تقديمي سريع عن نفسك.',
    tip: 'Keep it specific. "Experienced marketing professional with 3 years in digital campaigns" is better than "Hard worker looking for opportunity".',
    tipAr: 'كن محدداً. "متخصص تسويق ذو خبرة ٣ سنوات في الحملات الرقمية" أفضل من "شخص مجتهد يبحث عن فرصة".',
  },
  {
    icon: Briefcase,
    color: 'bg-amber-500',
    title: 'Work Experience',
    titleAr: 'الخبرة العملية',
    content: 'List your jobs starting with the most recent. For each job, include your title, company name, dates, and 2-4 bullet points describing what you did and achieved.',
    contentAr: 'اذكر وظائفك بدءاً من الأحدث. لكل وظيفة، أضف المسمى الوظيفي، اسم الشركة، التواريخ، و٢-٤ نقاط تصف ما قمت به وما حققته.',
    tip: 'Use action verbs: "Managed", "Created", "Increased", "Led" — not "Was responsible for".',
    tipAr: 'استخدم أفعال الإنجاز: "أدرت"، "أنشأت"، "زدت"، "قدت" — وليس "كنت مسؤولاً عن".',
  },
  {
    icon: GraduationCap,
    color: 'bg-blue-500',
    title: 'Education',
    titleAr: 'التعليم',
    content: 'Include your degrees, the institution names, and graduation dates. Start with the highest degree. If you are a fresh graduate, you can also include your GPA and relevant coursework.',
    contentAr: 'أضف شهاداتك، أسماء المؤسسات التعليمية، وتواريخ التخرج. ابدأ بأعلى شهادة. إذا كنت حديث التخرج، يمكنك إضافة معدلك والمواد ذات الصلة.',
    tip: 'Fresh graduates: put Education before Experience since it is your strongest section.',
    tipAr: 'حديثو التخرج: ضعوا التعليم قبل الخبرة لأنه القسم الأقوى لديكم.',
  },
  {
    icon: Wrench,
    color: 'bg-rose-500',
    title: 'Skills',
    titleAr: 'المهارات',
    content: 'List technical and soft skills relevant to the job. Technical skills are things like Excel, Photoshop, or Programming. Soft skills include Communication, Leadership, and Teamwork.',
    contentAr: 'اذكر المهارات التقنية والشخصية المتعلقة بالوظيفة. المهارات التقنية مثل Excel وPhotoshop والبرمجة. المهارات الشخصية تشمل التواصل والقيادة والعمل الجماعي.',
    tip: 'Tailor your skills to the job. Read the job posting and match your skills to what they need.',
    tipAr: 'خصص مهاراتك للوظيفة. اقرأ إعلان الوظيفة وطابق مهاراتك مع ما يحتاجونه.',
  },
  {
    icon: Globe2,
    color: 'bg-teal-500',
    title: 'Languages',
    titleAr: 'اللغات',
    content: 'List the languages you speak and your proficiency level: Native, Fluent, Intermediate, or Beginner. In our region, knowing Arabic, English, and Kurdish is a great advantage.',
    contentAr: 'اذكر اللغات التي تتحدثها ومستوى إتقانك: لغة أم، متقدم، متوسط، أو مبتدئ. في منطقتنا، معرفة العربية والإنجليزية والكردية ميزة كبيرة.',
    tip: 'Be honest about your level. You might be tested during the interview!',
    tipAr: 'كن صادقاً حول مستواك. قد يتم اختبارك أثناء المقابلة!',
  },
  {
    icon: Heart,
    color: 'bg-pink-500',
    title: 'Volunteer & Activities',
    titleAr: 'التطوع والأنشطة',
    content: 'Include volunteer work, student clubs, competitions, and community service. This is especially valuable for fresh graduates who may not have much work experience yet.',
    contentAr: 'أضف العمل التطوعي، الأندية الطلابية، المسابقات، والخدمة المجتمعية. هذا قيّم جداً لحديثي التخرج الذين قد لا يملكون خبرة عملية كبيرة.',
    tip: 'Volunteering shows character, initiative, and teamwork — qualities every employer values.',
    tipAr: 'العمل التطوعي يُظهر الشخصية والمبادرة والعمل الجماعي — صفات يقدرها كل صاحب عمل.',
  },
  {
    icon: Award,
    color: 'bg-orange-500',
    title: 'Certifications',
    titleAr: 'الشهادات',
    content: 'List any professional certifications, online courses, or training programs you have completed. Include the certification name, issuing organization, and date.',
    contentAr: 'اذكر أي شهادات مهنية، دورات عبر الإنترنت، أو برامج تدريبية أكملتها. أضف اسم الشهادة، الجهة المانحة، والتاريخ.',
    tip: 'Free certifications from Google, Coursera, and LinkedIn Learning can significantly boost your CV.',
    tipAr: 'الشهادات المجانية من Google وCoursera وLinkedIn Learning يمكن أن تعزز سيرتك الذاتية بشكل كبير.',
  },
  {
    icon: Lightbulb,
    color: 'bg-yellow-500',
    title: 'Golden Tips',
    titleAr: 'نصائح ذهبية',
    content: 'Keep your CV to 1-2 pages maximum. Use a clean, professional template. Check for spelling and grammar mistakes. Save it as PDF when sending to employers. Customize it for each job application.',
    contentAr: 'اجعل سيرتك الذاتية ١-٢ صفحة كحد أقصى. استخدم قالباً نظيفاً واحترافياً. تحقق من الأخطاء الإملائية والنحوية. احفظها كـ PDF عند إرسالها. خصصها لكل طلب وظيفة.',
    tip: 'Ready to build your CV? Click the button below to start!',
    tipAr: 'مستعد لبناء سيرتك الذاتية؟ اضغط الزر أدناه للبدء!',
  },
];

export default function LearnPage() {
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const router = useRouter();
  const isAr = lang === 'ar';
  const slide = slides[current];
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Cvistan</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${lang === 'en' ? 'bg-white text-surface-900' : 'text-surface-400 hover:text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ar')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${lang === 'ar' ? 'bg-white text-surface-900' : 'text-surface-400 hover:text-white'}`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 py-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-brand-400' : 'w-1.5 bg-surface-600 hover:bg-surface-500'}`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${slide.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-brand-400 text-sm font-medium mb-2">
                {current + 1} / {slides.length}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {isAr ? slide.titleAr : slide.title}
              </h1>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
              <p className="text-surface-200 text-base sm:text-lg leading-relaxed">
                {isAr ? slide.contentAr : slide.content}
              </p>
            </div>

            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <p className="text-brand-200 text-sm sm:text-base">
                  {isAr ? slide.tipAr : slide.tip}
                </p>
              </div>
            </div>

            {isLast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={() => router.push('/builder')}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-brand-600/25 hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
                >
                  {isAr ? 'ابدأ بناء سيرتك الذاتية' : 'Start Building Your CV'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-8 pb-6">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {isAr ? 'السابق' : 'Previous'}
        </button>

        <button
          onClick={() => isLast ? router.push('/builder') : setCurrent(current + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isLast ? 'bg-brand-600 text-white hover:bg-brand-700' : 'text-surface-400 hover:text-white hover:bg-white/5'}`}
        >
          {isLast ? (isAr ? 'ابدأ الآن' : 'Start Now') : (isAr ? 'التالي' : 'Next')}
          {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
