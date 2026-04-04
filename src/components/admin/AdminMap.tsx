import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
// leaflet CSS loaded via index.html CDN link

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

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [points, map]);

  return null;
}

const AdminMap = ({ submissions, clickLocations }: AdminMapProps) => {
  const [geocoded, setGeocoded] = useState<GeocodedPoint[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [progress, setProgress] = useState(0);

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
        <MapContainer center={defaultCenter} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {allPoints.length > 0 && <FitBounds points={allPoints} />}

          {geocoded.map((submission, index) => (
            <Marker
              key={`submission-${index}`}
              position={[submission.latitude, submission.longitude]}
              icon={createIcon(getColor(submission.source), "circle")}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{submission.first_name} {submission.last_name}</strong>
                  <br />
                  📬 Letter sent via <strong>{submission.source || "direct"}</strong>
                  <br />
                  {toPST(submission.created_at)}
                </div>
              </Popup>
            </Marker>
          ))}

          {validClickLocations.map((click, index) => (
            <Marker
              key={`click-${index}`}
              position={[click.latitude, click.longitude]}
              icon={createIcon("#f97316", "square")}
            >
              <Popup>
                <div className="text-xs">
                  🖱️ Click via <strong>{click.source}</strong>
                  <br />
                  {toPST(click.created_at)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
