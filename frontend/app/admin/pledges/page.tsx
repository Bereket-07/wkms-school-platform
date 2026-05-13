"use client";

import { useEffect, useState, useCallback } from "react";
import api, { getCampaigns, Campaign } from "@/lib/api";
import { DollarSign, Calendar, Mail, CheckCircle, Clock, Filter, XCircle } from "lucide-react";

interface Pledge {
    id: string;
    donor_name: string;
    donor_email: string;
    amount?: number;
    currency?: string;
    campaign_title?: string;
    contacted: boolean;
    created_at: string;
}

export default function PledgesPage() {
    const [pledges, setPledges] = useState<Pledge[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [selectedCampaign, setSelectedCampaign] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const fetchPledges = useCallback(async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (selectedCampaign) params.append("campaign_id", selectedCampaign);
            if (statusFilter !== "") params.append("contacted", statusFilter);
            if (startDate) params.append("start_date", new Date(startDate).toISOString());
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                params.append("end_date", end.toISOString());
            }

            const [pledgesRes, campaignsRes] = await Promise.all([
                api.get(`/pledges/?${params.toString()}`),
                getCampaigns()
            ]);
            setPledges(pledgesRes.data);
            setCampaigns(campaignsRes);
        } catch (e) {
            console.error("Failed to fetch pledges", e);
        } finally {
            setLoading(false);
        }
    }, [selectedCampaign, statusFilter, startDate, endDate]);

    useEffect(() => {
        fetchPledges();
    }, [fetchPledges]);

    const handleToggleContacted = async (pledgeId: string, currentStatus: boolean) => {
        try {
            await api.put(`/pledges/${pledgeId}/contacted`, { contacted: !currentStatus }, {
                params: { contacted: !currentStatus } // pass as query param if the endpoint expects it, or body if pydantic model. The endpoint defined takes `contacted: bool` as query param since it wasn't a Pydantic model. Let's pass as query param.
            });
            // Update local state
            setPledges(pledges.map(p => p.id === pledgeId ? { ...p, contacted: !currentStatus } : p));
        } catch (e) {
            console.error("Failed to update status", e);
            alert("Failed to update contacted status");
        }
    };

    if (loading && pledges.length === 0) {
        return <div className="p-12 text-center text-slate-400">Loading pledges...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Pledges</h1>
                    <p className="text-slate-500 mt-1">Track donor intent while waiting for payment gateways</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-emerald-50 px-4 py-2 rounded-lg text-emerald-700 font-bold border border-emerald-100 flex items-center gap-2 shadow-sm whitespace-nowrap">
                        <DollarSign className="w-5 h-5" />
                        <span>Total (USD): ${pledges.filter(p => p.currency === 'USD').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-lg text-amber-700 font-bold border border-amber-100 flex items-center gap-2 shadow-sm whitespace-nowrap">
                        <span>Total (ETB): {pledges.filter(p => p.currency === 'ETB').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter className="w-4 h-4" /> Filters:
                </div>
                
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Contacted</option>
                    <option value="false">Pending Follow-up</option>
                </select>

                <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs"
                >
                    <option value="">All Campaigns</option>
                    {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>

                <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center px-3 border-r border-slate-200">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent px-2 py-1.5 text-sm outline-none"
                        />
                    </div>
                    <div className="flex items-center px-3">
                        <span className="text-slate-400 text-xs mr-2">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent px-2 py-1.5 text-sm outline-none"
                        />
                    </div>
                </div>

                {(selectedCampaign || statusFilter !== "" || startDate || endDate) && (
                    <button
                        onClick={() => {
                            setSelectedCampaign("");
                            setStatusFilter("");
                            setStartDate("");
                            setEndDate("");
                        }}
                        className="text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1"
                    >
                        <XCircle className="w-4 h-4" /> Clear Filters
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Pledged Amount</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pledges.map((pledge) => (
                            <tr key={pledge.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleToggleContacted(pledge.id, pledge.contacted)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors hover:shadow-sm ${
                                            pledge.contacted 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                        }`}
                                    >
                                        {pledge.contacted ? (
                                            <><CheckCircle className="w-3.5 h-3.5" /> Contacted</>
                                        ) : (
                                            <><Clock className="w-3.5 h-3.5" /> Pending Follow-up</>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 text-lg">
                                        {pledge.amount ? `${pledge.currency === 'USD' ? '$' : 'Br '}${pledge.amount.toLocaleString()}` : 'Optional'}
                                    </div>
                                    <div className="text-xs text-slate-400 uppercase">{pledge.currency}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${pledge.campaign_title && pledge.campaign_title !== "General Support" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                        {pledge.campaign_title || "General Support"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900 font-medium">{pledge.donor_name}</div>
                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {pledge.donor_email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(pledge.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 ml-6">
                                        {new Date(pledge.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pledges.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-500">
                        No pledges found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
