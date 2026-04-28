export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-brand-600 text-sm font-medium mb-8 block">&larr; Back to Cvistan</a>
        <h1 className="text-3xl font-bold text-surface-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-surface max-w-none space-y-6 text-surface-700 leading-relaxed">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">1. Information We Collect</h2>
          <p>Cvistan collects the personal information you voluntarily provide when building your CV, including your name, contact details, work history, education, and skills. If you create an account, we also store your email and encrypted password.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">2. How We Use Your Information</h2>
          <p>Your data is used solely to generate your CV documents (PDF, DOCX), deliver them via your chosen method (download, email, or Telegram), and save your work if you create an account. We do not sell your data to third parties.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">3. Data Storage</h2>
          <p>Your data is stored securely using Supabase (hosted on AWS). Guest session data is temporary and may be deleted after 7 days. Account data is retained until you delete your account.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">4. Third-Party Services</h2>
          <p>We use the following third-party services: Supabase for data storage and authentication, Resend for email delivery, and Telegram Bot API for optional Telegram delivery. Each operates under its own privacy policy.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">5. Your Rights</h2>
          <p>You may request deletion of your data at any time by contacting us. Guest data is automatically purged after expiration.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">6. Contact</h2>
          <p>For privacy questions, contact us at <a href="mailto:privacy@cvistan.com" className="text-brand-600">privacy@cvistan.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
