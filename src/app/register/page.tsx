"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { registerUserService } from "@/services/admin-services";
import { useDataContext } from "@/app/components/DataContext";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setDataEmail, setOtpToken, setOtpPurpose } = useDataContext();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password must match");
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
        const verificationToken = response?.data?.data?.verificationToken;
        if (verificationToken) {
          setDataEmail(email);
          setOtpToken(verificationToken);
          setOtpPurpose("VERIFY_EMAIL");
          toast.success(response.data.message ?? "OTP sent successfully");
          router.push("/otp");
          return;
        }
        toast.success(response.data.message ?? "Account created successfully");
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
      <Image src="/assets/AuthImage.png" alt="Padel court" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute left-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7f87f6]">
        <Search className="h-6 w-6 text-white" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center px-4 md:px-14">
        <div className="w-full max-w-[430px] rounded-3xl bg-[#f4f4f7] px-5 py-8 shadow-[0_20px_60px_rgba(8,10,20,0.22)] md:px-7">
          <h1 className="text-center text-[42px] font-medium leading-tight text-[#2b2b32]">Create A New Account</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-center text-[14px] leading-5 text-[#7d7d87]">
            Please enter your details below to create a new account.
          </p>

          <form onSubmit={handleRegister} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-xs text-[#7d7d87]">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Loisbeck03@gmail.com"
                className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-[#7d7d87]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Loisbeck03@gmail.com"
                className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-[#7d7d87]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="......"
                    className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 pr-10 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7c2]">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-[#7d7d87]">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="......"
                    className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white px-4 pr-10 text-xs text-[#2c2c33] outline-none placeholder:text-[#a4a4ad] focus:border-[#b7bcff]"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7c2]">
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="h-10 w-full rounded-full bg-[#7f87f6] text-sm font-medium text-white transition hover:bg-[#7079ef] disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-[#9a9aa3]">
            Remember Password?{" "}
            <Link href="/login" className="text-[#7079ef]">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
