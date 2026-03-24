import React from "react";

const Icon = ({ name }: { name: "computer" | "wifi" | "server" | "camera" | "cabling" | "av" }) => {
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
    case "cabling":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Zm7-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Zm7-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Zm0 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z"/>
        </svg>
      );
    case "av":
      return (
        <svg viewBox="0 0 24 24" width={20} height={20} className={common} fill="currentColor" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm4 3a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"/>
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
  icon: "computer" | "wifi" | "server" | "camera" | "cabling" | "av";
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:border-white/15 transition">
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
          Professional IT, networking, cabling, and surveillance solutions for businesses, job sites, and modern commercial spaces.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card
            icon="computer"
            title="Managed IT & Computer Support"
            blurb="Onsite IT support and troubleshooting for business workstations, desktops, and peripherals. Stable systems, reduced downtime, and reliable connectivity in office and commercial environments."
            bullets={[
              "Workstation setup, repair, and maintenance",
              "Virus removal, malware remediation, and security hardening",
              "Software configuration and troubleshooting",
              "Printer, scanner, and peripheral setup",
            ]}
          />
          <Card
            icon="wifi"
            title="Network Design & Wi-Fi Solutions"
            blurb="Onsite network design and Wi-Fi deployment for offices, retail, and job sites. Reliable connectivity through properly placed access points, VLANs, and secure segmentation."
            bullets={[
              "Wi-Fi surveys, design, and access point deployment",
              "Router, switch, and firewall configuration",
              "Secure business networks and VLAN segmentation",
              "Remote access and VPN setup",
            ]}
          />

          <Card
            icon="server"
            title="Server & Infrastructure Support"
            blurb="Onsite server setup, management, and troubleshooting. Stable infrastructure with Active Directory, file shares, and backups—built for reduced downtime in business environments."
            bullets={[
              "Windows Server and Linux server setup",
              "Active Directory, users, and group policies",
              "File server and network share configuration",
              "Backup, disaster recovery, and monitoring",
            ]}
          />

          <Card
            icon="camera"
            title="Surveillance Systems"
            blurb="Onsite IP and analog camera installation with NVR/DVR recording and remote viewing. Clean installations for business property and site monitoring."
            bullets={[
              "IP and analog camera installation",
              "NVR/DVR setup and remote viewing",
              "Site survey and camera placement",
              "Integration with existing security systems",
            ]}
          />
          <Card
            icon="cabling"
            title="Structured Cabling"
            blurb="Onsite Cat6 and fiber installations for workstations, PoE devices, and network infrastructure. Clean termination, labeling, and organized rack routing for reliable connectivity."
            bullets={[
              "Cat6 and fiber cable runs",
              "Patch panels and rack installation",
              "Cable organization and labeling",
              "PoE and low-voltage drops",
            ]}
          />
          <Card
            icon="av"
            title="Audio / Video & Smart Systems"
            blurb="Onsite commercial display and video wall installation for conference rooms, lobbies, and retail. Clean installations and stable AV systems for business environments."
            bullets={[
              "Commercial display and video wall installation",
              "Meeting room and conference AV setup",
              "HDMI, streaming, and signal troubleshooting",
              "Smart building and control integrations",
            ]}
          />
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-900/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition"
          >
            Request Service
          </a>
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