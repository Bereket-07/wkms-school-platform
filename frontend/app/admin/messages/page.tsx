"use client";

import { useEffect, useState } from "react";
import { getContactMessages, updateContactMessage, deleteContactMessage, ContactMessage } from "@/lib/api";
import { Mail, Clock, Search, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        async function fetchMessages() {
            try {
                const data = await getContactMessages();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, []);

    const toggleRead = async (id: string, currentStatus: boolean) => {
        try {
            await updateContactMessage(id, !currentStatus);
            setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, is_read: !currentStatus } : msg));
        } catch (error) {
            console.error("Failed to update read status", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteContactMessage(id);
            setMessages(prev => prev.filter(msg => msg.id !== id));
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    const filteredMessages = messages
        .filter(msg => {
            if (filter === 'unread') return !msg.is_read;
            if (filter === 'read') return msg.is_read;
            return true;
        })
        .filter(msg =>
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
                    <p className="text-slate-500">View and manage inquiries from the website</p>
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-px">
                {(['all', 'unread', 'read'] as const).map((t) => {
                    const count = messages.filter(m => {
                        if (t === 'unread') return !m.is_read;
                        if (t === 'read') return m.is_read;
                        return true;
                    }).length;
                    return (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 capitalize transition-colors ${
                                filter === t 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {t} ({count})
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredMessages.length > 0 ? (
                <div className="grid gap-4">
                    {filteredMessages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{msg.name}</h3>
                                            {!msg.is_read && (
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="New Message"></span>
                                            )}
                                        </div>
                                        <a href={`mailto:${msg.email}`} className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {msg.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                    <Clock className="w-3 h-3" />
                                    {msg.created_at ? format(new Date(msg.created_at), "MMM d, yyyy h:mm a") : "Unknown Date"}
                                </div>
                            </div>

                            {msg.subject && (
                                <div className="mb-2 font-medium text-slate-800">
                                    Subject: {msg.subject}
                                </div>
                            )}

                            <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg">
                                {msg.message}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 justify-end items-center">
                                <button
                                    onClick={() => toggleRead(msg.id!, !!msg.is_read)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                                        msg.is_read 
                                            ? 'text-slate-500 hover:text-slate-700 bg-white border-slate-200 hover:bg-slate-50' 
                                            : 'text-emerald-700 hover:text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                    {msg.is_read ? (
                                        <>
                                            <EyeOff className="w-3.5 h-3.5" /> Mark as Unread
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-3.5 h-3.5" /> Mark as Read
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(msg.id!)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">No messages found</h3>
                    <p className="text-slate-500 text-sm">You haven't received any inquiries yet.</p>
                </div>
            )}
        </div>
    );
}
