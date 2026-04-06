import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import DistrictCheckDialog from "@/components/DistrictCheckDialog";

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold tracking-wider text-foreground">
              RIGHT TO <span className="text-primary">KNOW</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/in-the-news"
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === "/in-the-news" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              In The News
            </Link>
            <Link
              to="/resources"
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === "/resources" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Resources
            </Link>
            <button
              onClick={() => setDialogOpen(true)}
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === "/take-action" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Take Action
            </button>
            <button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-sm hover:bg-gold-dark transition-colors animate-pulse-glow"
            >
              Send Message
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden bg-card border-t border-border px-6 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block font-heading text-sm uppercase tracking-widest text-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/in-the-news"
              onClick={() => setMobileOpen(false)}
              className="block font-heading text-sm uppercase tracking-widest text-foreground hover:text-primary"
            >
              In The News
            </Link>
            <button
              onClick={() => { setMobileOpen(false); setDialogOpen(true); }}
              className="block font-heading text-sm uppercase tracking-widest text-foreground hover:text-primary w-full text-left"
            >
              Take Action
            </button>
            <button
              onClick={() => { setMobileOpen(false); setDialogOpen(true); }}
              className="block bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-sm text-center w-full"
            >
              Send Message
            </button>
          </nav>
        )}
      </header>

      <DistrictCheckDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default SiteHeader;
