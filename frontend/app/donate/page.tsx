"use client";

import { useEffect, useState, Suspense } from "react";
import { getCampaigns, Campaign, getSiteContent } from "@/lib/api";
import api from "@/lib/api";
import { Globe, Users, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

import DonationModal from "@/components/DonationModal";

function DonationStatusListener({ onPaymentSuccess }: { onPaymentSuccess: (campaign?: string) => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const verifyChapa = async () => {
            const redirectStatus = searchParams.get("redirect_status");
            const txRef = searchParams.get("tx_ref");

            if (redirectStatus === "succeeded" && txRef) {
                setVerifying(true);
                try {
                    // Verify with backend to update DB
                    await api.get(`/donate/chapa/verify/${txRef}`);

                    const campaign = searchParams.get("campaign") || undefined;
                    onPaymentSuccess(campaign);
                } catch (error) {
                    console.error("Verification failed", error);
                    // Still show success -> webhook will likely fix the DB later
                    const campaign = searchParams.get("campaign") || undefined;
                    onPaymentSuccess(campaign);
                } finally {
                    // Clean up URL
                    router.replace("/donate", { scroll: false });
                    setVerifying(false); // Quick fade out handled by UI if needed
                }
            }
        }

        verifyChapa();
    }, [searchParams, router, onPaymentSuccess]);

    if (verifying) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold">Verifying Donation...</h2>
                <p className="text-slate-300">Please wait a moment.</p>
            </div>
        );
    }

    return null;
}

export default function DonatePage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                const [campaignsData, contentData] = await Promise.all([
                    getCampaigns(),
                    getSiteContent()
                ]);
                setCampaigns(campaignsData);

                const contentMap: Record<string, string> = {};
                contentData.forEach(item => {
                    contentMap[item.key] = item.content;
                });
                setContent(contentMap);

            } catch (error) {
                console.error("Failed to load campaigns", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCampaigns();
    }, []);

    // Helper to safely get content or fallback
    const _t = (key: string, fallback: string = "") => content[key] || fallback;

    const openDonationModal = (campaignTitle?: string) => {
        setSelectedCampaign(campaignTitle);
        setIsSuccessModal(false);
        setIsModalOpen(true);
    };

    const handlePaymentSuccess = (campaignTitle?: string) => {
        setSelectedCampaign(campaignTitle);
        setIsSuccessModal(true);
        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen font-sans bg-slate-50 relative overflow-hidden pt-24 pb-24">
            <Suspense fallback={null}>
                <DonationStatusListener onPaymentSuccess={handlePaymentSuccess} />
            </Suspense>

            {/* Light Glassmorphism Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/80 to-slate-50 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[80px] pointer-events-none" />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <DonationModal
                        campaignTitle={selectedCampaign}
                        defaultSuccess={isSuccessModal}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            <section className="relative px-6 md:px-12 z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest shadow-sm"
                        >
                            <Sparkles className="w-3 h-3 text-emerald-500" /> {_t('donate_badge', "Support Our Mission")}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight"
                        >
                            {_t('donate_title_1', "Invest in a")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{_t('donate_title_accent', "Child's Future")}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            {_t('donate_subtitle', "Every contribution directly funds education, nutrition, and essential school infrastructure.")}
                        </motion.p>
                    </div>

                    {/* FEATURED: GENERAL FUND DONATION */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-20 rounded-[2.5rem] overflow-hidden relative shadow-2xl group"
                    >
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                                alt="General Fund"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                        </div>

                        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                            <div className="max-w-xl space-y-6">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                                    General School Fund
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Support the school's most critical daily needs. Your donation provides flexibility to address immediate challenges, pay teachers, and maintain facilities.
                                </p>
                                <div className="flex items-center gap-4 text-emerald-400 font-bold text-sm uppercase tracking-wide">
                                    <Sparkles className="w-5 h-5" /> Area of Greatest Need
                                </div>
                            </div>

                            <button
                                onClick={() => openDonationModal()}
                                className="bg-white text-emerald-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex-shrink-0 flex items-center gap-3"
                            >
                                <Heart className="w-6 h-6 text-emerald-600 fill-emerald-600" /> Donate to School
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <h2 className="text-xl font-serif font-bold text-slate-400 uppercase tracking-widest text-center">Specific Campaigns</h2>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[1, 2].map(i => (
                                <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-slate-100 shadow-sm"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {campaigns.map((campaign, idx) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] shadow-xl transition-all duration-500"
                                >

                                    {/* Image Area - Taller and Glamorous */}
                                    <div className="h-72 relative bg-slate-100 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent z-10" />
                                        <img
                                            src={campaign.cover_image_url || "https://images.unsplash.com/photo-1427504743050-dad1d8d1e9fb?auto=format&fit=crop&q=80"}
                                            alt={campaign.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-6 left-6 z-20">
                                            <span className="bg-white/95 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border border-emerald-50">
                                                Active Campaign
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 relative">
                                        <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">{campaign.title}</h3>
                                        <p className="text-slate-600 mb-8 line-clamp-2 leading-relaxed text-base">{campaign.description}</p>

                                        {/* Progress Section */}
                                        <div className="space-y-6">
                                            {/* Global Goal */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2 text-sky-600 font-bold text-sm uppercase tracking-wide">
                                                        <Globe className="w-4 h-4" /> Global Goal
                                                    </div>
                                                    <div className="text-slate-900 font-bold">
                                                        ${(campaign.current_raised_usd || 0).toLocaleString()} <span className="text-slate-400 text-sm font-normal">/ ${(campaign.goal_amount_usd || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                    <div className="bg-sky-500 h-full rounded-full shadow-sm" style={{ width: `${Math.min(100, ((campaign.current_raised_usd || 0) / (campaign.goal_amount_usd || 1)) * 100)}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Local Goal - Smaller */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end text-sm">
                                                    <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wide">
                                                        <Users className="w-4 h-4" /> Local Goal (ETB)
                                                    </div>
                                                    <div className="text-slate-700 font-medium">
                                                        {(campaign.current_raised_etb || 0).toLocaleString()} <span className="text-slate-400 font-normal">/ ${(campaign.goal_amount_etb || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-emerald-500 h-full rounded-full shadow-sm" style={{ width: `${Math.min(100, ((campaign.current_raised_etb || 0) / (campaign.goal_amount_etb || 1)) * 100)}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-6">
                                                <button
                                                    onClick={() => openDonationModal(campaign.title)}
                                                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.98]"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        Donate Now <Heart className="w-5 h-5 fill-white/0 group-hover/btn:fill-white transition-colors duration-300" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
