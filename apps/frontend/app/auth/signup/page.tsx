"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Sign up failed");
      }

      // Redirect to signin page on successful signup
      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Get started with your free account today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
            <div className="text-center text-sm">
              {"Already have an account? "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
            <div className="text-center">
              <Button asChild variant="link">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Logo and Background */}
      <div className="flex-1 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={400} height={100} />
          </div>
          <p className="text-xl text-muted-foreground max-w-md">
            Next-Gen Energy Intelligence Platform
          </p>
          <div className="grid grid-cols-2 gap极 4 max-w-md text-sm">
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Predictive Analytics</div>
              <div className="text-muted-foreground">
                Forecast energy usage with 95% accuracy
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Carbon Footprint Tracking</div>
              <div className="text-muted-foreground">
                Monitor and optimize your environmental impact
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Smart Grid Integration</div>
              <div className="text-muted-foreground">
                Seamless connection with IoT devices
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Energy Optimization</div>
              <div className="text-muted-foreground">
                AI-driven cost and efficiency improvements
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}
