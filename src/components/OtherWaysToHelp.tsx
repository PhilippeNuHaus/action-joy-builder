import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const SHARE_URL = "https://righttoknow-blakespear.org";
const SHARE_MESSAGE = `A dangerous loophole is allowing polluting industrial projects to bypass environmental review—and put our communities at risk. I just took action to support efforts to fix it. You can too: ${SHARE_URL} #SaveCEQA`;
const FACEBOOK_CAPTION = `A dangerous loophole is allowing polluting industrial projects to bypass environmental review—and put our communities at risk. I just took action to support efforts to fix it. You can too: www.righttoknow-blakespear.org #SaveCEQA`;

const OtherWaysToHelp = () => {
  const handleFacebookShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(FACEBOOK_CAPTION);
      toast.success("Caption copied! Opening Facebook…");
    } catch {
      toast("Copy the message, then paste it into your Facebook post.");
    }
    setTimeout(() => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&hashtag=${encodeURIComponent("#SaveCEQA")}`,
        "_blank",
        "noopener,noreferrer"
      );
    }, 1000);
  };

  return (
    <div className="bg-card border border-border rounded-sm p-5">
      <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-4">
        Other Ways to Help
      </h3>
      <div className="space-y-3">
        <a
          href="mailto:senator.blakespear@senate.ca.gov"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail size={16} className="text-primary shrink-0" />
          Email the Senator directly
        </a>
        <a
          href="tel:+19166516038"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Phone size={16} className="text-primary shrink-0" />
          Call: (916) 651-6038
        </a>
        <div className="flex items-center gap-4 pt-1">
          <span className="text-sm text-muted-foreground">Share:</span>
          <button
            onClick={handleFacebookShare}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Protect our communities from toxic pollution! Thank Senator Blakespear for fighting to restore CEQA protections. Take action:")}&url=${encodeURIComponent(SHARE_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(SHARE_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OtherWaysToHelp;
