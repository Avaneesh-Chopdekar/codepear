import dotenv from "dotenv";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

import { createApp } from "./app";
import authRouter from "./routers/auth.router";
import sessionRouter from "./routers/session.router";
import problemRouter from "./routers/problem.router";

const port = process.env.PORT || 3001;
const app = createApp();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/problems", problemRouter);
app.get("/api/health-check", (req, res) =>
  res.status(200).json({ status: "healthy" })
);

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("session:join", ({ sessionId, userId }) => {
    socket.join(sessionId);
    socket.to(sessionId).emit("user:joined", { userId });
  });

  socket.on("code:change", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code:update", { code });
  });

  socket.on("chat:message", ({ sessionId, sender, content }) => {
    io.to(sessionId).emit("chat:new", { sender, content });
  });

  socket.on("webrtc:offer", (payload) => {
    socket.to(payload.to).emit("webrtc:offer", payload);
  });
  socket.on("webrtc:answer", (payload) => {
    socket.to(payload.to).emit("webrtc:answer", payload);
  });
  socket.on("webrtc:candidate", (payload) => {
    socket.to(payload.to).emit("webrtc:candidate", payload);
  });
});

server.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
