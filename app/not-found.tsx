import Link from "next/link";
import { MiniSwagata } from "@/components/avatar/MiniSwagata";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-4 py-16 text-center">
      <div>
        <p className="sheet-label">SHEET 404 / NOT ON THE DRAWING</p>
        <div className="lost-walk mx-auto mt-8 w-fit">
          <MiniSwagata state="think" decorative className="size-28" />
        </div>
        <h1 className="mt-6 font-display text-5xl font-semibold sm:text-7xl">Lost the plot.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">
          This page isn&apos;t on any sheet. Mini Swagata checked twice. Let&apos;s walk back to something that exists.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-transform duration-150 ease-spring hover:scale-[1.03]"
        >
          Walk me home →
        </Link>
      </div>
    </main>
  );
}
