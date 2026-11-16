/** Simple animated flow diagram: stages left to right (top to bottom on phones), drawn in sequence. */
export function Architecture({ stages }: { stages: string[][] }) {
  return (
    <ol className="arch flex flex-col items-stretch gap-0 lg:flex-row" aria-label="Architecture, in order">
      {stages.map((stage, i) => (
        <li key={i} className="arch-stage flex flex-1 flex-col items-stretch lg:flex-row" style={{ ["--i" as string]: i }}>
          {i > 0 && (
            <span aria-hidden="true" className="arch-wire mx-auto h-8 w-px self-center lg:mx-0 lg:h-px lg:w-8 lg:min-w-8" />
          )}
          <div className="flex flex-1 flex-col justify-center gap-2 border border-line bg-paper p-3">
            <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            {stage.map((node) => (
              <span key={node} className="border border-dashed border-line px-2 py-1.5 text-sm">
                {node}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
