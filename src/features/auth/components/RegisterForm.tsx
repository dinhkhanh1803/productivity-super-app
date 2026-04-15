"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, User, Code, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setUser({
      id: "user-1",
      name: data.name,
      email: data.email,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Fill in your details to get started with your productivity journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User />}
            error={errors.name?.message}
            {...register("name")}
            disabled={isLoading}
          />
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
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            leftIcon={<Lock />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            disabled={isLoading}
          />

          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

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
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
