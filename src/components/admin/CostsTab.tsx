import { useEffect, useState, useCallback, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type CostRow = {
  channel: string;
  amount_spent: number;
  amount_sent: number;
  sent_at: string | null;
  clicks: number;
  letters: number;
};

const fmtUSD = (n: number) =>
  n > 0 ? `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";
const fmtNum = (n: number) => (n > 0 ? n.toLocaleString() : "—");
const fmtPct = (n: number) => (Number.isFinite(n) && n > 0 ? `${(n * 100).toFixed(2)}%` : "—");
const fmtPerUnit = (spend: number, count: number) =>
  spend > 0 && count > 0 ? `$${(spend / count).toFixed(2)}` : "—";
const fmtPerRecipient = (spend: number, sent: number) =>
  spend > 0 && sent > 0 ? `$${(spend / sent).toFixed(4)}` : "—";

const suffixNum = (channel: string): number => {
  const m = channel.match(/-(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
};
const baseName = (channel: string): string => channel.replace(/-\d+$/, "");

const BUCKETS = [
  { key: "sms", label: "SMS", match: (c: string) => c.toLowerCase().startsWith("sms") },
  { key: "email", label: "Email", match: (c: string) => c.toLowerCase().startsWith("email") },
];

type Group = { bucket: string; label: string; rows: CostRow[]; expandable: boolean };

const groupRows = (rows: CostRow[]): Group[] => {
  const buckets = new Map<string, CostRow[]>();
  const standalone: CostRow[] = [];
  for (const r of rows) {
    const ch = r.channel.toLowerCase();
    const b = BUCKETS.find((x) => x.match(ch));
    if (b) {
      if (!buckets.has(b.label)) buckets.set(b.label, []);
      buckets.get(b.label)!.push(r);
    } else {
      standalone.push(r);
    }
  }
  const groups: Group[] = [];
  for (const [label, brows] of buckets) {
    brows.sort((a, b) => baseName(a.channel).localeCompare(baseName(b.channel)) || suffixNum(a.channel) - suffixNum(b.channel));
    groups.push({ bucket: label, label, rows: brows, expandable: true });
  }
  for (const r of standalone) {
    groups.push({ bucket: r.channel, label: r.channel, rows: [r], expandable: false });
  }
  return groups.sort((a, b) => {
    const sa = a.rows.reduce((s, r) => s + r.amount_spent, 0);
    const sb = b.rows.reduce((s, r) => s + r.amount_spent, 0);
    if (sb !== sa) return sb - sa;
    const ca = a.rows.reduce((s, r) => s + r.clicks, 0);
    const cb = b.rows.reduce((s, r) => s + r.clicks, 0);
    return cb - ca;
  });
};

const sumRows = (rows: CostRow[]) => ({
  amount_spent: rows.reduce((s, r) => s + r.amount_spent, 0),
  amount_sent: rows.reduce((s, r) => s + r.amount_sent, 0),
  clicks: rows.reduce((s, r) => s + r.clicks, 0),
  letters: rows.reduce((s, r) => s + r.letters, 0),
});

export const CostsTab = ({ password }: { password: string }) => {
  const [rows, setRows] = useState<CostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["SMS", "Email"]));
  const [edits, setEdits] = useState<Record<string, { spent?: string; sent?: string; sent_at?: string }>>({});

  const [newChannel, setNewChannel] = useState("");
  const [newSpent, setNewSpent] = useState("");
  const [newSent, setNewSent] = useState("");
  const [newSentAt, setNewSentAt] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-verify", {
        body: { password, action: "get_costs" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRows(data?.rows || []);
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (
    channel: string,
    amount_spent: number,
    amount_sent: number,
    sent_at?: string | null,
  ) => {
    try {
      const body: Record<string, unknown> = { password, action: "upsert_cost", channel, amount_spent, amount_sent };
      if (sent_at !== undefined) body.sent_at = sent_at;
      const { data, error } = await supabase.functions.invoke("admin-verify", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRows((prev) => {
        const exists = prev.find((r) => r.channel === channel);
        if (exists) {
          return prev.map((r) =>
            r.channel === channel
              ? { ...r, amount_spent, amount_sent, ...(sent_at !== undefined ? { sent_at } : {}) }
              : r,
          );
        }
        return [...prev, { channel, amount_spent, amount_sent, sent_at: sent_at ?? null, clicks: 0, letters: 0 }];
      });
      setEdits((e) => {
        const next = { ...e };
        delete next[channel];
        return next;
      });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  const handleBlur = (row: CostRow, field: "spent" | "sent" | "sent_at") => {
    const edit = edits[row.channel];
    if (!edit || edit[field] === undefined) return;
    const spent = edit.spent !== undefined ? parseFloat(edit.spent) : row.amount_spent;
    const sent = edit.sent !== undefined ? parseInt(edit.sent, 10) : row.amount_sent;
    if (Number.isNaN(spent) || Number.isNaN(sent) || spent < 0 || sent < 0) {
      toast({ title: "Invalid number", variant: "destructive" });
      return;
    }
    const sentAt = edit.sent_at !== undefined ? (edit.sent_at || null) : undefined;
    save(row.channel, spent, sent, sentAt);
  };

  const handleAdd = async () => {
    const channel = newChannel.trim().toLowerCase();
    const spent = parseFloat(newSpent || "0");
    const sent = parseInt(newSent || "0", 10);
    if (!channel || !/^[a-z0-9-]+$/.test(channel)) {
      toast({ title: "Channel name required", description: "Use lowercase letters, numbers, and dashes only.", variant: "destructive" });
      return;
    }
    if (Number.isNaN(spent) || Number.isNaN(sent) || spent < 0 || sent < 0) {
      toast({ title: "Invalid number", variant: "destructive" });
      return;
    }
    const sentAt = newSentAt && /^\d{4}-\d{2}-\d{2}$/.test(newSentAt) ? newSentAt : null;
    await save(channel, spent, sent, sentAt);
    setNewChannel("");
    setNewSpent("");
    setNewSent("");
    setNewSentAt("");
  };

  const groups = groupRows(rows);
  const totals = sumRows(rows);
  const toggle = (bucket: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      n.has(bucket) ? n.delete(bucket) : n.add(bucket);
      return n;
    });

  const renderRow = (row: CostRow, indent: boolean) => {
    const edit = edits[row.channel] || {};
    const spentVal = edit.spent !== undefined ? edit.spent : row.amount_spent ? String(row.amount_spent) : "";
    const sentVal = edit.sent !== undefined ? edit.sent : row.amount_sent ? String(row.amount_sent) : "";
    const sentAtVal = edit.sent_at !== undefined ? edit.sent_at : (row.sent_at ?? "");
    return (
      <TableRow key={row.channel} className={indent ? "bg-muted/20" : ""}>
        <TableCell className={indent ? "pl-10 text-sm text-muted-foreground" : "font-medium"}>
          {row.channel}
        </TableCell>
        <TableCell className="px-1">
          <Input
            type="date"
            value={sentAtVal}
            onChange={(e) =>
              setEdits((p) => ({ ...p, [row.channel]: { ...p[row.channel], sent_at: e.target.value } }))
            }
            onBlur={() => handleBlur(row, "sent_at")}
            className="h-8 w-32 text-xs px-1"
          />
        </TableCell>
        <TableCell className="px-1">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={spentVal}
            placeholder="0.00"
            onChange={(e) => setEdits((p) => ({ ...p, [row.channel]: { ...p[row.channel], spent: e.target.value } }))}
            onBlur={() => handleBlur(row, "spent")}
            className="h-8 w-20 text-right text-xs px-1"
          />
        </TableCell>
        <TableCell className="px-1">
          <Input
            type="number"
            step="1"
            min="0"
            value={sentVal}
            placeholder="0"
            onChange={(e) => setEdits((p) => ({ ...p, [row.channel]: { ...p[row.channel], sent: e.target.value } }))}
            onBlur={() => handleBlur(row, "sent")}
            className="h-8 w-20 text-right text-xs px-1"
          />
        </TableCell>
        <TableCell className="text-right">{fmtNum(row.clicks)}</TableCell>
        <TableCell className="text-right">{fmtNum(row.letters)}</TableCell>
        <TableCell className="text-right">{fmtPerUnit(row.amount_spent, row.clicks)}</TableCell>
        <TableCell className="text-right">{fmtPerUnit(row.amount_spent, row.letters)}</TableCell>
        <TableCell className="text-right">{fmtPerRecipient(row.amount_spent, row.amount_sent)}</TableCell>
        <TableCell className="text-right">
          {fmtPct(row.amount_sent > 0 ? row.letters / row.amount_sent : 0)}
        </TableCell>
      </TableRow>
    );
  };

  const renderGroupHeader = (g: Group) => {
    const t = sumRows(g.rows);
    const isOpen = expanded.has(g.bucket);
    const dates = g.rows.map((r) => r.sent_at).filter(Boolean) as string[];
    const latestDate = dates.length ? dates.sort().slice(-1)[0] : "";
    return (
      <TableRow
        key={`g-${g.bucket}`}
        className={g.expandable ? "cursor-pointer hover:bg-muted/50 font-semibold" : "font-semibold"}
        onClick={() => g.expandable && toggle(g.bucket)}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            {g.expandable && (
              <span className={`inline-block transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
            )}
            {g.label}
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {latestDate || "—"}
        </TableCell>
        <TableCell className="text-right">{fmtUSD(t.amount_spent)}</TableCell>
        <TableCell className="text-right">{fmtNum(t.amount_sent)}</TableCell>
        <TableCell className="text-right">{fmtNum(t.clicks)}</TableCell>
        <TableCell className="text-right">{fmtNum(t.letters)}</TableCell>
        <TableCell className="text-right">{fmtPerUnit(t.amount_spent, t.clicks)}</TableCell>
        <TableCell className="text-right">{fmtPerUnit(t.amount_spent, t.letters)}</TableCell>
        <TableCell className="text-right">{fmtPerRecipient(t.amount_spent, t.amount_sent)}</TableCell>
        <TableCell className="text-right">
          {fmtPct(t.amount_sent > 0 ? t.letters / t.amount_sent : 0)}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Spend</p>
            <p className="text-2xl font-bold text-foreground">{fmtUSD(totals.amount_spent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Cost / Click</p>
            <p className="text-2xl font-bold text-foreground">{fmtPerUnit(totals.amount_spent, totals.clicks)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Cost / Letter</p>
            <p className="text-2xl font-bold text-foreground">{fmtPerUnit(totals.amount_spent, totals.letters)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold text-foreground">
              {fmtPct(totals.amount_sent > 0 ? totals.letters / totals.amount_sent : 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Channel Costs</CardTitle>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the <strong>Spend</strong> and <strong>Sent</strong> (universe size) per channel code.
            Clicks, letters, and all per-unit costs update automatically. Click a row's cell to edit; changes save when you click away.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Letters</TableHead>
                <TableHead className="text-right">$/Click</TableHead>
                <TableHead className="text-right">$/Letter</TableHead>
                <TableHead className="text-right">$/Recipient</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g) => (
                <Fragment key={g.bucket}>
                  {renderGroupHeader(g)}
                  {g.expandable && expanded.has(g.bucket) && g.rows.map((r) => renderRow(r, true))}
                  {!g.expandable && g.rows.map((r) => renderRow(r, false))}
                </Fragment>
              ))}
              <TableRow className="border-t-2 font-bold bg-muted/30">
                <TableCell>Overall</TableCell>
                <TableCell />
                <TableCell className="text-right">{fmtUSD(totals.amount_spent)}</TableCell>
                <TableCell className="text-right">{fmtNum(totals.amount_sent)}</TableCell>
                <TableCell className="text-right">{fmtNum(totals.clicks)}</TableCell>
                <TableCell className="text-right">{fmtNum(totals.letters)}</TableCell>
                <TableCell className="text-right">{fmtPerUnit(totals.amount_spent, totals.clicks)}</TableCell>
                <TableCell className="text-right">{fmtPerUnit(totals.amount_spent, totals.letters)}</TableCell>
                <TableCell className="text-right">{fmtPerRecipient(totals.amount_spent, totals.amount_sent)}</TableCell>
                <TableCell className="text-right">
                  {fmtPct(totals.amount_sent > 0 ? totals.letters / totals.amount_sent : 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Add a channel code</p>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                placeholder="channel (e.g. sms-8)"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="h-9 w-48"
              />
              <Input
                type="date"
                value={newSentAt}
                onChange={(e) => setNewSentAt(e.target.value)}
                className="h-9 w-40"
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Spend"
                value={newSpent}
                onChange={(e) => setNewSpent(e.target.value)}
                className="h-9 w-28"
              />
              <Input
                type="number"
                step="1"
                min="0"
                placeholder="Sent"
                value={newSent}
                onChange={(e) => setNewSent(e.target.value)}
                className="h-9 w-32"
              />
              <Button size="sm" onClick={handleAdd}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
