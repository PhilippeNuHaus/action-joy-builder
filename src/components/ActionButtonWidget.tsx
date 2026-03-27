import { useEffect, useRef, useState } from "react";

const WIDGET_SCRIPT_SRC = "https://embed.actionbutton.co/widget/widget.min.js";
const WIDGET_EMBED_HTML =
  '<div data-action-button-widget-id="SPK-QElDRkg=" data-is-sponsored-content="false" show-border="true"></div>';

const ActionButtonWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoadError(false);
    container.innerHTML = WIDGET_EMBED_HTML;

    document
      .querySelectorAll<HTMLScriptElement>(`script[src="${WIDGET_SCRIPT_SRC}"]`)
      .forEach((script) => script.parentNode?.removeChild(script));

    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onerror = () => setLoadError(true);
    document.body.appendChild(script);

    return () => {
      script.onerror = null;
    };
  }, []);

  return (
    <div className="w-full min-h-[400px] rounded-sm border border-border bg-card/40 p-2">
      <div ref={containerRef} className="w-full min-h-[400px]" />
      {loadError && (
        <p className="mt-3 px-3 text-sm text-muted-foreground">
          The action form could not load. Please use the direct email or phone options.
        </p>
      )}
    </div>
  );
};

export default ActionButtonWidget;
