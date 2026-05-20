import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
        <Link href="/" className="inline-flex items-center text-brand-dark hover:text-brand-light font-bold mb-8 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold text-brand-dark mb-8 font-lato">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none prose-headings:text-brand-dark prose-a:text-brand-light">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <p>
            Wakero Kelboro Foundation ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Wakero Kelboro Foundation.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information that you provide to us when you:
          </p>
          <ul>
            <li>Make a donation</li>
            <li>Sign up for our newsletter</li>
            <li>Contact us directly</li>
          </ul>
          <p>
            The personal information that we collect depends on the context of your interactions with us and may include your name, email address, phone number, and payment information.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect or receive to:
          </p>
          <ul>
            <li>Process and manage your donations securely</li>
            <li>Send you administrative information and updates about our campaigns</li>
            <li>Respond to your inquiries and offer support</li>
            <li>Send marketing and promotional communications (if you have opted in)</li>
          </ul>

          <h3>3. How We Share Your Information</h3>
          <p>
            We do not sell your personal information. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (such as payment processors like Stripe) and require access to such information to do that work.
          </p>

          <h3>4. Security of Your Information</h3>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h3>5. Contact Us</h3>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> info@wakerokelborofoundation.org
          </p>
        </div>
      </div>
    </main>
  );
}
