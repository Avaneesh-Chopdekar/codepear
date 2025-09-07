"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

import useAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

//* Demo Session Page: /sessions/ky1zsz

export default function SessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const auth = useAuth();

  const [code, setCode] = useState("");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, auth, router]);

  function handleExit() {
    router.push("/dashboard");
  }

  function handleCopySessionId() {
    navigator.clipboard.writeText(
      `${window.location.origin}/sessions/${sessionId}`
    );
    toast("Link copied to clipboard");
  }

  return (
    <main className="h-[calc(100vh-64px)] w-full overflow-y-hidden">
      <div className="flex justify-between items-center border-b py-2 px-8">
        <h1>
          Session:{" "}
          <Button variant={"link"} onClick={handleCopySessionId}>
            {sessionId}
          </Button>
        </h1>
        {/* TODO: Add timer */}
        <Button variant="destructive" onClick={handleExit}>
          Exit
        </Button>
      </div>

      <div className="w-full h-full flex">
        <div className="flex-1">
          <Editor
            defaultLanguage="javascript"
            defaultValue="console.log('hello world');"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
        <div id="tabs" className="flex-1">
          <div>Problem Description</div>
          <div>Video Call and Chat</div>
        </div>
      </div>
    </main>
  );
}
