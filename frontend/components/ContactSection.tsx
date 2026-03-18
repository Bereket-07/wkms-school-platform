"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage, ContactMessage } from "@/lib/api";

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function ContactSection() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data: FormData) => {
        setStatus('submitting');
        try {
            await submitContactMessage(data);
            setStatus('success');
            reset();
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.response?.data?.detail || "Something went wrong. Please try again.");
        }
    };

    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-block border-b border-brand-dark pb-0.5 mb-6">
                        <span className="text-brand-dark font-bold tracking-wide text-sm">Get in touch</span>
                    </div>
                    <h2 className="text-5xl md:text-[72px] font-sans font-black text-brand-dark leading-[1] tracking-[-0.02em] mb-8">
                        We'd love to hear from you
                    </h2>
                    <p className="text-[17px] text-[#b3b3b3] font-light max-w-2xl mx-auto leading-relaxed">
                        Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.
                    </p>
                </div>

                <div className="bg-[#f8f9fa] rounded-2xl shadow-xl border border-slate-100 p-8 md:p-16 max-w-4xl mx-auto">
                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-[#dcf0ec] rounded-full flex items-center justify-center mx-auto mb-6 text-brand-dark">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                            <p className="text-slate-500">Thank you for reaching out. We'll get back to you shortly.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-brand-dark font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="name" className="text-sm font-bold text-black block">Name</label>
                                    <input
                                        id="name"
                                        {...register("name", { required: "Name is required" })}
                                        className={`w-full px-5 py-4 bg-[#dcf0ec] text-brand-dark placeholder:text-brand-dark/40 placeholder:font-light border-none rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark/20 transition-all ${errors.name ? 'ring-2 ring-rose-300' : ''}`}
                                        placeholder="Full name"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-sm font-bold text-black block">Email</label>
                                    <input
                                        id="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className={`w-full px-5 py-4 bg-[#dcf0ec] text-brand-dark placeholder:text-brand-dark/40 placeholder:font-light border-none rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark/20 transition-all ${errors.email ? 'ring-2 ring-rose-300' : ''}`}
                                        placeholder="Sample@gmail.com"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="subject" className="text-sm font-bold text-black block">Subject (Optional)</label>
                                <input
                                    id="subject"
                                    {...register("subject")}
                                    className="w-full px-5 py-4 bg-[#dcf0ec] text-brand-dark placeholder:text-brand-dark/40 placeholder:font-light border-none rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark/20 transition-all"
                                    placeholder="How can we help"
                                />
                            </div>

                            <div className="space-y-3">
                                {/* The design mockup strangely shows "Subject (Optional)" for the message box label too */}
                                <label htmlFor="message" className="text-sm font-bold text-black block">Subject (Optional)</label>
                                <textarea
                                    id="message"
                                    {...register("message", { required: "Message is required" })}
                                    rows={6}
                                    className={`w-full px-5 py-4 bg-[#dcf0ec] text-brand-dark placeholder:text-brand-dark/40 placeholder:font-light border-none rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark/20 transition-all resize-none ${errors.message ? 'ring-2 ring-rose-300' : ''}`}
                                    placeholder="Write your message here"
                                ></textarea>
                                {errors.message && <p className="text-xs text-rose-500 font-medium">{errors.message.message}</p>}
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> {errorMessage}
                                </div>
                            )}

                            <div className="pt-6 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="bg-[#005960] hover:bg-[#004b51] text-[#dcf0ec] text-[15px] font-medium px-8 py-3 rounded-md transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:shadow-none min-w-[160px]"
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
