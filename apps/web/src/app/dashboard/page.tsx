"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardPage() {
  const data = useAuth();
  const router = useRouter();

  const [problemId, setProblemId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !data.isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, data, router]);

  // Create session handler
  async function handleCreateSession() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewerId: data.user.id,
          problemId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage(`Session created! Room code: ${json.session.roomCode}`);
      } else {
        setMessage(json.message || "Failed to create session");
      }
    } catch (err) {
      setMessage("Error creating session");
    }
    setLoading(false);
  }

  async function handleJoinSession() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/session/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          candidateId: data.user.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("Joined session!");
      } else {
        setMessage(json.message || "Failed to join session");
      }
    } catch (err) {
      setMessage("Error joining session");
    }
    setLoading(false);
  }

  return (
    <main className="container mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold px-8 py-4">Dashboard</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 px-8">
        <Card className="flex-1 w-full sm:w-auto">
          <CardHeader>Create Session</CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Problem ID"
              value={problemId}
              required
              onChange={(e) => setProblemId(e.target.value)}
            />
            <Button
              onClick={handleCreateSession}
              disabled={loading || !problemId}
            >
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </CardContent>
        </Card>
        <Card className="flex-1 w-full sm:w-auto">
          <CardHeader>Join Session</CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Room Code"
              value={roomCode}
              required
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button onClick={handleJoinSession} disabled={loading || !roomCode}>
              {loading ? "Joining..." : "Join Session"}
            </Button>
          </CardContent>
        </Card>
        {message && (
          <div className="text-center text-sm text-primary mt-4">{message}</div>
        )}
      </div>
    </main>
  );
}
