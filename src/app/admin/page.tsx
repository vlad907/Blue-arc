import { notFound } from "next/navigation";
import AdminUploadForm from "./AdminUploadForm";
import AdminTrustedForm from "./AdminTrustedForm";

export default function AdminPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl space-y-16 px-4">
        <section>
          <h1 className="text-2xl font-bold text-white">Project Upload</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Add project photos and metadata. Saves to{" "}
            <code className="rounded bg-neutral-800 px-1">/public/projects/</code> and{" "}
            <code className="rounded bg-neutral-800 px-1">/data/projects.json</code>
          </p>
          <AdminUploadForm />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">Trusted By Companies</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Add company logos for the Trusted By section. Saves to{" "}
            <code className="rounded bg-neutral-800 px-1">/public/logos/</code> and{" "}
            <code className="rounded bg-neutral-800 px-1">/data/trusted.json</code>
          </p>
          <AdminTrustedForm />
        </section>
      </div>
    </div>
  );
}
