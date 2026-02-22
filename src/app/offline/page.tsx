import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-sm space-y-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mx-auto">
          <WifiOff className="w-10 h-10 text-amber-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">You&apos;re offline</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No internet connection. Please check your network and try again.
            Your data is safe and will sync when you&apos;re back online.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors w-full"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:bg-muted w-full"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-amber-600">HisaabAI</span> — your
          data is always stored securely
        </p>
      </div>
    </div>
  );
}
