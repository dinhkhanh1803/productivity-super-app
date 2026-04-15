import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Productivity Super App",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
