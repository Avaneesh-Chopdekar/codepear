import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Problem, Session } from "@/lib/types";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export function useSession(sessionId: string) {
  const [code, setCode] = useState("console.log('Hello World!');");
  const [session, setSession] = useState<Session>({} as Session);
  const [problem, setProblem] = useState<Problem>({} as Problem);

  async function getProblemInfo(problemId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}`
      );
      const json = await res.json();
      setProblem(json.problem);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSessionInfo(sessionId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${sessionId}`
      );
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
    return () => {
      socket.off("code:update");
    };
  }, [sessionId]);

  function updateCode(newCode: string) {
    setCode(newCode);
    socket.emit("code:change", { sessionId, code: newCode });
  }

  return { code, updateCode, session, problem };
}
