import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Database, Eye, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-lato tracking-tight">Privacy Policy</h1>
          <p className="text-brand-light/80 text-lg">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
          
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            Wakero Kelboro Foundation ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Wakero Kelboro Foundation.
          </p>

          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">1. Information We Collect</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4 ml-16">
                We may collect personal information that you provide to us when you:
              </p>
              <ul className="space-y-3 ml-16 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Make a donation
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Sign up for our newsletter
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Contact us directly
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4 ml-16">
                The personal information that we collect depends on the context of your interactions with us and may include your name, email address, phone number, and payment information.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">2. How We Use Your Information</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4 ml-16">
                We use the information we collect or receive to:
              </p>
              <ul className="space-y-3 ml-16 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Process and manage your donations securely
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Send you administrative information and updates about our campaigns
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Respond to your inquiries and offer support
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-2.5 shrink-0"></div>
                  Send marketing and promotional communications (if you have opted in)
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">3. How We Share Your Information</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                We do not sell your personal information. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (such as payment processors like Stripe) and require access to such information to do that work.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">4. Security of Your Information</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">5. Contact Us</h2>
              </div>
              <p className="text-slate-600 leading-relaxed ml-16">
                If you have questions or comments about this Privacy Policy, please contact us at:
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
