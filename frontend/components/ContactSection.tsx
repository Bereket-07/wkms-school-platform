"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Mail, User, MessageSquare } from "lucide-react";
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
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
                    <h2 className="text-4xl md:text-5xl font-lato font-black text-slate-900 mb-6">We'd Love to Hear From You</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Whether you have a question about donations, volunteering, or just want to say hello, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12">
                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                            <p className="text-slate-500">Thank you for reaching out. We'll get back to you shortly.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-emerald-600 font-bold hover:text-emerald-700 underline"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="name"
                                            {...register("name", { required: "Name is required" })}
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'}`}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-rose-500 font-medium ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'}`}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-rose-500 font-medium ml-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1">Subject (Optional)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="subject"
                                        {...register("subject")}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                <textarea
                                    id="message"
                                    {...register("message", { required: "Message is required" })}
                                    rows={5}
                                    className={`w-full p-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-none ${errors.message ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'}`}
                                    placeholder="Write your message here..."
                                ></textarea>
                                {errors.message && <p className="text-xs text-rose-500 font-medium ml-1">{errors.message.message}</p>}
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> {errorMessage}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
