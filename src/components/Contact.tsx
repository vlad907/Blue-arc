"use client";
import React, { useState } from "react";

type Props = {
  title?: string;
  subtitle?: string;
};

const Contact: React.FC<Props> = ({
  title = "Serving Chico and Northern California with Reliable IT Help",
  subtitle = "Tell us what you need help with. We’ll reply quickly.",
}) => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      // Optional: if you add an API route later, this will work out of the box.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send. Please try again.");
      setStatus("sent");
      e.currentTarget.reset();
    } catch (err: unknown) {
      // Fallback: open mail client if API route isn't available
      try {
        const params = new URLSearchParams({
          subject: "Website Contact — Blue Arc Networks",
          body:
            `Name: ${payload.name || ""}\n` +
            `Email: ${payload.email || ""}\n` +
            `Phone: ${payload.phone || ""}\n` +
            `Company: ${payload.company || ""}\n` +
            `Service: ${payload.service || ""}\n\n` +
            `${payload.message || ""}`,
        });
        window.location.href = `mailto:info@bluearcnetworks.com?${params.toString()}`;
        setStatus("sent");
      } catch (innerErr: unknown) {
        setStatus("error");
        const msg =
          innerErr instanceof Error
            ? innerErr.message
            : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setErrorMsg(msg);
      }
    }
  }

  return (
    <section id="contact" className="relative isolate bg-neutral-950 py-16 sm:py-20">
      {/* Background that harmonizes with the rest of the site but is distinct */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.9]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(90rem 40rem at 15% 10%, rgba(56,189,248,0.08) 0%, rgba(2,6,23,0) 60%), radial-gradient(70rem 35rem at 100% 100%, rgba(34,197,94,0.06) 0%, rgba(2,6,23,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.15]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Copy & Details */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-neutral-300">{subtitle}</p>

            <ul className="mt-6 space-y-3 text-neutral-200">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-none text-sky-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.75 3a.75.75 0 0 0-.75.75V5a.75.75 0 0 0 .75.75h10.5A.75.75 0 0 0 18 5V3.75a.75.75 0 0 0-.75-.75H6.75zM4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75V18A2.25 2.25 0 0 1 17.25 20.25H6.75A2.25 2.25 0 0 1 4.5 18V6.75zM8.25 9a.75.75 0 0 0-.75.75v6a.75.75 0 1 0 1.5 0v-6A.75.75 0 0 0 8.25 9zm3.75 0a.75.75 0 0 0-.75.75v6a.75.75 0 1 0 1.5 0v-6a.75.75 0 0 0-.75-.75zm3.75 0a.75.75 0 0 0-.75.75v6a.75.75 0 1 0 1.5 0v-6a.75.75 0 0 0-.75-.75z"/>
                </svg>
                Mon–Fri 9am–5pm
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-none text-sky-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2.25 6.75a.75.75 0 0 1 .75-.75h2.37a1.5 1.5 0 0 1 1.48 1.22l.44 2.2a1.5 1.5 0 0 1-.43 1.39l-1.1 1.1a12.06 12.06 0 0 0 5.82 5.82l1.1-1.1a1.5 1.5 0 0 1 1.39-.43l2.2.44a1.5 1.5 0 0 1 1.22 1.48v2.37a.75.75 0 0 1-.75.75h-1.5C8.41 21 3 15.59 3 9.75v-1.5z"/>
                </svg>
                <a href="tel:+15302089290" className="hover:underline">(530) 208-9290</a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-none text-sky-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.25c-3.866 0-7 3.03-7 6.75 0 5.25 7 12.75 7 12.75s7-7.5 7-12.75c0-3.72-3.134-6.75-7-6.75zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                Chico, CA
              </li>
            </ul>

            <a
              href="#pricing"
              className="mt-6 inline-flex items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
            >
              Pricing
            </a>

            {/* Map */}
            <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Chico, CA Map"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12626.51196091642!2d-121.848!3d39.728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80913f3f3a5a9f7f%3A0x8a0d9a54f0b3a9e2!2sChico%2C%20CA!5e0!3m2!1sen!2sus!4v1710000000000"
              />
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Contact Us</h3>
            <p className="mt-1 text-neutral-300">We’ll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="block text-sm text-neutral-300">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="Your full name"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="email" className="block text-sm text-neutral-300">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="you@company.com"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="phone" className="block text-sm text-neutral-300">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="(530) 555‑1234"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="company" className="block text-sm text-neutral-300">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="Business / Organization"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="service" className="block text-sm text-neutral-300">Service</label>
                <select
                  id="service"
                  name="service"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  defaultValue="General Question"
                >
                  <option>General Question</option>
                  <option>Computer Repair</option>
                  <option>Networking &amp; Wi‑Fi</option>
                  <option>Server &amp; AD Setup</option>
                  <option>Security Cameras / AV</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm text-neutral-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  placeholder="Briefly describe your issue or request…"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
                {status === "sent" && (
                  <span className="text-sm text-emerald-400">Thanks! We’ll be in touch shortly.</span>
                )}
                {status === "error" && (
                  <span className="text-sm text-rose-400">Error: {errorMsg || "Please try again."}</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
