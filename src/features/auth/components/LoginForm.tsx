"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Code, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setUser({
      id: "user-1",
      name: "John Doe",
      email: data.email,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-11 border-[var(--input)] bg-transparent hover:bg-[var(--accent)]" disabled={isLoading}>
            <Globe className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="h-11 border-[var(--input)] bg-transparent hover:bg-[var(--accent)]" disabled={isLoading}>
            <Code className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">
              Or continue with
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            placeholder="name@example.com"
            type="email"
            leftIcon={<Mail />}
            error={errors.email?.message}
            {...register("email")}
            disabled={isLoading}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            leftIcon={<Lock />}
            error={errors.password?.message}
            {...register("password")}
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register("rememberMe")}
              />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
            <Link href="#" className="text-sm font-medium text-[var(--primary)] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-[var(--muted-foreground)]">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
