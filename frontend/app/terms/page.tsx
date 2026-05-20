import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
        <Link href="/" className="inline-flex items-center text-brand-dark hover:text-brand-light font-bold mb-8 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold text-brand-dark mb-8 font-lato">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none prose-headings:text-brand-dark prose-a:text-brand-light">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          
          <p>
            Welcome to Wakero Kelboro Foundation. These Terms of Service ("Terms") govern your use of our website located at wakerokelborofoundation.org (together or individually "Service") operated by Wakero Kelboro Foundation.
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h3>1. Donations</h3>
          <p>
            All donations made through the Service are voluntary and non-refundable. By initiating a donation, you confirm that the funds provided are your own and that you are legally authorized to use the payment method provided.
          </p>

          <h3>2. Intellectual Property</h3>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Wakero Kelboro Foundation and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h3>3. Links To Other Web Sites</h3>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by Wakero Kelboro Foundation. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
          </p>

          <h3>4. Limitation of Liability</h3>
          <p>
            In no event shall Wakero Kelboro Foundation, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h3>5. Changes</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>

          <h3>6. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <strong>Email:</strong> info@wakerokelborofoundation.org
          </p>
        </div>
      </div>
    </main>
  );
}
