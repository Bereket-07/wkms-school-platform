import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Copyright, ExternalLink, AlertTriangle, FileText, Mail } from 'lucide-react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#f8fafc] selection:bg-brand-light selection:text-brand-dark">
      {/* Premium Header */}
      <div className="bg-brand-dark text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center text-brand-light hover:text-white font-bold mb-8 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-lato tracking-tight">Terms of Service</h1>
          <p className="text-brand-light/80 text-lg">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
          
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Welcome to Wakero Kelboro Foundation. These Terms of Service ("Terms") govern your use of our website located at wakerokelborofoundation.org (together or individually "Service") operated by Wakero Kelboro Foundation.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">1. Donations</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                All donations made through the Service are voluntary and non-refundable. By initiating a donation, you confirm that the funds provided are your own and that you are legally authorized to use the payment method provided.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <Copyright className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">2. Intellectual Property</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Wakero Kelboro Foundation and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">3. Links To Other Web Sites</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                Our Service may contain links to third-party web sites or services that are not owned or controlled by Wakero Kelboro Foundation. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">4. Limitation of Liability</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                In no event shall Wakero Kelboro Foundation, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">5. Changes to Terms</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">6. Contact Us</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="ml-16 mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-block">
                <p className="text-brand-dark font-medium flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-light" />
                  info@wakerokelborofoundation.org
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
