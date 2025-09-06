import { Router } from "express";
import { db } from "../db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { interviewerId, problemId } = req.body;

  const [session] = await db
    .insert(sessions)
    .values({
      interviewerId,
      problemId,
      roomCode: Math.random().toString(36).substring(2, 8),
    })
    .returning();

  return res.json(session);
});

router.post("/join", async (req, res) => {
  const { sessionId, candidateId } = req.body;

  const updated = await db
    .update(sessions)
    .set({ candidateId })
    .where(eq(sessions.id, sessionId))
    .returning();

  return res.json(updated);
});

export default router;
