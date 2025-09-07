// User type
export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt?: string;
};

// Problem type
export type Problem = {
  id: string;
  title: string;
  statement: string;
  examples: string; // JSON string
  solution?: string;
};

// Session type
export type Session = {
  id: string;
  roomCode: string;
  interviewerId: string;
  candidateId?: string;
  problemId?: string;
  createdAt?: string;
};

// Message type
export type Message = {
  id: string;
  sessionId: string;
  senderId: string;
  sender?: string;
  content: string;
  createdAt?: string;
};

// Submission type
export type Submission = {
  id: string;
  sessionId: string;
  userId: string;
  code: string;
  language: string;
  status: "pending" | "accepted" | "wrong" | "error";
  createdAt?: string;
};

export type BaseResponse = {
  success: boolean;
  message: string;
};

// Auth response types
export type AuthLoginResponse = BaseResponse & {
  token?: string;
  user?: User;
};

export type AuthRegisterResponse = BaseResponse;

export type ProblemListResponse = BaseResponse & {
  problems: Problem[];
};

export type ProblemCreateResponse = BaseResponse & {
  problem?: Problem;
};

export type ProblemDeleteResponse = BaseResponse;
