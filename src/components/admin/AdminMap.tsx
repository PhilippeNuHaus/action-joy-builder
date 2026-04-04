import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

interface SubmissionPoint {
  first_name: string;
  last_name: string;
  source: string;
  address: string | null;
  created_at: string;
}

interface ClickPoint {
  source: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface GeocodedPoint extends SubmissionPoint {
  latitude: number;
  longitude: number;
}

interface AdminMapProps {
  submissions: SubmissionPoint[];
  clickLocations: ClickPoint[];
  visible?: boolean;
}

const createIcon = (color: string, shape: "circle" | "square" = "circle") => {
  const size = shape === "circle" ? 12 : 10;
  const svg =
    shape === "circle"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}"><circle cx="${size}" cy="${size}" r="${size - 1}" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}"><rect x="1" y="1" width="${size * 2 - 2}" height="${size * 2 - 2}" rx="2" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
};

const CHANNEL_COLORS: Record<string, string> = {
  direct: "#d4a843",
  sms: "#22c55e",
  email: "#3b82f6",
  social: "#a855f7",
};

const getColor = (source: string) => CHANNEL_COLORS[source] || "#9ca3af";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });

const isValidCoordinate = (latitude: number, longitude: number) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  Math.abs(latitude) <= 90 &&
  Math.abs(longitude) <= 180;

const toPST = (utc: string) =>
  new Date(utc).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "short",
    timeStyle: "short",
  });

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    const lat = Number.parseFloat(data?.[0]?.lat ?? "");
    const lng = Number.parseFloat(data?.[0]?.lon ?? "");

    if (isValidCoordinate(lat, lng)) {
      return { lat, lng };
    }
  } catch {
    // silent
  }

  return null;
}

const buildSubmissionPopup = (submission: GeocodedPoint) => `
  <div class="text-xs">
    <strong>${escapeHtml(`${submission.first_name} ${submission.last_name}`.trim())}</strong><br />
    📬 Letter sent via <strong>${escapeHtml(submission.source || "direct")}</strong><br />
    ${escapeHtml(toPST(submission.created_at))}
  </div>
`;

const buildClickPopup = (click: ClickPoint) => `
  <div class="text-xs">
    🖱️ Click via <strong>${escapeHtml(click.source || "unknown")}</strong><br />
    ${escapeHtml(toPST(click.created_at))}
  </div>
`;

const AdminMap = ({ submissions, clickLocations, visible = true }: AdminMapProps) => {
  const [geocoded, setGeocoded] = useState<GeocodedPoint[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const validClickLocations = useMemo(
    () => clickLocations.filter((point) => isValidCoordinate(point.latitude, point.longitude)),
    [clickLocations]
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setGeocoding(true);
      setGeocoded([]);
      setProgress(0);

      const results: GeocodedPoint[] = [];
      const toGeocode = submissions.filter((submission) => Boolean(submission.address));

      for (let index = 0; index < toGeocode.length; index += 1) {
        if (cancelled) break;

        const submission = toGeocode[index];
        const coords = await geocodeAddress(submission.address as string);

        if (coords && isValidCoordinate(coords.lat, coords.lng)) {
          results.push({ ...submission, latitude: coords.lat, longitude: coords.lng });
          setGeocoded([...results]);
        }

        setProgress(index + 1);

        if (index < toGeocode.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
      }

      if (!cancelled) {
        setGeocoding(false);
      }
    };

    if (submissions.length > 0) {
      run();
    } else {
      setGeocoded([]);
      setGeocoding(false);
      setProgress(0);
    }

    return () => {
      cancelled = true;
    };
  }, [submissions]);

  const allPoints: [number, number][] = [
    ...geocoded.map((point) => [point.latitude, point.longitude] as [number, number]),
    ...validClickLocations.map((point) => [point.latitude, point.longitude] as [number, number]),
  ];

  const defaultCenter: [number, number] = [33.1, -117.3];
  const totalToGeocode = submissions.filter((submission) => Boolean(submission.address)).length;

  useEffect(() => {
    const container = mapElementRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container, {
      center: defaultCenter,
      zoom: 9,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const resizeMap = () => map.invalidateSize();
    const frame = requestAnimationFrame(resizeMap);
    const timer = window.setTimeout(resizeMap, 200);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!visible || !map) {
      return;
    }

    const resizeMap = () => map.invalidateSize();
    const frame = requestAnimationFrame(resizeMap);
    const timer = window.setTimeout(resizeMap, 220);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [visible, geocoded.length, validClickLocations.length]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();

    const boundsPoints: [number, number][] = [];

    geocoded.forEach((submission) => {
      boundsPoints.push([submission.latitude, submission.longitude]);

      L.marker([submission.latitude, submission.longitude], {
        icon: createIcon(getColor(submission.source), "circle"),
      })
        .bindPopup(buildSubmissionPopup(submission))
        .addTo(markerLayer);
    });

    validClickLocations.forEach((click) => {
      boundsPoints.push([click.latitude, click.longitude]);

      L.marker([click.latitude, click.longitude], {
        icon: createIcon("#f97316", "square"),
      })
        .bindPopup(buildClickPopup(click))
        .addTo(markerLayer);
    });

    if (boundsPoints.length > 0) {
      map.fitBounds(L.latLngBounds(boundsPoints), { padding: [30, 30] });
    } else {
      map.setView(defaultCenter, 9);
    }
  }, [geocoded, validClickLocations]);

  return (
    <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
      <h2 className="text-lg font-bold italic mb-2 text-white">Activity Map</h2>

      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <span className="text-gray-400">Letters:</span>
        {Object.entries(CHANNEL_COLORS).map(([channel, color]) => (
          <span key={channel} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full border border-white/50"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-300 capitalize">{channel}</span>
          </span>
        ))}
        <span className="text-gray-500 ml-2">|</span>
        <span className="text-gray-400">Clicks:</span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border border-white/50"
            style={{ backgroundColor: "#f97316" }}
          />
          <span className="text-gray-300">Square = click</span>
        </span>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ height: 400 }}>
        <div ref={mapElementRef} style={{ height: "100%", width: "100%" }} />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {geocoding
          ? `Plotting addresses... ${progress}/${totalToGeocode}`
          : `${geocoded.length} letters plotted · ${validClickLocations.length} clicks plotted`}
      </p>
    </div>
  );
};

export default AdminMap;
