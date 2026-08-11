"use client";

import { useState, useEffect } from "react";
import { Button } from "@ui/components/button";
import ThemeToggle from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@ui/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_ITEMS } from "@/lib/navigation";

const LOGO = "/images/logo-vper-media.svg";
const SCROLL_THRESHOLD = 80; // px — coincide con el alto normal del header (h-20)

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useActiveSection(["work", "services", "process"]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled((prev) => {
        const next = window.scrollY > SCROLL_THRESHOLD;
        return prev === next ? prev : next;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-[var(--nav-bg)]/95 backdrop-blur-md border-b border-[var(--nav-border)] transition-all duration-300",
        isScrolled ? "h-14" : "h-20",
      )}
    >
      <div className="flex items-stretch h-full">
        <div className="wrap flex items-center justify-between flex-1">
          <a href="#" className="flex items-center gap-2 group">
            <img
              src={LOGO}
              alt="VPER Media"
              className={cn(
                "h-8 md:h-9 w-auto origin-left transition-all duration-300 group-hover:opacity-80",
                isScrolled ? "scale-50" : "scale-100",
              )}
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "font-display uppercase transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300",
                  isScrolled ? "text-label-sm" : "text-label-md",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm",
                  activeSection === item.id
                    ? "text-[var(--nav-item-active)] after:w-full"
                    : "text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)] after:w-0 hover:after:w-full",
                )}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>

          <button
            className="md:hidden p-2 text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <button
          onClick={scrollToContact}
          className={cn(
            "hidden md:flex items-center justify-center h-full px-6 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-bg-hover)] text-[var(--button-primary-text)] font-display uppercase transition-all duration-300",
            isScrolled ? "text-label-sm" : "text-label-md",
          )}
        >
          AGENDA UNA CITA
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "md:hidden absolute left-0 w-full bg-[var(--nav-bg)] border-b border-[var(--nav-border)] py-8 px-6 flex flex-col gap-6",
              isScrolled ? "top-14" : "top-20",
            )}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "font-display text-label-lg uppercase transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm",
                  activeSection === item.id
                    ? "text-[var(--nav-item-active)]"
                    : "text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)]",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="default"
                size="sm"
                className="flex-1 font-display text-label-md uppercase"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                AGENDA UNA CITA
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
