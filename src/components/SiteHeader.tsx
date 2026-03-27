import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/take-action", label: "Take Action" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-wider text-foreground">
            RIGHT TO <span className="text-primary">KNOW</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-heading text-sm uppercase tracking-widest transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/take-action"
            className="bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-sm hover:bg-gold-dark transition-colors animate-pulse-glow"
          >
            Send Message
          </Link>
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
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block font-heading text-sm uppercase tracking-widest text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/take-action"
            onClick={() => setMobileOpen(false)}
            className="block bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-sm text-center"
          >
            Send Message
          </Link>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
