"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

import useAuth from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

//* Demo Session Page: /sessions/ky1zsz

export default function SessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const auth = useAuth();

  const { code, updateCode, problem, chat, sendMessage } = useSession(
    sessionId as string
  );
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, auth, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  function handleSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(auth.user.name, chatInput.trim());
    setChatInput("");
  }

  function handleExit() {
    if (!window.confirm("Leave this session?")) return;
    router.push("/dashboard");
  }

  function handleCopySessionId() {
    navigator.clipboard.writeText(
      `${window.location.origin}/sessions/${sessionId}`
    );
    toast("Link copied to clipboard");
  }

  async function handleRunCode() {
    console.log(code);
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: "18.15.0",
          files: [{ content: code }],
        }),
      });

      const json = await response.json();
      setOutput(json.run.output);
    } catch (error) {
      setOutput("Error running code");
    }
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

        <div className="space-x-4">
          {/* TODO: Add timer */}
          <Button onClick={handleRunCode}>Run Code</Button>
          <Button variant="destructive" onClick={handleExit}>
            Exit
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-116px)] flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-2">
            <Editor
              language={language}
              value={code}
              onChange={(value) => updateCode(value || "")}
              options={{
                automaticLayout: true,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
          <div className="border-t flex-1 px-8 overflow-y-auto">
            <pre>{output}</pre>
          </div>
        </div>
        <Tabs defaultValue="statement" className="flex-1 border-l">
          <div className="p-4">
            <TabsList className="">
              <TabsTrigger value="statement">Problem</TabsTrigger>
              <TabsTrigger value="video-call">Video Call</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="statement" className="px-8 pb-4 space-y-4">
            <h2 className="font-semibold text-2xl">{problem.title}</h2>
            <pre className="whitespace-pre-wrap font-sans">
              {problem.statement}
            </pre>
            <pre>{problem.examples}</pre>
          </TabsContent>
          <TabsContent value="video-call" className="flex flex-col">
            <div>
              <div>Interviewer</div>
              <div>Candidate</div>
            </div>
            <div className="flex flex-col flex-1 border-t">
              <div className="flex-1 overflow-y-auto px-4 pb-2">
                {chat.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <span className="font-semibold">{msg.sender}:</span>{" "}
                    <span>{msg.content}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form
                onSubmit={handleSendChat}
                className="flex gap-2 p-4 border-t"
              >
                <Input
                  className="flex-1"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  autoComplete="off"
                />
                <Button type="submit" size="sm">
                  Send
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
