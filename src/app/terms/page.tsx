export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-brand-600 text-sm font-medium mb-8 block">&larr; Back to Cvistan</a>
        <h1 className="text-3xl font-bold text-surface-900 mb-8">Terms of Service</h1>
        <div className="prose prose-surface max-w-none space-y-6 text-surface-700 leading-relaxed">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">1. Acceptance of Terms</h2>
          <p>By using Cvistan, you agree to these terms. If you do not agree, please do not use the service.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">2. Service Description</h2>
          <p>Cvistan is a CV builder that allows you to create professional resumes, cover letters, and interview preparation documents. The service is provided as-is.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">3. User Responsibilities</h2>
          <p>You are responsible for the accuracy of the information you provide. You agree not to use the service for any unlawful purpose or to submit false or misleading information.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">4. Intellectual Property</h2>
          <p>You retain ownership of the content you create. Cvistan retains ownership of the application, templates, and design system. Templates are licensed for personal use only.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">5. Limitation of Liability</h2>
          <p>Cvistan is provided without warranties. We are not liable for any damages arising from your use of the service, including but not limited to failed document generation or delivery.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">6. Changes</h2>
          <p>We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>

          <h2 className="text-xl font-semibold text-surface-800 mt-8">7. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:legal@cvistan.com" className="text-brand-600">legal@cvistan.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
