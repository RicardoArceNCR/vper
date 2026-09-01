import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
        <p className="text-body-sm font-bold tracking-widest text-muted-foreground">
          LAB · NO ESTÁ EN LA HOME
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-body-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Volver al sitio
          </Link>
          <ThemeToggle />
        </div>
      </header>
      {children}
    </div>
  );
}
