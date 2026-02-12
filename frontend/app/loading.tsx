export default function Loading() {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-emerald-900 text-xs">
                        W
                    </div>
                </div>
                <p className="text-emerald-900 font-medium animate-pulse text-sm tracking-widest uppercase">
                    Loading
                </p>
            </div>
        </div>
    );
}
