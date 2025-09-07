import { Router } from "express";
import { db } from "../db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { interviewerId, problemId } = req.body;

  try {
    const [session] = await db
      .insert(sessions)
      .values({
        interviewerId,
        problemId,
        roomCode: Math.random().toString(36).substring(2, 8),
      })
      .returning();

    return res.json({ success: true, message: "Session created", session });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(sessions);
    return res.json({
      success: true,
      message: "Sessions fetched successfully",
      sessions: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/join", async (req, res) => {
  const { roomCode, candidateId } = req.body;

  try {
    const [session] = await db
      .update(sessions)
      .set({ candidateId })
      .where(eq(sessions.roomCode, roomCode))
      .returning();

    return res.json({ success: true, message: "Session joined", session });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/:roomCode", async (req, res) => {
  const { roomCode } = req.params;

  if (!roomCode) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const [data] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.roomCode, roomCode));
    return res.json({
      success: true,
      message: "Session fetched successfully",
      session: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
