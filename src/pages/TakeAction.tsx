import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Mail, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WIDGET_ID = "SPK-QEIDR0A=";
const WIDGET_CONTAINER_ID = "action_button_container";
const WIDGET_SCRIPT_SRC = "https://embed.actionbutton.co/widget/widget.min.js";
const WIDGET_LOAD_TIMEOUT_MS = 8000;

type ActionButtonApi = {
  loadButton?: (containerId: string, widgetId?: string) => Promise<unknown>;
};

const TakeAction = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [widgetFailed, setWidgetFailed] = useState(false);
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const widgetEl = widgetRef.current;
    if (!widgetEl) return;

    widgetEl.id = WIDGET_CONTAINER_ID;
    widgetEl.setAttribute("data-action-button-widget-id", WIDGET_ID);

    let cancelled = false;
    let timeoutId: number | undefined;
    let observer: MutationObserver | null = null;
    let createdScript: HTMLScriptElement | null = null;
    let existingLoadHandler: (() => void) | null = null;
    let existingErrorHandler: (() => void) | null = null;

    const hasRenderedWidget = () => Boolean(widgetEl.querySelector("iframe"));

    const markFailed = () => {
      if (cancelled) return;
      setWidgetLoading(false);
      setWidgetFailed(true);
    };

    const markReady = () => {
      if (cancelled) return;
      if (timeoutId) window.clearTimeout(timeoutId);
      setWidgetLoading(false);
      setWidgetFailed(false);
    };

    observer = new MutationObserver(() => {
      if (hasRenderedWidget()) {
        markReady();
      }
    });
    observer.observe(widgetEl, { childList: true, subtree: true });

    const initWidget = () => {
      const api = (window as Window & { ActionButton?: ActionButtonApi }).ActionButton;
      if (!api?.loadButton) {
        markFailed();
        return;
      }

      widgetEl.replaceChildren();
      setWidgetLoading(true);
      setWidgetFailed(false);
      api.loadButton(WIDGET_CONTAINER_ID, WIDGET_ID).catch(() => {
        markFailed();
      });

      timeoutId = window.setTimeout(() => {
        if (!hasRenderedWidget()) {
          markFailed();
        }
      }, WIDGET_LOAD_TIMEOUT_MS);
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      if ((window as Window & { ActionButton?: ActionButtonApi }).ActionButton?.loadButton) {
        initWidget();
      } else {
        existingLoadHandler = () => initWidget();
        existingErrorHandler = () => markFailed();
        existingScript.addEventListener("load", existingLoadHandler, { once: true });
        existingScript.addEventListener("error", existingErrorHandler, { once: true });
      }
      return () => {
        cancelled = true;
        if (timeoutId) window.clearTimeout(timeoutId);
        observer?.disconnect();
        if (existingLoadHandler) {
          existingScript.removeEventListener("load", existingLoadHandler);
        }
        if (existingErrorHandler) {
          existingScript.removeEventListener("error", existingErrorHandler);
        }
      };
    }

    const script = document.createElement("script");
    createdScript = script;
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = initWidget;
    script.onerror = () => markFailed();
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      observer?.disconnect();
      if (createdScript) {
        createdScript.onload = null;
        createdScript.onerror = null;
      }
    };
  }, [retryCount]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="caution-stripe h-3" />

        <section className="py-16">
          <div className="container max-w-4xl">
            <h1 className="font-heading text-4xl md:text-5xl uppercase text-center mb-3">
              Take <span className="text-primary">Action</span>
            </h1>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Thank State Senator Catherine Blakespear for Protecting Your Community from Toxic Pollution
            </p>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* ActionButton Embed */}
              <div className="lg:col-span-3">
                <div className="relative min-h-[600px] border border-border rounded-sm bg-card/40">
                  {widgetLoading && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <p className="text-sm text-muted-foreground">Loading action form…</p>
                    </div>
                  )}
                  <div
                    ref={widgetRef}
                    className="action-button-widget min-h-[600px]"
                    data-action-button-widget-id={WIDGET_ID}
                  />
                </div>
                {widgetFailed && (
                  <div className="mt-3 p-4 rounded-sm border border-border bg-card/70 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      We couldn't load the embedded form here. You can still contact the office directly, or retry loading.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRetryCount((count) => count + 1)}
                      className="text-sm font-semibold text-primary hover:text-accent transition-colors"
                    >
                      Retry loading the form
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar actions */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-card border border-border rounded-sm p-5">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-3">Other Ways to Help</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:senator.blakespear@senate.ca.gov"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail size={16} className="text-primary shrink-0" />
                      Email the Senator directly
                    </a>
                    <a
                      href="tel:+19168516038"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone size={16} className="text-primary shrink-0" />
                      Call: (916) 651-6038
                    </a>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Share:</span>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Protect our communities from toxic pollution! Thank Senator Blakespear for fighting to restore CEQA protections. Take action:")}&url=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on X"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://righttoknow-blakespear.org")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Share on LinkedIn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-sm p-5">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-primary mb-2">Why Your Voice Matters</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Legislators pay close attention to constituent feedback. Every message counts toward building the pressure needed to close the advanced manufacturing loophole and protect our communities.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TakeAction;
