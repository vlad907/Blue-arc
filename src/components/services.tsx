import React from "react";

const Icon = ({ name }: { name: "computer" | "wifi" | "server" | "camera" }) => {
  const common = "h-5 w-5 shrink-0";
  switch (name) {
    case "computer":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm6 12h4a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2Z"/>
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-7-7a11 11 0 0 1 14 0 1 1 0 1 0 1.41-1.41 13 13 0 0 0-16.82 0A1 1 0 0 0 5 13Zm3.5-3.5a7 7 0 0 1 7 0A1 1 0 1 0 16.91 8 9 9 0 0 0 7.09 8 1 1 0 1 0 8.5 9.5Z"/>
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm0 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3Z"/>
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M9 4a1 1 0 0 0-.8.4L6.5 6H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-1.5L15.8 4.4A1 1 0 0 0 15 4H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 11Z"/>
        </svg>
      );
  }
};

function Card({
  icon,
  title,
  blurb,
  bullets,
}: {
  icon: "computer" | "wifi" | "server" | "camera";
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition">
      <div className="mb-4 flex items-start gap-3 min-h-[2.5rem]">
        <span className="mt-0.5 inline-flex h-10 w-10 flex-none aspect-square items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-inset ring-blue-400/30 leading-none">
          <Icon name={icon} />
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] leading-tight">{title}</h3>
      </div>
      <p className="text-neutral-200/90 leading-relaxed">
        {blurb}
      </p>
      <ul className="mt-4 space-y-2 text-neutral-200">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400/80 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-white/10" />
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative isolate overflow-hidden bg-neutral-950 py-16 sm:py-24 lg:py-28">
      {/* background accents */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-950/30 via-neutral-950 to-neutral-950" />
      <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-neutral-300/90">
          Practical, reliable help for homes and small businesses—delivered with Blue Arc polish.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Card
            icon="computer"
            title="Computer Repair & Troubleshooting"
            blurb="Whether your computer is running slow, crashing, or just not working right—we can fix it. Fast and friendly service for both hardware and software issues."
            bullets={[
              "Fix slow or unresponsive computers",
              "Remove viruses, malware, and pop-ups",
              "Set up new desktops, laptops, monitors, or printers",
              "Fix boot issues, blue screens, and driver problems",
            ]}
          />

          <Card
            icon="wifi"
            title="Better Wi‑Fi, Faster Internet, and Secure Networking"
            blurb="Tired of slow internet or dead zones? We’ll boost your Wi‑Fi signal, secure your network, and help you connect reliably—at home or in the office."
            bullets={[
              "Fix dropped signals or slow Wi‑Fi",
              "Set up routers, switches, and access points",
              "Configure secure business networks",
              "Enable remote work or VPN connections",
            ]}
          />

          <Card
            icon="server"
            title="Server Setup, Management & Troubleshooting"
            blurb="We handle everything from setting up servers to keeping them running securely and efficiently. Whether it’s Windows Server, file shares, or user permissions—we’ve got it covered."
            bullets={[
              "Set up and configure Windows and Linux servers",
              "Manage Active Directory, users, and group policies",
              "File server setup and network shares",
              "Firewall and port configuration",
              "Troubleshoot server errors and crashes",
            ]}
          />

          <Card
            icon="camera"
            title="Business Audio/Video Installation and Troubleshooting"
            blurb="Need help setting up speakers, security cameras, or TVs? We install, configure, and troubleshoot audio/video systems so everything works like it should—without the headache."
            bullets={[
              "Complex video streaming setups",
              "Video wall setup and maintenance",
              "Help with HDMI, streaming, or signal issues",
              "Connect and configure security cameras (analog or IP)",
            ]}
          />
        </div>
      </div>

      {/* top divider echoing hero curve */}
      <div className="pointer-events-none absolute inset-x-0 -top-12 h-12 overflow-hidden">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-neutral-950/60">
          <path d="M0,32 C180,64 360,0 540,16 C720,32 900,80 1080,64 C1260,48 1350,40 1440,48 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}