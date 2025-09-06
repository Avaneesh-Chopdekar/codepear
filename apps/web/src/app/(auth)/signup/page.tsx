"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { API_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role: "user" }),
    });
    if (!response.ok) {
      toast("Something went wrong", {
        description: "Please try again",
      });
      return;
    }
    toast("Signup successful", {
      description: "You can now login",
    });
    router.push("/login");
  }

  function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="flex justify-center items-center mt-12">
      <Card className="w-[400px]">
        <CardHeader className="text-center text-2xl">Signup</CardHeader>
        <CardDescription className="text-center">
          Create a new account
        </CardDescription>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col items-center gap-4"
          >
            <Input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              <Button type="submit">Signup</Button>
              <Button variant="outline" type="reset">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="w-full flex justify-center">
          <p className="text-center">
            Already have an account?
            <Link href="/login" className="text-primary underline pl-1.5">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
