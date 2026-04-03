import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, BarChart3, Mail, Users } from "lucide-react";

interface Stats {
  totalClicks: number;
  clicksBySource: Record<string, number>;
  totalSubmissions: number;
  submissions: Array<{ first_name: string; last_name: string; email: string; source: string; created_at: string }>;
  totalSenatorEmails: number;
  senatorEmails: Array<{ template_name: string; status: string; created_at: string; error_message: string | null }>;
}

const toPST = (utc: string) =>
  new Date(utc).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short", timeStyle: "short" });

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-verify", {
        body: { password },
      });
      if (fnError || !data?.valid) {
        setError("Wrong password");
        return;
      }
      setStats(data.stats);
      setAuthenticated(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle className="text-lg">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Checking..." : "Enter"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Campaign Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="mx-auto h-6 w-6 text-primary mb-1" />
            <p className="text-3xl font-bold text-foreground">{stats.totalClicks}</p>
            <p className="text-sm text-muted-foreground">Link Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto h-6 w-6 text-primary mb-1" />
            <p className="text-3xl font-bold text-foreground">{stats.totalSubmissions}</p>
            <p className="text-sm text-muted-foreground">Form Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="mx-auto h-6 w-6 text-primary mb-1" />
            <p className="text-3xl font-bold text-foreground">{stats.totalSenatorEmails}</p>
            <p className="text-sm text-muted-foreground">Emails to Senator</p>
          </CardContent>
        </Card>
      </div>

      {/* Clicks by source */}
      <Card>
        <CardHeader><CardTitle className="text-base">Clicks by Source</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.clicksBySource)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground capitalize">{source}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail tabs */}
      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="emails">Senator Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card>
            <CardContent className="pt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date (PST)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.submissions.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-foreground">{s.first_name} {s.last_name}</TableCell>
                      <TableCell className="text-foreground">{s.email}</TableCell>
                      <TableCell className="text-muted-foreground">{toPST(s.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardContent className="pt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date (PST)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.senatorEmails.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-foreground">{e.template_name}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          e.status === "sent" ? "bg-green-100 text-green-800" :
                          e.status === "failed" || e.status === "dlq" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {e.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{toPST(e.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
