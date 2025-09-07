"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { userAtom } from "@/atoms/user-atom";

export default function Navbar() {
  const router = useRouter();
  const auth = useAuth();
  const setUser = useSetAtom(userAtom);

  const links = [
    { href: auth.isAuthenticated ? "/dashboard" : "/", label: "Home" },
    { href: "/problems", label: "Problems" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  function handleLogout() {
    setUser(RESET);
    router.replace("/login");
  }

  return (
    <nav className="sticky top-0 z-50 w-full px-4 md:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[200px]">
            <nav className="flex flex-col gap-6 p-16">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="mr-4">
          <Link
            href={auth.isAuthenticated ? "/dashboard" : "/"}
            className="mr-6 flex items-center space-x-2"
          >
            <img src="/icon.svg" alt="logo" className="h-10 -mr-0.5" />
            <span className="text-xl font-bold uppercase">
              Code<span className="text-primary">Pear</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth Buttons */}
        {auth.isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push("/profile")}
            >
              {auth.user.name}
            </Button>
            <Button size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login")}
            >
              Log in
            </Button>
            <Button size="sm" onClick={() => router.push("/signup")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
