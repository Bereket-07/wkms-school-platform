"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

function PledgeForm() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get("campaignId");

    const [formData, setFormData] = useState({
        donor_name: "",
        donor_email: "",
        amount: "",
        currency: "USD",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await api.post("/pledges/", {
                donor_name: formData.donor_name,
                donor_email: formData.donor_email,
                amount: formData.amount ? parseFloat(formData.amount) : null,
                currency: formData.currency,
                campaign_id: campaignId || null,
            });
            setIsSuccess(true);
        } catch (err) {
            console.error("Pledge submission failed", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl text-center max-w-lg mx-auto"
            >
                <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-brand-dark" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Thank You!</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Your pledge has been received. We will contact you as soon as our official donation gateway is launched.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    Return Home
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-xl mx-auto border border-slate-100"
        >
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-brand-dark" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">Make a Pledge</h2>
                <p className="text-slate-500">
                    Be the first to donate when we launch. Leave your details below and we'll notify you.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Full Name *</label>
                    <input
                        type="text"
                        name="donor_name"
                        required
                        value={formData.donor_name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all outline-none text-slate-900"
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Email Address *</label>
                    <input
                        type="email"
                        name="donor_email"
                        required
                        value={formData.donor_email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all outline-none text-slate-900"
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Pledge Amount (Optional)</label>
                    <div className="flex gap-2">
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none text-slate-900 font-bold"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="ETB">ETB (Br)</option>
                        </select>
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                {formData.currency === 'USD' ? '$' : 'Br'}
                            </span>
                            <input
                                type="number"
                                name="amount"
                                min="1"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full pl-10 pr-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all outline-none text-slate-900"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">You will not be charged today.</p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-brand-red/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>Submit Pledge <Send className="w-5 h-5" /></>
                    )}
                </button>
            </form>
        </motion.div>
    );
}

export default function PledgePage() {
    return (
        <main className="min-h-screen font-sans bg-slate-50 relative overflow-hidden pt-32 pb-24 px-6">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-light/80 to-slate-50 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-brand-light/40 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="container mx-auto relative z-10">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <PledgeForm />
                </Suspense>
            </div>
        </main>
    );
}
