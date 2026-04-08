import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, Users, Sparkles, BarChart3, RefreshCw, MapPin, Mail } from "lucide-react";
import AdminMap from "@/components/admin/AdminMap";
import AdminMapBoundary from "@/components/admin/AdminMapBoundary";

interface Stats {
  totalClicks: number;
  clicksBySource: Record<string, number>;
  totalSubmissions: number;
  submissions: Array<{
    first_name: string;
    last_name: string;
    email: string;
    source: string;
    created_at: string;
    address: string | null;
  }>;
  totalSenatorEmails: number;
  senatorEmails: Array<{ template_name: string; status: string; created_at: string; error_message: string | null }>;
  submissionsBySource: Record<string, number>;
  channelsTracked: number;
  clickLocations: Array<{ source: string; latitude: number; longitude: number; created_at: string }>;
}

const EMPTY_STATS: Stats = {
  totalClicks: 0,
  clicksBySource: {},
  totalSubmissions: 0,
  submissions: [],
  totalSenatorEmails: 0,
  senatorEmails: [],
  submissionsBySource: {},
  channelsTracked: 0,
  clickLocations: [],
};

const toPST = (utc: string) =>
  new Date(utc).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short", timeStyle: "short" });

const normalizeStats = (value: unknown): Stats => {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid admin response");
  }

  const stats = value as Partial<Stats>;

  return {
    ...EMPTY_STATS,
    ...stats,
    clicksBySource: stats.clicksBySource ?? {},
    submissions: Array.isArray(stats.submissions) ? stats.submissions : [],
    senatorEmails: Array.isArray(stats.senatorEmails) ? stats.senatorEmails : [],
    submissionsBySource: stats.submissionsBySource ?? {},
    clickLocations: Array.isArray(stats.clickLocations) ? stats.clickLocations : [],
  };
};

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [savedPassword, setSavedPassword] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const [submissionPage, setSubmissionPage] = useState(1);
  
  const ROWS_PER_PAGE = 10;

  const fetchStats = async (pw: string) => {
    const { data, error: fnError } = await supabase.functions.invoke("admin-verify", {
      body: { password: pw },
    });

    if (fnError || !data?.valid) {
      throw new Error("Wrong password");
    }

    return normalizeStats(data.stats);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const nextStats = await fetchStats(password);
      setStats(nextStats);
      setSavedPassword(password);
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
      setStats(null);
      setError("Wrong password");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const nextStats = await fetchStats(savedPassword);
      setStats(nextStats);
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#162029] border border-[#1e2d3a] rounded-lg p-6 space-y-4">
          <div className="text-center">
            <Lock className="mx-auto h-8 w-8 text-[#d4a843] mb-2" />
            <h2 className="text-lg font-bold text-white">Admin Access</h2>
          </div>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-[#0f1923] border-[#1e2d3a] text-white placeholder:text-gray-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button onClick={handleLogin} disabled={loading} className="w-full bg-[#d4a843] text-[#0f1923] hover:bg-[#c49a3a] font-semibold">
            {loading ? "Checking..." : "Enter"}
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center p-4 text-white">
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    { label: "Letters Sent", value: stats.totalSubmissions, icon: Users },
    { label: "Link Clicks", value: stats.totalClicks, icon: Sparkles },
    { label: "Channels Tracked", value: stats.channelsTracked, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1923] text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold italic">Campaign Dashboard</h1>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="border-[#1e2d3a] bg-[#162029] text-white hover:bg-[#1e2d3a]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#162029] border border-[#1e2d3a]">
          <TabsTrigger value="stats" className="data-[state=active]:bg-[#d4a843] data-[state=active]:text-[#0f1923]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-[#d4a843] data-[state=active]:text-[#0f1923]">
            <MapPin className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#d4a843] mb-1">
                  <card.icon className="h-5 w-5" />
                  <span className="text-sm text-gray-400">{card.label}</span>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
            <h2 className="text-lg font-bold italic mb-4">Clicks by Channel</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2d3a]">
                  <th className="text-left text-sm text-gray-400 pb-2">Channel</th>
                  <th className="text-right text-sm text-gray-400 pb-2">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.clicksBySource)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => (
                    <tr key={source} className="border-b border-[#1e2d3a]/50">
                      <td className="py-3 font-medium">{source}</td>
                      <td className="py-3 text-right">{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
            <h2 className="text-lg font-bold italic mb-4">Letters by Channel</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2d3a]">
                  <th className="text-left text-sm text-gray-400 pb-2">Channel</th>
                  <th className="text-right text-sm text-gray-400 pb-2">Letters</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.submissionsBySource)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => (
                    <tr key={source} className="border-b border-[#1e2d3a]/50">
                      <td className="py-3 font-medium">{source}</td>
                      <td className="py-3 text-right">{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
            <h2 className="text-lg font-bold italic mb-4">Recent Submissions ({stats.totalSubmissions})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e2d3a]">
                    <th className="text-left text-sm text-gray-400 pb-2">Name</th>
                    <th className="text-left text-sm text-gray-400 pb-2">Email</th>
                    <th className="text-left text-sm text-gray-400 pb-2">Channel</th>
                    <th className="text-left text-sm text-gray-400 pb-2">Date (PST)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.submissions
                    .slice((submissionPage - 1) * ROWS_PER_PAGE, submissionPage * ROWS_PER_PAGE)
                    .map((submission, index) => (
                    <tr key={index} className="border-b border-[#1e2d3a]/50">
                      <td className="py-3">{submission.first_name} {submission.last_name}</td>
                      <td className="py-3 text-gray-300">{submission.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#d4a843]/15 text-[#d4a843]">
                          {submission.source || "direct"}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{toPST(submission.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(() => {
                const totalPages = Math.ceil(stats.submissions.length / ROWS_PER_PAGE);
                return totalPages > 1 ? (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e2d3a]">
                    <Button
                      onClick={() => setSubmissionPage((p) => Math.max(1, p - 1))}
                      disabled={submissionPage === 1}
                      variant="outline"
                      size="sm"
                      className="border-[#1e2d3a] bg-[#0f1923] text-white hover:bg-[#1e2d3a] disabled:opacity-40"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-400">Page {submissionPage} of {totalPages}</span>
                    <Button
                      onClick={() => setSubmissionPage((p) => Math.min(totalPages, p + 1))}
                      disabled={submissionPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="border-[#1e2d3a] bg-[#0f1923] text-white hover:bg-[#1e2d3a] disabled:opacity-40"
                    >
                      Next
                    </Button>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <AdminMapBoundary resetKey={`${activeTab}-${stats.submissions.length}-${stats.clickLocations.length}`}>
            <AdminMap
              key={`map-${activeTab}-${stats.submissions.length}-${stats.clickLocations.length}`}
              submissions={stats.submissions}
              clickLocations={stats.clickLocations}
              visible={activeTab === "map"}
            />
          </AdminMapBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;