import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Dumbbell, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useIsAdmin } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";

const links = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Trainers", href: "/#trainers" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Plans", href: "/#plans" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSession();
  const isAdmin = useIsAdmin(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-fire">
            <Dumbbell className="size-5 text-primary-foreground" />
          </span>
          <span className="truncate font-display text-2xl tracking-wider">
            IRON <span className="text-fire">PULSE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-secondary"
            >
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-semibold uppercase tracking-wide text-secondary hover:opacity-80"
            >
              Admin
            </Link>
          )}
          {user ? (
            <Button variant="outline" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut className="size-4" /> Logout
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-fire font-bold uppercase">
              <Link to="/auth">Join Now</Link>
            </Button>
          )}
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 pb-6 pt-2 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold uppercase text-secondary"
              >
                <LayoutDashboard className="size-4" /> Admin Panel
              </Link>
            )}
            {user ? (
              <Button variant="outline" className="mt-3 rounded-full" onClick={signOut}>
                <LogOut className="size-4" /> Logout
              </Button>
            ) : (
              <Button asChild className="mt-3 rounded-full bg-fire font-bold uppercase">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Join Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
