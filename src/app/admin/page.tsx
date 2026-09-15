import { notFound } from "next/navigation";
import { isAdminApiEnabled } from "@/lib/admin-env";
import AdminProjectsSection from "./AdminProjectsSection";
import AdminTrustedSection from "./AdminTrustedSection";

export default function AdminPage() {
  if (!isAdminApiEnabled()) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl space-y-16 px-4">
        <section>
          <h1 className="text-2xl font-bold text-white">Job posts (projects)</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Add, edit, or delete project highlights. Saves to{" "}
            <code className="rounded bg-neutral-800 px-1">/public/projects/</code> and{" "}
            <code className="rounded bg-neutral-800 px-1">/data/projects.json</code>
          </p>
          <AdminProjectsSection />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">Trusted By Companies</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Add, edit, or delete logos for the Trusted By section. Saves to{" "}
            <code className="rounded bg-neutral-800 px-1">/public/logos/</code> and{" "}
            <code className="rounded bg-neutral-800 px-1">/data/trusted.json</code>
          </p>
          <AdminTrustedSection />
        </section>
      </div>
    </div>
  );
}
