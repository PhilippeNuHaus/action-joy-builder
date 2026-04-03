import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Users, Sparkles, Mail, BarChart3, RefreshCw } from "lucide-react";

interface Stats {
  totalClicks: number;
  clicksBySource: Record<string, number>;
  totalSubmissions: number;
  submissions: Array<{ first_name: string; last_name: string; email: string; source: string; created_at: string }>;
  totalSenatorEmails: number;
  senatorEmails: Array<{ template_name: string; status: string; created_at: string; error_message: string | null }>;
  submissionsBySource: Record<string, number>;
  channelsTracked: number;
}

const toPST = (utc: string) =>
  new Date(utc).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short", timeStyle: "short" });

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [savedPassword, setSavedPassword] = useState("");

  const fetchStats = async (pw: string) => {
    const { data, error: fnError } = await supabase.functions.invoke("admin-verify", {
      body: { password: pw },
    });
    if (fnError || !data?.valid) throw new Error("Wrong password");
    return data.stats as Stats;
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await fetchStats(password);
      setStats(s);
      setSavedPassword(password);
      setAuthenticated(true);
    } catch {
      setError("Wrong password");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const s = await fetchStats(savedPassword);
      setStats(s);
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

  if (!stats) return null;

  const statCards = [
    { label: "Letters Sent", value: stats.totalSubmissions, icon: Users },
    { label: "Link Clicks", value: stats.totalClicks, icon: Sparkles },
    { label: "Emails Sent", value: stats.totalSenatorEmails, icon: Mail },
    { label: "Channels Tracked", value: stats.channelsTracked, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1923] text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Stat cards */}
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

      {/* Clicks by Channel */}
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

      {/* Letters by Channel */}
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
            {Object.entries(stats.submissionsBySource || {})
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

      {/* Recent Submissions */}
      <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
        <h2 className="text-lg font-bold italic mb-4">Recent Submissions</h2>
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
              {stats.submissions.map((s, i) => (
                <tr key={i} className="border-b border-[#1e2d3a]/50">
                  <td className="py-3">{s.first_name} {s.last_name}</td>
                  <td className="py-3 text-gray-300">{s.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#d4a843]/15 text-[#d4a843]">
                      {s.source || "direct"}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{toPST(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Senator Emails */}
      <div className="bg-[#162029] border border-[#1e2d3a] rounded-lg p-5">
        <h2 className="text-lg font-bold italic mb-4">Emails to Senator</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2d3a]">
                <th className="text-left text-sm text-gray-400 pb-2">Template</th>
                <th className="text-left text-sm text-gray-400 pb-2">Status</th>
                <th className="text-left text-sm text-gray-400 pb-2">Date (PST)</th>
              </tr>
            </thead>
            <tbody>
              {stats.senatorEmails.map((e, i) => (
                <tr key={i} className="border-b border-[#1e2d3a]/50">
                  <td className="py-3">{e.template_name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      e.status === "sent" ? "bg-green-900/30 text-green-400" :
                      e.status === "failed" || e.status === "dlq" ? "bg-red-900/30 text-red-400" :
                      "bg-yellow-900/30 text-yellow-400"
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{toPST(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
