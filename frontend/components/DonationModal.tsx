"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { X, Loader2, CreditCard, Wallet, ChevronRight, ShieldCheck, Lock } from "lucide-react";
import api from "@/lib/api";
import Image from "next/image";

// Make sure to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface DonationModalProps {
    campaignTitle?: string;
    onClose: () => void;
    defaultSuccess?: boolean;
}

interface CheckoutFormProps {
    campaignTitle?: string;
    onClose: () => void;
    amount: string;
    email: string;
    clientSecret: string;
}

const CheckoutForm = ({ campaignTitle, onClose, amount, email, clientSecret }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const returnUrl = new URL(window.location.origin + "/donate");
        if (campaignTitle) {
            returnUrl.searchParams.set("campaign", campaignTitle);
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl.toString(),
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || "An unexpected error occurred.");
            setIsProcessing(false);
        } else {
            // Payment Confirmed by Stripe! Now tell our Backend.
            try {
                const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret!);

                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    await api.post("/donate/stripe/verify", {
                        payment_intent_id: paymentIntent.id,
                        campaign_title: campaignTitle,
                        amount: Number(amount), // Pass amount context
                        donor_email: email // We need to pass email from parent state
                    });
                }
            } catch (err) {
                console.error("Backend verification failed but payment succeeded", err);
            }

            setSuccess(true);
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-10 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100/50">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-lato font-black text-emerald-900 mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">Your donation has been successfully processed and will directly help the children.</p>
                <button onClick={onClose} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-200 transition-all active:scale-95">Close</button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <PaymentElement />
            </div>
            {errorMessage && (
                <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm border border-rose-100 flex items-center gap-2">
                    <X className="w-4 h-4 flex-shrink-0" /> {errorMessage}
                </div>
            )}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
            >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <span className="flex items-center gap-2">Pay Securely <Lock className="w-4 h-4 opacity-50" /></span>
                )}
            </button>
        </form>
    );
};

