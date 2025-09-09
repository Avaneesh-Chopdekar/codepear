"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Video, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Real-time Code Editor",
      description:
        "Collaborate on code in real-time with syntax highlighting and auto-completion.",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Calls",
      description: "Face-to-face interviews with built-in video calling.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description:
        "Instant messaging during sessions for better communication.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Sessions",
      description: "Private rooms with unique codes for each interview.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up as an interviewer or candidate.",
    },
    {
      number: "02",
      title: "Start a Session",
      description: "Create a room and share the code with your candidate.",
    },
    {
      number: "03",
      title: "Collaborate",
      description: "Code, chat, and conduct interviews seamlessly.",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Code<span className="text-primary">Pear</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
          A modern platform for conducting technical interviews with real-time
          collaboration, video calls, and more.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-card hover:shadow-lg transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of companies conducting better technical interviews.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
