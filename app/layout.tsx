import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { Playful } from "@/components/Playful";
import { profile } from "@/content/profile";
import "./globals.css";

// next/font downloads these at build time and serves them from our own domain.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"], // latin-ext carries the ₹ glyph
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const { identity, site, contact } = profile;
const description = `${site.brandStory} ${identity.title} @ ${identity.company}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${identity.name} — ${identity.headline.join(" ")}`,
    template: `%s — ${identity.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: identity.name,
    title: `${identity.name} — ${identity.headline.join(" ")}`,
    description,
  },
  twitter: { card: "summary_large_image", title: identity.name, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefdf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1d38" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.title,
  url: site.url,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Vellore Institute of Technology" },
  worksFor: { "@type": "Organization", name: identity.company },
  sameAs: [contact.linkedin, contact.github],
};

// Runs before first paint: applies the saved theme and shows the loader on a first visit only.
const boot = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(!localStorage.getItem("seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.loader="1";localStorage.setItem("seen","1")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Nav />
        {children}
        <Playful />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
