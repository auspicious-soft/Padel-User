"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { userLoginService } from "@/services/admin-services";
import { useDataContext } from "@/app/components/DataContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setDataEmail, setOtpToken, setOtpPurpose } = useDataContext();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await userLoginService({ email, password });

      if (response?.data?.success) {
        const message = response?.data?.message ?? "";
        const verificationToken = response?.data?.data?.verificationToken;

        if (verificationToken && message.toLowerCase().includes("not verified")) {
          setDataEmail(email);
          setOtpToken(verificationToken);
          setOtpPurpose("VERIFY_EMAIL");
          toast.success(message);
          router.push("/otp");
          return;
        }

        const accessToken = response?.data?.data?.accessToken;
        if (accessToken && typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
        }

        toast.success(response.data.message ?? "Login successful");
        router.push("/");
        return;
      }

      toast.error(response?.data?.message ?? "Login failed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image src="/assets/AuthImage.png" alt="Padel court" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f87f6]">
        <Search className="h-5 w-5 text-white" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center px-4 md:px-14">
        <div className="w-full max-w-[430px] rounded-3xl bg-[#f4f4f7] px-5 py-8 shadow-[0_20px_60px_rgba(8,10,20,0.22)] md:px-7">
          <h1 className="text-center text-[38px] font-medium leading-tight text-[#2b2b32]">Account Login</h1>
          <p className="mx-auto mt-2 max-w-[310px] text-center text-[14px] leading-5 text-[#7d7d87]">
            Hey, Please enter your details below to securely log in and access your account.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-xs text-[#7d7d87]">Email</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#bebec8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Loisbketeck@gmail.com"
                  className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 pl-8 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-[#7d7d87]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="......."
                  className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 pr-10 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7c2]">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-[#7d7d87]">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-3 w-3 rounded border-[#d8d8df]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#7079ef]">
                Forgot Password ?
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="cursor-pointer h-10 w-full rounded-full bg-[#7f87f6] text-sm font-medium text-white transition hover:bg-[#7079ef] disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-3 text-center text-[11px] text-[#9a9aa3]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#7079ef]">
              Create One
            </Link>
          </p>

          <div className="my-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-[#e2e2e8]" />
            <span className="text-[11px] text-[#9a9aa3]">Or</span>
            <div className="h-px flex-1 bg-[#e2e2e8]" />
          </div>

          <button type="button" className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white text-xs text-[#6d6d76]">
            Continue with Google
          </button>
        </div>
      </section>
    </main>
  );
}
