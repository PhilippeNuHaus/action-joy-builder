import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const SITE_PASSWORD = "Govcampaign";
const STORAGE_KEY = "rtk_site_access";

const PasswordGate = ({ children }: { children: ReactNode }) => {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "granted";
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === SITE_PASSWORD.toLowerCase()) {
      try {
        localStorage.setItem(STORAGE_KEY, "granted");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-sm p-8 text-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={20} className="text-primary" />
        </div>
        <h1 className="font-heading text-xl uppercase tracking-wider mb-2">Right to Know</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter the password to view this site.</p>
        <Input
          type="password"
          value={value}
          autoFocus
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="text-sm mb-3"
        />
        {error && <p className="text-sm text-destructive mb-3">That password isn't right.</p>}
        <Button type="submit" className="w-full font-heading uppercase tracking-wider">
          Enter
        </Button>
      </form>
    </div>
  );
};

export default PasswordGate;
