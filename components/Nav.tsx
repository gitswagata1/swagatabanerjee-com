import Link from "next/link";
import { profile } from "@/content/profile";
import { SixtySecond } from "@/components/SixtySecond";
import { AvatarToggle } from "@/components/avatar/AvatarToggle";
import { GameToggle } from "@/components/game/GameToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" aria-label={`${profile.identity.initials} — ${profile.identity.name}, home`} className="font-display text-xl font-semibold">
          {profile.identity.initials}
        </Link>
        <ul className="hidden items-center gap-1 text-sm md:flex">
          {profile.nav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-full px-3 py-3 text-ink-2 transition-colors duration-150 hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <SixtySecond />
          <GameToggle />
          <AvatarToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
