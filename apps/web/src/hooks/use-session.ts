import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export function useSession(sessionId: string) {
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.emit("session:join", { sessionId });

    socket.on("code:update", ({ code }) => setCode(code));
    return () => {
      socket.off("code:update");
    };
  }, [sessionId]);

  function updateCode(newCode: string) {
    setCode(newCode);
    socket.emit("code:change", { sessionId, code: newCode });
  }

  return { code, updateCode };
}
