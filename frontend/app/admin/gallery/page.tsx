"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMedia, MediaItem, deleteMedia } from "@/lib/api";
import { Plus, Trash2, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GalleryPage({ embedded = false, limitType }: { embedded?: boolean; limitType?: string }) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedia();
    }, [limitType]); // Refetch when limitType changes if reused

    async function fetchMedia() {
        try {
            const data = await getMedia(0, 100, limitType);
            setMediaItems(data);
        } catch (e) {
            console.error("Failed to fetch media", e);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this media item?")) return;
        try {
            await deleteMedia(id);
            setMediaItems(items => items.filter(item => item.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to delete media");
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />Loading {limitType ? limitType.toLowerCase() + 's' : 'gallery'}...</div>;

    const uploadLink = limitType ? `/admin/gallery/new?type=${limitType}` : '/admin/gallery/new';

    return (
        <div>
            {!embedded && (
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Media Gallery</h1>
                        <p className="text-slate-500 mt-1">Manage portfolio photos and videos</p>
                    </div>
                    <Link
                        href={uploadLink}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Upload Media
                    </Link>
                </div>
            )}

            {embedded && (
                <div className="flex justify-end mb-6">
                    <Link
                        href={uploadLink}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Upload New {limitType === 'VIDEO' ? 'Video' : 'Media'}
                    </Link>
                </div>
            )}

            {/* Masonry-style Grid */}
            {/* Horizontal Scrollable Gallery (Carousel) */}
            {/* Responsive Grid Layout for Admin Management */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {mediaItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] border border-slate-100"
                    >
                        {item.media_type === 'VIDEO' || item.media_type === 'video' ? (
                            <div className="w-full h-full bg-slate-100 relative">
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    controls
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    onLoadedMetadata={(e) => {
                                        e.currentTarget.muted = true; // Ensure muted for autoplay policy
                                        e.currentTarget.play().catch(console.error);
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm">
                                    <Eye className="w-3 h-3" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <img
                                    src={item.url}
                                    alt={item.title || "Media"}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                            <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white backdrop-blur-md ${item.media_type === 'VIDEO' || item.media_type === 'video' ? 'bg-sky-500/80' : 'bg-emerald-500/80'}`}>
                                    {item.media_type}
                                </span>
                            </div>

                            <div>
                                <p className="text-white text-sm font-bold line-clamp-1 mb-3">{item.title || "Untitled"}</p>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {mediaItems.length === 0 && (
                <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <p className="text-slate-400 mb-4">No media items found in the gallery.</p>
                    <Link
                        href="/admin/gallery/new"
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        Upload your first image
                    </Link>
                </div>
            )}
        </div>
    );
}
