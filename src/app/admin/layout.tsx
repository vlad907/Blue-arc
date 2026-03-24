import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-white/10 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            ← Back to site
          </Link>
          <span className="text-xs text-amber-500/90">Dev only</span>
        </div>
      </header>
      {children}
    </div>
  );
}
