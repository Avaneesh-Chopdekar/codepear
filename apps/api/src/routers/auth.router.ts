import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, name, role },
    omit: { password: true },
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, "SECRET", { expiresIn: "30d" });
  res.json({ token, user });
});

export default router;
