import { MiniSwagata } from "@/components/avatar/MiniSwagata";

/** Shown only when the boot script in layout.tsx sets html[data-loader] (first visit). */
export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="flex flex-col items-center gap-4">
        <div className="loader-walker">
          <MiniSwagata state="walk" decorative className="size-[72px]" />
        </div>
        <p className="font-mono text-sm text-ink-2">
          [
          <span className="loader-bar">
            {"·".repeat(20)}
            <span className="loader-fill">{"#".repeat(20)}</span>
          </span>
          ]
        </p>
        <p className="sheet-label">LOADING SHEET 01</p>
      </div>
    </div>
  );
}
