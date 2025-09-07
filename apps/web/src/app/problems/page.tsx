"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/constants";
import { Problem, ProblemListResponse } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ProblemsPage() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [examples, setExamples] = useState("");
  const [solution, setSolution] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/problems`);
        const json = (await res.json()) as ProblemListResponse;
        if (json.success) setProblems(json.problems);
      } catch {
        toast.error("Error fetching problems", { richColors: true });
      }
      setLoading(false);
    }
    fetchProblems();
  }, [toast]);

  const filtered = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.statement.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this problem?")) return;
    try {
      const res = await fetch(`${API_URL}/api/problems/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProblems(problems.filter((p) => p.id !== id));
        toast(`Problem ${id} Deleted`);
      } else {
        toast.error("Error deleting problem", { richColors: true });
      }
    } catch {
      toast.error("Error deleting problem", { richColors: true });
    }
  }

  function handleCopy(id: string) {
    navigator.clipboard.writeText(id);
    toast("Problem ID copied to clipboard");
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, statement, examples, solution }),
      });
      const json = await res.json();
      if (json.success || json.sucess) {
        setProblems([json.problem, ...problems]);
        toast("Problem created");
        setOpen(false);
        setTitle("");
        setStatement("");
        setExamples("");
        setSolution("");
      } else {
        toast.error(json.message || "Error creating problem", {
          richColors: true,
        });
      }
    } catch {
      toast.error("Error creating problem", { richColors: true });
    }
    setCreating(false);
  }

  return (
    <main className="max-w-2xl mx-8 sm:mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Problems</h1>
        {/* {isAdmin && ( */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button size="sm" onClick={() => setOpen(true)}>
              <PlusIcon /> Create New
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleCreate}>
              <AlertDialogHeader>
                <AlertDialogTitle>Create Problem</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-3 py-2">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Statement"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Examples"
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Solution (optional)"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="submit"
                    disabled={creating || !title || !statement || !examples}
                  >
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
        {/* )} */}
      </div>
      <Input
        placeholder="Search problems..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground">No problems found.</div>
        ) : (
          filtered.map((problem: any) => (
            <Card key={problem.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <span className="font-semibold">{problem.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(problem.id)}
                  >
                    Copy ID
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(problem.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {problem.statement}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
