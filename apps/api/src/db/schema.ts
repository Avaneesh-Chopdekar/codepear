import crypto from "node:crypto";
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- User ----------
export const users = pgTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // user / admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Problem ----------
export const problems = pgTable("problems", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  statement: text("statement").notNull(),
  examples: text("examples").notNull(), // JSON string
  solution: text("solution"),
});

// ---------- Session ----------
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roomCode: varchar("room_code", { length: 20 }).notNull().unique(),
  interviewerId: varchar("interviewer_id", { length: 255 }).notNull(),
  candidateId: varchar("candidate_id", { length: 255 }),
  problemId: varchar("problem_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Message ----------
export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Submission ----------
export const submissions = pgTable("submissions", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // pending | accepted | wrong | error
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User ↔ Sessions
export const usersRelations = relations(users, ({ many }) => ({
  interviewerSessions: many(sessions, { relationName: "interviewer" }),
  candidateSessions: many(sessions, { relationName: "candidate" }),
  messages: many(messages),
  submissions: many(submissions),
}));

// Session ↔ Problem, Messages, Submissions
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  interviewer: one(users, {
    fields: [sessions.interviewerId],
    references: [users.id],
    relationName: "interviewer",
  }),
  candidate: one(users, {
    fields: [sessions.candidateId],
    references: [users.id],
    relationName: "candidate",
  }),
  problem: one(problems, {
    fields: [sessions.problemId],
    references: [problems.id],
  }),
  messages: many(messages),
  submissions: many(submissions),
}));

// Problem ↔ Sessions
export const problemsRelations = relations(problems, ({ many }) => ({
  sessions: many(sessions),
}));

// Message ↔ User, Session
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
}));

// Submission ↔ User, Session
export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [submissions.sessionId],
    references: [sessions.id],
  }),
}));
