"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function NewCampaign() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal_amount_usd: '',
        goal_amount_etb: '',
        cover_image_url: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/campaigns/', {
                ...formData,
                goal_amount_usd: parseFloat(formData.goal_amount_usd) || 0,
                goal_amount_etb: parseFloat(formData.goal_amount_etb) || 0,
            });
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Failed to create campaign. Please check inputs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/campaigns" className="flex items-center text-slate-500 hover:text-emerald-700 mb-6 transition">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Create New Campaign</h1>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            placeholder="e.g. New Science Lab"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            placeholder="Tell the story..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Goal (USD) 🇺🇸</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="5000"
                                value={formData.goal_amount_usd}
                                onChange={(e) => setFormData({ ...formData, goal_amount_usd: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Goal (ETB) 🇪🇹</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none"
                                placeholder="100000"
                                value={formData.goal_amount_etb}
                                onChange={(e) => setFormData({ ...formData, goal_amount_etb: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                        <input
                            type="url"
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="https://images.unsplash.com/..."
                            value={formData.cover_image_url}
                            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        />
                        <p className="text-xs text-slate-400 mt-1">Paste a clean image link from Unsplash or elsewhere.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Launch Campaign</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
