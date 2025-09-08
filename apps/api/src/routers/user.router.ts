import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return res.json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [user] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning();
    return res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
