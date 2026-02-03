"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, HeartPulse } from "lucide-react";
import {
  getFamilyHistory,
  updateFamilyHistory,
  FamilyHistoryEntry,
} from "@/server/actions/profile-actions";
import { toast } from "sonner";

export default function FamilyHistoryCard() {
  const [history, setHistory] = useState<FamilyHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    relation: "",
    condition: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const result = await getFamilyHistory();
      if (result.success && result.data) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error("Failed to load history", error);
      toast.error("Failed to load family history");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);

    // Optimistic UI update, then sync
    const result = await updateFamilyHistory(updated);
    if (!result.success) {
      toast.error("Failed to save changes");
      // Revert if failed (in a real app, complicated, but here we just re-fetch)
      loadHistory();
    } else {
      toast.success("Entry removed");
    }
  }

  async function handleAdd() {
    if (!newEntry.relation || !newEntry.condition) {
      toast.warning("Please fill in relation and condition");
      return;
    }

    setIsSaving(true);
    const entry: FamilyHistoryEntry = {
      id: crypto.randomUUID(),
      relation: newEntry.relation,
      condition: newEntry.condition,
      notes: newEntry.notes,
      createdAt: new Date().toISOString(),
    };

    const updated = [...history, entry];
    setHistory(updated);
    setNewEntry({ relation: "", condition: "", notes: "" }); // Reset form

    const result = await updateFamilyHistory(updated);
    setIsSaving(false);

    if (!result.success) {
      toast.error("Failed to save entry");
      loadHistory(); // Revert
    } else {
      toast.success("Family history updated");
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Family History
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <HeartPulse size={16} /> Family Medical History
        </CardTitle>
        <CardDescription>
          Document known medical conditions in your family history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* List of entries */}
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-lg border bg-muted/30 p-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.condition}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.relation}
                  </p>
                  {item.notes && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No family history recorded yet.
          </p>
        )}

        {/* Add new entry form */}
        <div className="grid gap-4 rounded-lg border border-dashed p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relation">Relationship</Label>
              <Input
                id="relation"
                placeholder="e.g. Maternal Grandmother"
                value={newEntry.relation}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, relation: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                placeholder="e.g. Diabetes, Twins"
                value={newEntry.condition}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, condition: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Any details..."
              value={newEntry.notes}
              onChange={(e) =>
                setNewEntry({ ...newEntry, notes: e.target.value })
              }
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={isSaving || !newEntry.relation || !newEntry.condition}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            {isSaving ? "Saving..." : "Add Entry"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
