import type { Resource } from "@/pages/Resources";

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
}

const ResourceCard = ({ resource, onClick }: ResourceCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group block w-full text-left rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={resource.thumbUrl}
          alt={resource.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category badge */}
        <span className="inline-block bg-primary/15 text-primary font-heading text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          {resource.category}
        </span>

        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {resource.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {resource.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-primary font-heading text-sm uppercase tracking-wider">
          View Document
        </div>
      </div>
    </button>
  );
};

export default ResourceCard;
