import { Router } from "express";
import { db } from "../db";
import { problems } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(problems);
    return res.json({
      success: true,
      message: "Problems fetched successfully",
      problems: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [data] = await db.select().from(problems).where(eq(problems.id, id));
    return res.json({
      success: true,
      message: "Problem fetched successfully",
      problem: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { title, statement, examples, solution } = req.body;

  if (!title || !statement || !examples) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  try {
    const [problem] = await db
      .insert(problems)
      .values({ title, statement, examples, solution })
      .returning();
    return res.status(201).json({
      sucess: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.delete(problems).where(eq(problems.id, id));
    return res
      .status(204)
      .json({ success: true, message: "Problem deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