export default function DonationModal({ campaignTitle, onClose, defaultSuccess = false }: DonationModalProps) {
    const [amount, setAmount] = useState<string>("50");
    const [email, setEmail] = useState<string>("");
    const [gateway, setGateway] = useState<"stripe" | "chapa">("stripe");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loadingSecret, setLoadingSecret] = useState(false);

    // If defaultSuccess is true (e.g. redirected back), render success view immediately
    if (defaultSuccess) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
                <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300 border border-white/20 flex flex-col max-h-[85vh]">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full z-20 hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
                    <div className="text-center py-6 overflow-y-auto">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100/50">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-lato font-black text-emerald-900 mb-2">Thank You!</h3>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto">Your donation was successfully confirmed.</p>
                        <button onClick={onClose} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-200 transition-all active:scale-95">Close</button>
                    </div>
                </div>
            </div>
        )
    }

    const initializePayment = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        // Logic Split: Chapa vs Stripe
        if (gateway === "chapa") {
            // STRICT CHAPA VALIDATION
            if (!email || !email.includes('@')) {
                alert("Please enter a valid email address for Chapa receipt.");
                return;
            }

            setLoadingSecret(true);
            try {
                // Call backend to initialize Chapa
                const response = await api.post("/donate/chapa/initialize", {
                    amount: Number(amount),
                    email: email,
                    first_name: "Guest",
                    last_name: "Donor",
                    campaign_title: campaignTitle
                });

                // Redirect to Chapa
                if (response.data.checkout_url) {
                    window.location.href = response.data.checkout_url;
                }
            } catch (error) {
                console.error("Chapa Error:", error);
                alert("Failed to connect to Chapa. Please try again or use a card.");
            } finally {
                setLoadingSecret(false);
            }
            return;
        }

        // STRIPE LOGIC (No Email Required upfront)
        setLoadingSecret(true);
        try {
            // Call backend to create PaymentIntent
            const response = await api.post("/donate/create-payment-intent", {
                amount: Number(amount),
                currency: "usd",
                // email: "donor@example.com" // Stripe collects this in the Element
            });
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error(error);
            alert("Failed to initialize payment. Please try again.");
        } finally {
            setLoadingSecret(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300 border border-white/20 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-lato font-black text-slate-900">Make a Donation</h2>
                        <p className="text-emerald-600 font-medium text-xs uppercase tracking-wide mt-1">
                            {campaignTitle ? `For: ${campaignTitle}` : "For: General School Fund"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition shadow-sm border border-transparent hover:border-slate-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {!clientSecret ? (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                            {/* Amount Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Amount</label>
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {["25", "50", "100", "250"].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`py-3 rounded-xl font-bold border-2 transition-all duration-200 ${amount === val
                                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-white'}`}
                                        >
                                            {gateway === 'stripe' ? '$' : 'ETB '}{val}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-emerald-500 transition-colors">
                                        {gateway === 'stripe' ? '$' : 'ETB'}
                                    </span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-16 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 font-bold text-xl transition-all"
                                        placeholder="Enter custom amount"
                                    />
                                </div>
                            </div>

                            {/* Gateway Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setGateway("stripe")}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${gateway === 'stripe'
                                            ? 'border-indigo-500 bg-indigo-50/50 shadow-lg ring-1 ring-indigo-500'
                                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${gateway === 'stripe' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'}`}>
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">Card Payment</div>
                                            <div className="text-xs text-slate-500">Stripe (USD)</div>
                                        </div>
                                        {gateway === 'stripe' && (
                                            <div className="absolute top-2 right-2 text-indigo-500">
                                                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_0_2px_white]" />
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        onClick={() => setGateway("chapa")}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${gateway === 'chapa'
                                            ? 'border-emerald-500 bg-emerald-50/50 shadow-lg ring-1 ring-emerald-500'
                                            : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${gateway === 'chapa' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}>
                                            <Wallet className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">Local Payment</div>
                                            <div className="text-xs text-slate-500">Chapa (ETB)</div>
                                        </div>
                                        {gateway === 'chapa' && (
                                            <div className="absolute top-2 right-2 text-emerald-500">
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_0_2px_white]" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CONDITIONAL: Email Input ONLY for Chapa */}
                            {gateway === 'chapa' && (
                                <div className="space-y-3 animate-in slide-in-from-top-2">
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2 items-start text-xs text-amber-700">
                                        <div className="mt-0.5"><Lock className="w-3 h-3" /></div>
                                        <p>Email is required for Chapa digital receipts.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={initializePayment}
                                disabled={loadingSecret}
                                className={`w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-70 flex justify-center items-center gap-2 group transform active:scale-[0.98] ${gateway === 'chapa'
                                    ? 'bg-emerald-600 shadow-emerald-200'
                                    : 'bg-slate-900 shadow-slate-200'
                                    }`}
                            >
                                {loadingSecret ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Continue with {gateway === 'chapa' ? 'Chapa' : 'Stripe'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            {/* Payment Methods Banner within Stripe Flow */}
                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6 flex flex-col gap-2">
                                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide">We accept</div>
                                <div className="flex flex-wrap gap-2 opacity-80">
                                    <span className="bg-white border border-indigo-100 px-2 py-1 rounded text-xs font-bold text-slate-600 flex items-center gap-1">💳 Cards</span>
                                    <span className="bg-white border border-indigo-100 px-2 py-1 rounded text-xs font-bold text-orange-600 flex items-center gap-1">🛒 Amazon</span>
                                    <span className="bg-white border border-indigo-100 px-2 py-1 rounded text-xs font-bold text-green-600 flex items-center gap-1">💲 CashApp</span>
                                    <span className="bg-white border border-indigo-100 px-2 py-1 rounded text-xs font-bold text-blue-600 flex items-center gap-1">₿ Crypto</span>
                                </div>
                            </div>

                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setClientSecret(null)}
                                        className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                                    >
                                        ← Back to options
                                    </button>
                                </div>
                                <CheckoutForm
                                    campaignTitle={campaignTitle}
                                    onClose={onClose}
                                    amount={amount}
                                    email={email}
                                    clientSecret={clientSecret!}
                                />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
