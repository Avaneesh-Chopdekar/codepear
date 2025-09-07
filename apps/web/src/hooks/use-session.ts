import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/constants";
import type { Message, Problem, Session } from "@/lib/types";

const socket = io(API_URL);

export function useSession(sessionId: string) {
  const [code, setCode] = useState("console.log('Hello World!');");
  const [session, setSession] = useState<Session>({} as Session);
  const [problem, setProblem] = useState<Problem>({} as Problem);
  const [chat, setChat] = useState<Message[]>([]);

  async function getProblemInfo(problemId: string) {
    try {
      const res = await fetch(`${API_URL}/api/problems/${problemId}`);
      const json = await res.json();
      setProblem(json.problem);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSessionInfo(sessionId: string) {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`);
      const json = await res.json();
      setSession(json);
      getProblemInfo(json.session.problemId);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    socket.emit("session:join", { sessionId });
    getSessionInfo(sessionId);

    socket.on("code:update", ({ code }) => setCode(code));
    socket.on("chat:new", (msg) => setChat((prev) => [...prev, msg]));

    return () => {
      socket.off("code:update");
      socket.off("chat:new");
    };
  }, [sessionId]);

  function updateCode(newCode: string) {
    setCode(newCode);
    socket.emit("code:change", { sessionId, code: newCode });
  }

  function sendMessage(sender: string, content: string) {
    socket.emit("chat:message", { sessionId, sender, content });
  }

  return { code, updateCode, session, problem, chat, sendMessage };
}
