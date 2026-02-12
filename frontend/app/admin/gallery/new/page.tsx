"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function NewMedia() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        url: '',
        title: '',
        media_type: searchParams.get('type') || 'IMAGE',
        category: 'GALLERY',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/media/', formData);
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Failed to upload media. Please check inputs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/gallery" className="flex items-center text-slate-500 hover:text-emerald-700 mb-6 transition">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gallery
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Upload to Gallery</h1>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Media File</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors group relative overflow-hidden">
                            {formData.url ? (
                                <div className="relative h-64 w-full">
                                    {formData.media_type === 'VIDEO' ? (
                                        <video src={formData.url} controls className="h-full w-full object-contain rounded-lg shadow-sm" />
                                    ) : (
                                        <img src={formData.url} alt="Preview" className="h-full w-full object-contain rounded-lg shadow-sm" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, url: '' })}
                                        className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-slate-600 hover:text-red-500 transition shadow-sm"
                                    >
                                        <Loader2 className="w-4 h-4 rotate-45" /> {/* Use generic icon as replace X */}
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                                        {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ImageIcon className="w-8 h-8" />}
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">Click to upload image or video</p>
                                    <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG, or MP4</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setLoading(true);
                                                try {
                                                    const { uploadFile } = await import('@/lib/api');
                                                    const { url } = await uploadFile(file);
                                                    setFormData({
                                                        ...formData,
                                                        url,
                                                        media_type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'
                                                    });
                                                } catch (err) {
                                                    setError('Failed to upload file');
                                                    console.error(err);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Use existing inputs for Meta */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Caption / Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                            placeholder="e.g. Students inside the lab"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={formData.media_type}
                                onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                            >
                                <option value="IMAGE">Image</option>
                                <option value="VIDEO">Video</option>
                                <option value="YOUTUBE_URL">YouTube Link</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="GALLERY">General Gallery</option>
                                <option value="CAMPAIGN_UPDATE">Campaign Update</option>
                                <option value="EVENT">Event</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none"
                            placeholder="Add details about this video or image..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.url}
                        className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save to Gallery</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
