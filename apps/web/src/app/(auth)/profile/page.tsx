"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atoms/user-atom";
import { ModeToggle } from "@/components/mode-toggle";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const response = await fetch(`${API_URL}/api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    setUser((prev) => ({
      token: prev.token,
      user: { ...prev.user, name: data.user.name },
    }));

    setName(data.user.name);
    setSaving(false);
    setEditing(false);
  }

  if (!hydrated || !user) return null;

  return (
    <main className="max-w-xl mx-auto py-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <ModeToggle />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
              {user.name?.[0]?.toUpperCase() || "😃"}
            </div>
            <div>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-xs mt-1 px-2 py-0.5 rounded bg-accent text-accent-foreground inline-block">
                {user.role}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={name}
                disabled={!editing}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={user.email} disabled />
            </div>
            <div className="flex gap-2 pt-2">
              {editing ? (
                <>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setName(user.name);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : null}
            </div>
          </form>
          {!editing && (
            <div className="flex gap-2 pb-4">
              <Button type="button" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
