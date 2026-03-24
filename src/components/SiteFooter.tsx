import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="bg-card border-t border-border">
    <div className="caution-stripe-thin h-2" />
    <div className="container py-10">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading text-lg uppercase tracking-wider text-foreground mb-3">
            Right to <span className="text-primary">Know</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Protecting your right to know about dangerous facilities in Orange and San Diego County.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm uppercase tracking-wider text-primary mb-3">Quick Links</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/take-action" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Take Action</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm uppercase tracking-wider text-primary mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">
            Senator Catherine Blakespear<br />
            California State Senate, District 38
          </p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Right to Know, a Planning and Conservation League Campaign. All rights reserved.
      </div>
    </div>
  </footer>
);

export default SiteFooter;
