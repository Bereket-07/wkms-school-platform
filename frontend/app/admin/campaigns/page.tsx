"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCampaigns, Campaign } from "@/lib/api";
import { Plus, Edit2, Trash2, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCampaigns();
                setCampaigns(data);
            } catch (e) {
                console.error("Failed to fetch campaigns", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete campaign: "${title}"?`)) return;

        // TODO: Implement deleteCampaign in api.ts
        alert("Delete functionality coming in next task!");
    };

    if (loading) {
        return <div className="p-12 text-center text-slate-400">Loading campaigns...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Campaigns</h1>
                    <p className="text-slate-500 mt-1">Manage fundraising initiatives</p>
                </div>
                <Link
                    href="/admin/campaigns/new"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> New Campaign
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Progress (USD)</th>
                            <th className="px-6 py-4">Progress (ETB)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    {campaign.is_active ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{campaign.title}</div>
                                    <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{campaign.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Globe className="w-3 h-3 text-sky-500" />
                                        <span>${(campaign.current_raised_usd || 0).toLocaleString()} <span className="text-slate-400">/ ${(campaign.goal_amount_usd || 0).toLocaleString()}</span></span>
                                    </div>
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-2">
                                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((campaign.current_raised_usd || 0) / (campaign.goal_amount_usd || 1)) * 100)}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Users className="w-3 h-3 text-emerald-500" />
                                        <span>{(campaign.current_raised_etb || 0).toLocaleString()} <span className="text-slate-400">/ {(campaign.goal_amount_etb || 0).toLocaleString()}</span></span>
                                    </div>
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-2">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((campaign.current_raised_etb || 0) / (campaign.goal_amount_etb || 1)) * 100)}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="text-slate-400 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign.id, campaign.title)}
                                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {campaigns.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No campaigns found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
