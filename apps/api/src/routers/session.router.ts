import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { interviewerId, problemId } = req.body;
  const session = await prisma.session.create({
    data: {
      interviewerId,
      problemId,
      roomCode: Math.random().toString(36).substring(2, 8),
    },
  });
  res.json(session);
});

router.post("/join", async (req, res) => {
  const { sessionId, candidateId } = req.body;
  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { candidateId },
  });
  res.json(updated);
});

export default router;
