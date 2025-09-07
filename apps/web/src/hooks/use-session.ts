import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { API_URL } from "@/lib/constants";
import type { Message, Problem, Session } from "@/lib/types";

const socket = io(API_URL);

export function useSession(sessionId: string, userId: string) {
  const [code, setCode] = useState("console.log('Hello World!');");
  const [session, setSession] = useState<Session>({} as Session);
  const [problem, setProblem] = useState<Problem>({} as Problem);
  const [chat, setChat] = useState<Message[]>([]);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

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
    socket.emit("session:join", { sessionId, userId });
    getSessionInfo(sessionId);

    socket.on("code:update", ({ code }) => setCode(code));
    socket.on("chat:new", (msg) => setChat((prev) => [...prev, msg]));

    // --- WebRTC signaling ---
    socket.on("webrtc:offer", async (payload) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: await getLocalStream(),
      });
      peer.on("signal", (answer) => {
        socket.emit("webrtc:answer", { to: payload.from, answer });
      });
      peer.on("stream", (stream) => setRemoteStream(stream));
      peer.signal(payload.offer);
      peerRef.current = peer;
    });

    socket.on("webrtc:answer", (payload) => {
      peerRef.current?.signal(payload.answer);
    });

    socket.on("webrtc:candidate", (payload) => {
      peerRef.current?.signal(payload.candidate);
    });

    return () => {
      socket.off("code:update");
      socket.off("chat:new");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:candidate");
      peerRef.current?.destroy();
    };
  }, [sessionId, userId]);

  function updateCode(newCode: string) {
    setCode(newCode);
    socket.emit("code:change", { sessionId, code: newCode });
  }

  function sendMessage(sender: string, content: string) {
    socket.emit("chat:message", { sessionId, sender, content });
  }

  // --- Video Call ---
  async function getLocalStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  }

  async function startCall() {
    const stream = await getLocalStream();
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (offer) => {
      socket.emit("webrtc:offer", { to: sessionId, from: userId, offer });
    });
    peer.on("stream", (remote) => setRemoteStream(remote));
    peerRef.current = peer;
    return stream;
  }

  return {
    code,
    updateCode,
    session,
    problem,
    chat,
    sendMessage,
    remoteStream,
    startCall,
    getLocalStream,
  };
}
