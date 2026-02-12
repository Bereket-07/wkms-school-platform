"use client";

import { useState, useEffect } from "react";
import api, { getSiteContent, bulkUpdateSiteContent, uploadFile, SiteContent } from "@/lib/api";
import { Save, Upload, LayoutTemplate, Type, Image as ImageIcon, Video, Loader2, CheckCircle2, ChevronsUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Grouping helper
const groupBySection = (data: SiteContent[]) => {
    return data.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, SiteContent[]>);
};

export default function CMSPage() {
    const [content, setContent] = useState<Record<string, SiteContent[]>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("HERO");
    const [formState, setFormState] = useState<Record<string, string>>({});

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await getSiteContent();
            const grouped = groupBySection(data);
            setContent(grouped);

            // Initialize form state
            const initialForm: Record<string, string> = {};
            data.forEach(item => {
                initialForm[item.key] = item.content || "";
            });
            setFormState(initialForm);
        } catch (error) {
            console.error("Failed to load content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setFormState(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (key: string, file: File) => {
        try {
            // optimistically show uploading...
            const { url } = await uploadFile(file);
            handleInputChange(key, url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload file");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only send fields that belong to current active tab (optimization)
            // or just send everything that changed? Let's send everything for simplicity
            await bulkUpdateSiteContent(formState);

            // Re-fetch to ensure sync
            await loadContent();
            alert("Content updated successfully!");
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const sections = ["HERO", "ABOUT", "IMPACT", "MEDIA", "VIDEOS", "COMMUNITY", "FOOTER"];
    const allTabs = sections;

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-emerald-600" /></div>;

    return (
        <div className="space-y-8">
            {/* ... Existing Header ... */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                        <LayoutTemplate className="w-6 h-6 text-emerald-600" /> Website Content
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage text, images, and videos across your site.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar / Tabs */}
                {/* Sidebar / Tabs - Horizontal on Mobile, Vertical on Desktop */}
                {/* Sidebar / Tabs Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-4">

                    {/* MOBILE: Dropdown Menu (The "Option Buttons" requested) */}
                    <div className="lg:hidden">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Select Section to Edit</label>
                        <div className="relative">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 font-bold rounded-xl py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                {sections.map(section => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>
                            {/* Custom Arrow Icon */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <ChevronsUpDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP: Vertical Tabs Sidebar */}
                    <div className="hidden lg:flex flex-col gap-2">
                        {sections.map(section => (
                            <button
                                key={section}
                                onClick={() => setActiveTab(section)}
                                className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all flex justify-between items-center ${activeTab === section
                                    ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg scale-[1.02]'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {section}
                                {activeTab === section && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
                            </button>
                        ))}
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl mt-4 lg:mt-8">
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                            💡 <strong>Tip:</strong> Changes made here update the live website immediately after you save.
                        </p>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[600px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* --- VISUAL EDITOR: HERO SECTION --- */}
                            {activeTab === 'HERO' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 rounded-3xl p-8 text-center text-white relative overflow-hidden group">
                                        {/* Background Video Preview/Upload */}
                                        <div className="absolute inset-0 z-0 opacity-40">
                                            {formState['hero_video'] ? (
                                                <video src={formState['hero_video']} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800" />
                                            )}
                                        </div>
                                        {/* Video Upload Overlay */}
                                        <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300">
                                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition">
                                                <Video className="w-4 h-4" /> Change Video
                                                <input type="file" className="hidden" accept="video/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('hero_video', e.target.files[0])} />
                                            </label>
                                        </div>

                                        <div className="relative z-10 py-12 space-y-6 max-w-2xl mx-auto">
                                            {/* Badge Input */}
                                            <div className="flex justify-center">
                                                <input
                                                    value={formState['hero_badge'] || ''}
                                                    onChange={(e) => handleInputChange('hero_badge', e.target.value)}
                                                    className="bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-center text-white outline-none focus:bg-white/20 transition placeholder:text-white/50 w-64"
                                                    placeholder="Badge Text"
                                                />
                                            </div>

                                            {/* Main Title Inputs */}
                                            <div className="space-y-2">
                                                <input
                                                    value={formState['hero_title_1'] || ''}
                                                    onChange={(e) => handleInputChange('hero_title_1', e.target.value)}
                                                    className="w-full bg-transparent text-4xl md:text-5xl font-serif font-bold text-center text-white outline-none placeholder:text-white/30"
                                                    placeholder="Title Line 1"
                                                />
                                                <input
                                                    value={formState['hero_title_accent'] || ''}
                                                    onChange={(e) => handleInputChange('hero_title_accent', e.target.value)}
                                                    className="w-full bg-transparent text-4xl md:text-5xl font-serif font-bold text-center text-emerald-300 outline-none placeholder:text-emerald-300/30"
                                                    placeholder="Accent Title"
                                                />
                                            </div>

                                            {/* Subtitle Input */}
                                            <textarea
                                                value={formState['hero_subtitle'] || ''}
                                                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                                                rows={3}
                                                className="w-full bg-transparent text-lg text-slate-200 text-center outline-none resize-none border border-transparent focus:border-white/20 rounded-xl p-2 transition"
                                                placeholder="Hero Subtitle..."
                                            />
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-slate-400">👆 Click text to edit. Changes update live.</p>
                                </div>
                            )}

                            {/* --- VISUAL EDITOR: ABOUT SECTION --- */}
                            {activeTab === 'ABOUT' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    {/* Left: Images */}
                                    <div className="space-y-4">
                                        <div className="relative aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden group border border-slate-200">
                                            {formState['about_image_main'] ? (
                                                <Image src={formState['about_image_main']} alt="Main" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">Main Image</div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300">
                                                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg">
                                                    <ImageIcon className="w-4 h-4" /> Change Main Image
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('about_image_main', e.target.files[0])} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="relative h-40 bg-slate-100 rounded-2xl overflow-hidden group border border-slate-200">
                                            {formState['about_image_accent'] ? (
                                                <Image src={formState['about_image_accent']} alt="Accent" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">Accent Image</div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300">
                                                <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg">
                                                    <ImageIcon className="w-3 h-3" /> Change Accent
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('about_image_accent', e.target.files[0])} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Text Content */}
                                    <div className="space-y-6 pt-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section Badge</label>
                                            <input
                                                value={formState['about_badge'] || ''}
                                                onChange={(e) => handleInputChange('about_badge', e.target.value)}
                                                className="w-full text-emerald-600 font-bold tracking-widest uppercase text-sm border-b border-transparent focus:border-emerald-200 outline-none pb-1"
                                                placeholder="WHO WE ARE"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headline</label>
                                            <div className="space-y-2">
                                                <input
                                                    value={formState['about_title_1'] || ''}
                                                    onChange={(e) => handleInputChange('about_title_1', e.target.value)}
                                                    className="w-full text-3xl font-serif font-bold text-slate-900 border-b border-transparent focus:border-slate-200 outline-none pb-1"
                                                    placeholder="More Than Just"
                                                />
                                                <input
                                                    value={formState['about_title_accent'] || ''}
                                                    onChange={(e) => handleInputChange('about_title_accent', e.target.value)}
                                                    className="w-full text-3xl font-serif font-bold text-emerald-500 border-b border-transparent focus:border-emerald-200 outline-none pb-1"
                                                    placeholder="A School."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paragraphs</label>
                                            <textarea
                                                value={formState['about_text_1'] || ''}
                                                onChange={(e) => handleInputChange('about_text_1', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-emerald-500 transition-all text-slate-600 leading-relaxed"
                                                placeholder="Paragraph 1..."
                                            />
                                            <textarea
                                                value={formState['about_text_2'] || ''}
                                                onChange={(e) => handleInputChange('about_text_2', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-emerald-500 transition-all text-slate-600 leading-relaxed"
                                                placeholder="Paragraph 2..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- VISUAL EDITOR: IMPACT SECTION --- */}
                            {activeTab === 'IMPACT' && (
                                <div className="space-y-8">
                                    <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                                        <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
                                            <div className="flex justify-center">
                                                <input
                                                    value={formState['impact_badge'] || ''}
                                                    onChange={(e) => handleInputChange('impact_badge', e.target.value)}
                                                    className="bg-white border-2 border-emerald-100 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 outline-none focus:border-emerald-300 transition text-center w-48"
                                                    placeholder="Badge"
                                                />
                                            </div>
                                            <input
                                                value={formState['impact_title'] || ''}
                                                onChange={(e) => handleInputChange('impact_title', e.target.value)}
                                                className="w-full bg-transparent text-4xl font-serif font-bold text-center text-emerald-900 outline-none placeholder:text-emerald-900/30"
                                                placeholder="Impact Title"
                                            />
                                            <textarea
                                                value={formState['impact_subtitle'] || ''}
                                                onChange={(e) => handleInputChange('impact_subtitle', e.target.value)}
                                                rows={2}
                                                className="w-full bg-transparent text-lg text-emerald-700/80 text-center outline-none resize-none"
                                                placeholder="Subtitle..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm space-y-2 border border-emerald-100/50">
                                                    <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest block text-center">Stat {i}</label>
                                                    <input
                                                        value={formState[`impact_stat_${i}_val`] || ''}
                                                        onChange={(e) => handleInputChange(`impact_stat_${i}_val`, e.target.value)}
                                                        className="w-full text-4xl font-serif font-bold text-emerald-900 text-center outline-none"
                                                        placeholder="000"
                                                    />
                                                    <input
                                                        value={formState[`impact_stat_${i}_label`] || ''}
                                                        onChange={(e) => handleInputChange(`impact_stat_${i}_label`, e.target.value)}
                                                        className="w-full text-sm font-bold uppercase tracking-wider text-emerald-600 text-center outline-none"
                                                        placeholder="LABEL"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- MEDIA & GALLERY SECTION --- */}
                            {activeTab === 'MEDIA' && (
                                <div className="space-y-8">
                                    {/* Text Content */}
                                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                                        <div className="space-y-4 max-w-2xl">
                                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Section Header</label>
                                            <input
                                                value={formState['media_title'] || ''}
                                                onChange={(e) => handleInputChange('media_title', e.target.value)}
                                                className="w-full bg-transparent text-4xl font-serif font-bold text-white outline-none border-b border-white/10 focus:border-emerald-500 pb-2"
                                                placeholder="Gallery Title"
                                            />
                                            <textarea
                                                value={formState['media_subtitle'] || ''}
                                                onChange={(e) => handleInputChange('media_subtitle', e.target.value)}
                                                rows={2}
                                                className="w-full bg-transparent text-slate-400 outline-none resize-none border-b border-white/10 focus:border-emerald-500 pb-2"
                                                placeholder="Gallery Subtitle..."
                                            />
                                        </div>
                                    </div>

                                    {/* Embedded Gallery Manager (Images) */}
                                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-slate-900">Photo Gallery</h3>
                                            <p className="text-sm text-slate-500">Manage photos displayed in the marquee.</p>
                                        </div>
                                        <GalleryContextWrapper limitType="IMAGE" />
                                    </div>
                                </div>
                            )}

                            {/* --- VIDEOS SECTION --- */}
                            {activeTab === 'VIDEOS' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-slate-900">Video Gallery</h3>
                                            <p className="text-sm text-slate-500">Upload and manage promotional videos.</p>
                                        </div>
                                        <GalleryContextWrapper limitType="VIDEO" />
                                    </div>
                                </div>
                            )}

                            {/* --- COMMUNITY SECTION --- */}
                            {activeTab === 'COMMUNITY' && (
                                <div className="space-y-8">
                                    {/* Header Config */}
                                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] text-center space-y-4">
                                        <div className="flex justify-center">
                                            <input
                                                value={formState['community_badge'] || ''}
                                                onChange={(e) => handleInputChange('community_badge', e.target.value)}
                                                className="bg-white border-2 border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 outline-none focus:border-emerald-300 transition text-center w-48"
                                                placeholder="OUR COMMUNITY"
                                            />
                                        </div>
                                        <input
                                            value={formState['community_title'] || ''}
                                            onChange={(e) => handleInputChange('community_title', e.target.value)}
                                            className="w-full text-4xl font-serif font-bold text-slate-900 text-center outline-none bg-transparent placeholder:opacity-30"
                                            placeholder="Understanding the Need"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Column: The Challenge */}
                                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                                                <input
                                                    value={formState['community_col1_title'] || ''}
                                                    onChange={(e) => handleInputChange('community_col1_title', e.target.value)}
                                                    className="text-2xl font-bold text-rose-900 outline-none w-full placeholder:opacity-30"
                                                    placeholder="The Challenge"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="flex gap-4 items-start">
                                                        <span className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-sm shrink-0 mt-1">{i}</span>
                                                        <textarea
                                                            value={formState[`community_challenge_${i}`] || ''}
                                                            onChange={(e) => handleInputChange(`community_challenge_${i}`, e.target.value)}
                                                            rows={2}
                                                            className="w-full text-slate-600 outline-none resize-none bg-slate-50 focus:bg-white border border-transparent focus:border-rose-200 rounded-xl p-2 transition"
                                                            placeholder={`Challenge point ${i}...`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Column: The Solution */}
                                        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white">
                                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                                <input
                                                    value={formState['community_col2_title'] || ''}
                                                    onChange={(e) => handleInputChange('community_col2_title', e.target.value)}
                                                    className="text-2xl font-bold text-white bg-transparent outline-none w-full placeholder:text-white/30"
                                                    placeholder="The Solution"
                                                />
                                            </div>
                                            <div className="space-y-6 relative z-10">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="flex gap-4 items-start">
                                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0 mt-1">✓</span>
                                                        <div className="flex-1 space-y-2">
                                                            <input
                                                                value={formState[`community_solution_${i}_label`] || ''}
                                                                onChange={(e) => handleInputChange(`community_solution_${i}_label`, e.target.value)}
                                                                className="w-full bg-transparent text-white font-bold outline-none border-b border-white/10 focus:border-emerald-500 pb-1 placeholder:text-white/30"
                                                                placeholder="Bold Label (e.g. Local Access:)"
                                                            />
                                                            <textarea
                                                                value={formState[`community_solution_${i}_text`] || ''}
                                                                onChange={(e) => handleInputChange(`community_solution_${i}_text`, e.target.value)}
                                                                rows={2}
                                                                className="w-full bg-white/5 text-slate-300 outline-none resize-none rounded-xl p-2 focus:bg-white/10 transition text-sm"
                                                                placeholder={`Solution details ${i}...`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- VISUAL EDITOR: FOOTER SECTION --- */}
                            {activeTab === 'FOOTER' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 rounded-[2rem] p-10 text-white">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-400">
                                            <LayoutTemplate className="w-5 h-5" /> Footer Content
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Footer Description</label>
                                            <textarea
                                                value={formState['footer_desc'] || ''}
                                                onChange={(e) => handleInputChange('footer_desc', e.target.value)}
                                                rows={3}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 outline-none focus:border-emerald-500 transition resize-none leading-relaxed"
                                                placeholder="Footer description goes here..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- FALLBACK FOR OTHER TABS --- */}
                            {allTabs.includes(activeTab) && !['HERO', 'ABOUT', 'IMPACT', 'MEDIA', 'COMMUNITY', 'FOOTER'].includes(activeTab) && (
                                <div className="p-8 text-center text-slate-400">
                                    Select a section to edit.
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Internal Wrapper for Gallery Page to fit in CMS
import GalleryPage from "../gallery/page";
function GalleryContextWrapper({ limitType }: { limitType?: string }) {
    return (
        <div className="prose max-w-none">
            {/* We render the GalleryPage but might want to hide its header if possible, 
                or just accept it as a nested section. 
                GalleryPage has its own API fetching logic so it works standalone. */}
            {/* Pass embedded true to hide big headers */}
            <GalleryPage embedded={true} limitType={limitType} />
        </div>
    );
}
