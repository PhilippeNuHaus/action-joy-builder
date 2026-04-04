import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SubmissionPoint {
  first_name: string;
  last_name: string;
  source: string;
  address: string;
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

const toPST = (utc: string) =>
  new Date(utc).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "short",
    timeStyle: "short",
  });

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      { headers: { "User-Agent": "RightToKnowAdmin/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
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

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setGeocoding(true);
      const results: GeocodedPoint[] = [];
      const toGeocode = submissions.filter((s) => s.address);

      for (let i = 0; i < toGeocode.length; i++) {
        if (cancelled) break;
        const s = toGeocode[i];
        const coords = await geocodeAddress(s.address);
        if (coords) {
          results.push({ ...s, latitude: coords.lat, longitude: coords.lng });
          setGeocoded([...results]);
        }
        setProgress(i + 1);
        // Nominatim rate limit
        if (i < toGeocode.length - 1) {
          await new Promise((r) => setTimeout(r, 1100));
        }
      }
      setGeocoding(false);
    };

    if (submissions.length > 0) run();
    return () => { cancelled = true; };
  }, [submissions]);

  const allPoints: [number, number][] = [
    ...geocoded.map((s) => [s.latitude, s.longitude] as [number, number]),
    ...clickLocations.map((c) => [c.latitude, c.longitude] as [number, number]),
  ];

  const defaultCenter: [number, number] = [33.1, -117.3];
  const totalToGeocode = submissions.filter((s) => s.address).length;

  return (
    <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
      <h2 className="text-lg font-bold italic mb-2 text-white">Activity Map</h2>

      {/* Legend */}
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
        <MapContainer
          center={defaultCenter}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {allPoints.length > 0 && <FitBounds points={allPoints} />}

          {geocoded.map((s, i) => (
            <Marker
              key={`sub-${i}`}
              position={[s.latitude, s.longitude]}
              icon={createIcon(getColor(s.source), "circle")}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{s.first_name} {s.last_name}</strong>
                  <br />
                  📬 Letter sent via <strong>{s.source || "direct"}</strong>
                  <br />
                  {toPST(s.created_at)}
                </div>
              </Popup>
            </Marker>
          ))}

          {clickLocations.map((c, i) => (
            <Marker
              key={`click-${i}`}
              position={[c.latitude, c.longitude]}
              icon={createIcon("#f97316", "square")}
            >
              <Popup>
                <div className="text-xs">
                  🖱️ Click via <strong>{c.source}</strong>
                  <br />
                  {toPST(c.created_at)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {geocoding
          ? `Plotting addresses... ${progress}/${totalToGeocode}`
          : `${geocoded.length} letters plotted · ${clickLocations.length} clicks plotted`}
      </p>
    </div>
  );
};

export default AdminMap;
