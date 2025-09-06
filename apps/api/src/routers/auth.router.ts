import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashed,
      name,
      role,
    });

    return res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return res.json({
    success: true,
    message: "Login successful",
    token,
    user: userWithoutPassword,
  });
});

export default router;
