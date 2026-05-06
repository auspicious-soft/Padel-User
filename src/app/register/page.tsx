"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { registerUserService } from "@/services/admin-services";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Full name, email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerUserService({
        fullName,
        email,
        password,
        fcmToken: "fcmToken1",
        deviceType: "ANDROID",
      });

      if (response?.data?.success) {
        const otp = response?.data?.data?.otp;
        toast.success(response.data.message ?? "OTP sent successfully");
        if (otp) {
          toast.message(`OTP: ${otp}`);
        }
        router.push("/login");
        return;
      }

      toast.error(response?.data?.message ?? "Registration failed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Unable to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image
        src="/assets/AuthImage.png"
        alt="Padel court"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 " />

      <section className="relative z-10 flex min-h-screen items-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[420px] rounded-[28px] border border-white/25 bg-white/10 p-6 backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-center justify-center">
            <Image src="/assets/Logo.png" alt="Project Play" width={110} height={54} className="h-12 w-auto" />
          </div>

          <h1 className="text-center font-heading text-4xl font-extrabold text-white">Create Account</h1>
          <p className="mt-2 text-center text-sm text-[#d7e4ff]">Start playing with your own account</p>

          <form onSubmit={handleRegister} className="mt-7 space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="h-12 w-full rounded-xl border border-white/30 bg-white/15 px-4 text-sm text-white outline-none placeholder:text-[#d7e4ff] focus:border-[#8895ff]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="h-12 w-full rounded-xl border border-white/30 bg-white/15 px-4 text-sm text-white outline-none placeholder:text-[#d7e4ff] focus:border-[#8895ff]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12 w-full rounded-xl border border-white/30 bg-white/15 px-4 pr-11 text-sm text-white outline-none placeholder:text-[#d7e4ff] focus:border-[#8895ff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d7e4ff]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-[#7382ff] text-base font-semibold text-white transition hover:bg-[#6a78f2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#d7e4ff]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white underline underline-offset-2">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
