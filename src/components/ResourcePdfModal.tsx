import { X, Download } from "lucide-react";
import type { Resource } from "@/pages/Resources";

interface ResourcePdfModalProps {
  resource: Resource;
  onClose: () => void;
}

const ResourcePdfModal = ({ resource, onClose }: ResourcePdfModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 my-8 md:my-16 bg-card rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-primary/15 text-primary font-heading text-xs uppercase tracking-widest px-3 py-1 rounded-full">
              {resource.category}
            </span>
            <h2 className="font-heading text-lg font-bold text-foreground truncate">
              {resource.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={resource.pdfUrl}
              download
              className="p-2 rounded-full hover:bg-muted transition-colors"
              title="Download PDF"
            >
              <Download size={18} className="text-primary" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* PDF Embed */}
        <div className="w-full" style={{ height: "80vh" }}>
          <iframe
            src={resource.pdfUrl}
            title={resource.title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourcePdfModal;
