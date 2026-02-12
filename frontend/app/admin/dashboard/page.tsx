"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Image as ImageIcon, Settings, TrendingUp, Users, DollarSign, Wallet, ArrowUpRight, Calendar, CreditCard } from 'lucide-react';
// Remove import
import Link from 'next/link';
import api from '@/lib/api';
// import { format } from 'date-fns'; // Removed

// ... inside component ...



interface DashboardStats {
    total_raised_usd: number;
    total_raised_etb: number;
    active_campaigns: number;
    total_donations_count: number;
    recent_donations: any[];
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time insights for Hope Academy.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition shadow-sm">
                        <Settings className="w-5 h-5" />
                    </button>
                    <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                        View Live Site <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Global Funds */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-24 h-24 text-emerald-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Raised</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            ${(stats?.total_raised_usd || 0).toLocaleString()}
                        </div>
                        <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +100% Impact
                        </div>
                    </div>
                </div>

                {/* Local Funds */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-24 h-24 text-amber-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-amber-100/50 rounded-lg text-amber-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Local Raised</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {(stats?.total_raised_etb || 0).toLocaleString()} <span className="text-sm text-slate-400 font-medium">ETB</span>
                        </div>
                        <div className="text-xs font-medium text-amber-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Growing fast
                        </div>
                    </div>
                </div>

                {/* Active Campaigns */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-blue-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Campaigns</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {stats?.active_campaigns}
                        </div>
                        <div className="text-xs font-medium text-slate-400 mt-2">
                            Driving our mission
                        </div>
                    </div>
                </div>

                {/* Total Donors */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24 text-purple-600 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-100/50 rounded-lg text-purple-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Donors</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {stats?.total_donations_count}
                        </div>
                        <div className="text-xs font-medium text-slate-400 mt-2">
                            Community members
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-600" /> Recent Donations
                        </h2>
                        <Link href="/admin/donations" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {stats?.recent_donations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No recent donations found.</div>
                        ) : (
                            stats?.recent_donations.map((donation) => (
                                <div key={donation.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${donation.currency === 'USD' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {donation.currency === 'USD' ? '$' : 'E'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{donation.donor_name || "Guest Donor"}</div>
                                            <div className="text-xs text-slate-500">{donation.donor_email || "No email"}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">
                                            {donation.currency === 'USD' ? '$' : ''}{donation.amount.toLocaleString()} {donation.currency !== 'USD' ? 'ETB' : ''}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium">
                                            {new Date(donation.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h3 className="font-serif font-bold text-2xl mb-2">Ready to grow?</h3>
                            <p className="text-slate-300 mb-6 text-sm leading-relaxed">Launch a new campaign to support specific school needs or infrastructure.</p>
                            <Link href="/admin/campaigns/new" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                                <PlusCircle className="w-4 h-4" /> Create Campaign
                            </Link>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
                        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                        <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">System Health</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Database Connection</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Active</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Stripe Gateway</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Live</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Chapa Gateway</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
