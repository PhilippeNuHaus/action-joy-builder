import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToForm = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const el = isDesktop
      ? document.getElementById("contact-form-desktop-anchor") || document.getElementById("contact-form-desktop")
      : document.getElementById("contact-form") || document.getElementById("contact-form-desktop");

    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => window.dispatchEvent(new Event("pulse-form")), 400);
  };

  const goToForm = async () => {
    if (location.pathname !== "/") {
      await navigate("/");
      setTimeout(() => {
        scrollToForm();
      }, 100);
    } else {
      scrollToForm();
    }
  };

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
            onClick={goToForm}
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
          <Link
            to="/resources"
            onClick={() => setMobileOpen(false)}
            className="block font-heading text-sm uppercase tracking-widest text-foreground hover:text-primary"
          >
            Resources
          </Link>
          <button
            onClick={() => { setMobileOpen(false); goToForm(); }}
            className="block bg-primary text-primary-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-sm text-center w-full"
          >
            Send Message
          </button>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
