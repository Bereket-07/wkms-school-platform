"use client";

import { useEffect, useState } from "react";
import api, { getDonations, Donation, getCampaigns, Campaign } from "@/lib/api";
import { Loader2, DollarSign, Calendar, CreditCard, CheckCircle, XCircle, Clock, Filter } from "lucide-react";

export default function DonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [donationsData, campaignsData] = await Promise.all([
                    getDonations(0, 100, selectedCampaign || undefined),
                    getCampaigns()
                ]);
                setDonations(donationsData);
                // Only set campaigns once if not already loaded, but doing it here ensures fresh list.
                // Optimization: could move getCampaigns out of dependency array if we want.
                setCampaigns(campaignsData);
            } catch (e) {
                console.error("Failed to fetch data", e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedCampaign]);

    if (loading) {
        return <div className="p-12 text-center text-slate-400">Loading donation history...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Donations</h1>
                    <p className="text-slate-500 mt-1">Track incoming contributions and transaction status</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none min-w-[200px] w-full"
                        >
                            <option value="">All Campaigns</option>
                            <option value="general">General Donations (No Campaign)</option>
                            <optgroup label="Specific Campaigns">
                                {campaigns.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-emerald-50 px-4 py-2 rounded-lg text-emerald-700 font-bold border border-emerald-100 flex items-center gap-2 shadow-sm whitespace-nowrap">
                            <DollarSign className="w-5 h-5" />
                            <span>Total: ${donations.filter(d => d.currency === 'USD' || d.currency === 'usd').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-amber-50 px-4 py-2 rounded-lg text-amber-700 font-bold border border-amber-100 flex items-center gap-2 shadow-sm whitespace-nowrap">
                            <span className="text-lg">ETB</span>
                            <span>Total: {donations.filter(d => d.currency === 'ETB' || d.currency === 'etb').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Gateway</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {donations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2 items-start">
                                        {donation.status === 'SUCCESS' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                <CheckCircle className="w-3 h-3" /> Success
                                            </span>
                                        )}
                                        {donation.status === 'PENDING' && (
                                            <>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </span>
                                                {donation.payment_gateway === 'CHAPA' && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const txRef = (donation as any).transaction_id; // Cast if type incomplete
                                                                if (!txRef) return alert("No transaction ID found");

                                                                const res = await api.get(`/donate/chapa/verify/${txRef}`);
                                                                if (res.data.status === 'success') {
                                                                    alert("Verified Successfully! updating...");
                                                                    window.location.reload();
                                                                } else {
                                                                    alert("Verification checked but status is still: " + res.data.status);
                                                                }
                                                            } catch (e: any) {
                                                                alert("Verification failed: " + (e.response?.data?.detail || e.message));
                                                            }
                                                        }}
                                                        className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-700 transition"
                                                    >
                                                        Check Status
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {donation.status === 'FAILED' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                                <XCircle className="w-3 h-3" /> Failed
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 text-lg">
                                        {donation.currency === 'usd' ? '$' : 'ETB '}
                                        {donation.amount.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-400 uppercase">{donation.currency}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${donation.campaign_title && donation.campaign_title !== "General Donation" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                        {donation.campaign_title || "General Donation"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900 font-medium">{donation.donor_name || "Anonymous Donor"}</div>
                                    <div className="text-sm text-slate-500">{donation.donor_email || "-"}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-2 text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs font-medium uppercase">
                                        <CreditCard className="w-3 h-3" /> {donation.payment_gateway}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(donation.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs ml-6">{new Date(donation.created_at).toLocaleTimeString()}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {donations.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No donations found yet.
                    </div>
                )}
            </div>
        </div>
    );
}
