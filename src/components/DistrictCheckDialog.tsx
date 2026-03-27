import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, AlertTriangle, Loader2 } from "lucide-react";

interface DistrictCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "loading" | "not-in-district";

const DistrictCheckDialog = ({ open, onOpenChange }: DistrictCheckDialogProps) => {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("validate-district", {
        body: { address: address.trim() },
      });

      if (fnError) throw fnError;

      if (data?.inDistrict) {
        sessionStorage.setItem("verified_address", address.trim());
        onOpenChange(false);
        navigate("/take-action");
      } else {
        setStatus("not-in-district");
      }
    } catch (err) {
      console.error("District check error:", err);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setAddress("");
    setError(null);
  };

  const handleClose = (value: boolean) => {
    if (!value) handleReset();
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl uppercase flex items-center gap-2">
            <MapPin className="text-primary" size={20} />
            Verify Your District
          </DialogTitle>
          <DialogDescription>
            Enter your address to check if you're in California Senate District 38.
          </DialogDescription>
        </DialogHeader>

        {status === "not-in-district" ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="text-destructive" size={24} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold mb-1">Not in District 38</h3>
              <p className="text-sm text-muted-foreground">
                The address you entered is not within California Senate District 38. This tool is currently only available for constituents in that district.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleReset}>
                Try Another Address
              </Button>
              <Button variant="ghost" onClick={() => handleClose(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="123 Main St, Encinitas, CA 92024"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={status === "loading"}
                className="text-sm"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!address.trim() || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                "Check My District"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DistrictCheckDialog;
