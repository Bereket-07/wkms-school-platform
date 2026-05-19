"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, User as UserIcon } from "lucide-react";

interface User {
    id: string;
    email: string;
    full_name: string | null;
    is_superuser: boolean;
    is_active: boolean;
    created_at: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const getApiUrl = (endpoint: string) => {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && apiUrl.includes('localhost')) {
            apiUrl = '/api/v1';
        } else if (!apiUrl.endsWith('/api/v1') && !apiUrl.endsWith('/api/v1/')) {
            apiUrl = apiUrl.replace(/\/$/, '') + '/api/v1';
        }
        return `${apiUrl}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(getApiUrl('/users/'), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError("Could not load users. Ensure you have super admin privileges.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(getApiUrl('/users/'), {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: newEmail,
                    full_name: newName,
                    is_superuser: false,
                    is_active: true
                })
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create user");
            }
            
            setNewEmail("");
            setNewName("");
            fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to create user");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Are you sure you want to revoke access for this user?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(getApiUrl(`/users/${id}`), {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete user");
            fetchUsers();
        } catch (err) {
            setError("Could not delete user.");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500 mt-2">Manage authorized administrators who can access this dashboard.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Add User Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-emerald-500" />
                            Invite Admin
                        </h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name (Optional)</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                {isCreating ? "Adding..." : "Add User"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading users...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-sm font-bold text-slate-600">User</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-600">Role</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <UserIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{user.full_name || "Unknown"}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_superuser ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                                                        <Shield className="w-3 h-3" />
                                                        Super Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                                                        Admin
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {!user.is_superuser && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Revoke Access"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
