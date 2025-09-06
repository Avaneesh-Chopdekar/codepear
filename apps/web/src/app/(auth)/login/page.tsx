"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, password });
  }
  function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmail("");
    setPassword("");
  }

  return (
    <main className="flex justify-center items-center mt-12">
      <Card className="w-[400px]">
        <CardHeader className="text-center text-2xl">Login</CardHeader>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col items-center gap-4"
          >
            <Input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <Button type="submit">Login</Button>
              <Button variant="outline" type="reset">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="w-full flex justify-center">
          <p className="text-center">
            Don't have an account?
            <Link href="/signup" className="text-primary underline pl-1.5">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
