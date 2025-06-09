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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const t = useTranslations('Auth.signin');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      router.push("/main/dashboard");
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Sign in failed");
      }

      await fetchUser();
      router.push("/main/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full">
                {t('signIn')}
              </Button>
            </form>
            <div className="text-center text-sm">
              {t('noAccount')}{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                {t('signUp')}
              </Link>
            </div>
            <div className="text-center">
              <Button asChild variant="link">
                <Link href="/">{t('backToHome')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Logo and Background */}
      <div className="flex-1 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Image src="/ess-logo.png" alt="Logo" width={400} height={100} />
          </div>
          <p className="text-xl text-muted-foreground max-w-md">
            {t('platformTitle')}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md text-sm">
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">{t('predictiveAnalytics.title')}</div>
              <div className="text-muted-foreground">
                {t('predictiveAnalytics.description')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">{t('carbonFootprint.title')}</div>
              <div className="text-muted-foreground">
                {t('carbonFootprint.description')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">{t('smartGrid.title')}</div>
              <div className="text-muted-foreground">
                {t('smartGrid.description')}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">{t('energyOptimization.title')}</div>
              <div className="text-muted-foreground">
                {t('energyOptimization.description')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}
