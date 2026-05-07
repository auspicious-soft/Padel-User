"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { resendOtpService, sendOtpService } from "@/services/admin-services";
import { toast } from "sonner";
import { useDataContext } from "@/app/components/DataContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [isHydrated, setIsHydrated] = useState(false);
  const { setToken, otpToken, setOtpToken, otpPurpose, setOtpPurpose } = useDataContext();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    setOtpValues((prev) => {
      const newOtpValues = [...prev];
      newOtpValues[index] = value;
      return newOtpValues;
    });

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFogetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (otp.length !== 6) {
      toast.error("Please enter a complete OTP");
      return;
    }

    setLoading(true);
    startTransition(async () => {
      try {
        const response = await sendOtpService({ otp, token: otpToken });
        if (response?.status === 200 && response?.data?.success) {
          const responseData = response?.data?.data ?? {};
          const changePasswordToken = responseData?.changePasswordToken || responseData?.verificationToken;
          const accessToken = responseData?.accessToken;

          if (changePasswordToken) {
            setToken(changePasswordToken);
            toast.success(response?.data?.message ?? "OTP verified successfully");
            router.push("/change-password");
            return;
          }

          if (accessToken) {
            if (typeof window !== "undefined") {
              localStorage.setItem("accessToken", accessToken);
            }
            toast.success(response?.data?.message ?? "Login successful");
            router.push("/");
            setOtpToken("");
            setOtpPurpose("");
            return;
          }

          toast.success(response?.data?.message ?? "OTP verified successfully");
                      router.push("/change-password");

        } else {
          toast.error("Invalid OTP");
        }
      } catch (err: any) {

        setOtpValues(Array(6).fill("")); // clear OTP

        // ✅ Move focus back to the first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }

        if (err.status === 404) {
          toast.error("OTP not found");
        } else if (err.status === 500) {
          toast.error("Server error, please try again later");
        } else if (err.status === 400) {
          toast.error("Invalid or Expired OTP");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const handleResendOtp = async () => {
    if (!otpToken) {
      toast.error("Session expired. Please start again.");
      return;
    }

    try {
      const response = await resendOtpService({ token: otpToken });
      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data ?? {};
        const nextToken = data?.resetToken ?? data?.verificationToken ?? data?.token;
        if (nextToken) {
          setOtpToken(nextToken);
        }
        toast.success(response?.data?.message ?? "OTP resent successfully");
        return;
      }
      toast.error(response?.data?.message ?? "Unable to resend OTP");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Unable to resend OTP");
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const storedOtpToken = typeof window !== "undefined" ? localStorage.getItem("auth.otpToken") ?? "" : "";
    const resolvedOtpToken = otpToken || storedOtpToken;

    if (!resolvedOtpToken) {
      router.push(otpPurpose === "VERIFY_EMAIL" ? "/login" : "/forgot-password");
    }
  }, [isHydrated, otpToken, otpPurpose, router]);


  useEffect(() => {
    // if all values are empty, focus back to first input
    if (otpValues.every((v) => v === "")) {
      inputRefs.current[0]?.focus();
    }
  }, [otpValues]);

  return (
    <>
      {loading ? (
        // <Loader />
        <>Loading...</>
      ) : (
        <>
          <main className="relative min-h-screen overflow-hidden">
            <Image src="/assets/AuthImage.png" alt="Auth background" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f87f6]">
              <Search className="h-5 w-5 text-white" />
            </div>

            <section className="relative z-10 flex min-h-screen items-center px-4 md:px-14">
              <form onSubmit={handleFogetPassword} className="w-full max-w-[420px] rounded-3xl bg-[#f4f4f7] px-5 py-8 shadow-[0_20px_60px_rgba(8,10,20,0.22)] md:px-7">
                <h1 className="text-center text-[38px] font-medium leading-tight text-[#2b2b32]">Enter OTP</h1>
                <p className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-5 text-[#7d7d87]">
                  Enter the OTP received on your associated email address.
                </p>

                <div className="mt-8 flex items-center gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={otpValues[idx]}
                      ref={(el) => {
                        inputRefs.current[idx] = el!;
                      }}
                      onChange={(e) => handleChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="h-10 w-full rounded-full border border-[#e6e6eb] bg-white text-center text-sm text-[#2c2c33] outline-none focus:border-[#b7bcff]"
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <ArrowButton text={isPending ? "Please wait..." : "Verify"} type="submit" disabled={isPending} />
                </div>

                <div className="mt-3 text-center">
                  <button type="button" onClick={handleResendOtp} className="text-xs text-[#7079ef]">
                    Resend OTP
                  </button>
                </div>

                <p className="pt-3 text-center text-[11px] text-[#9a9aa3]">
                  Remember Password?{" "}
                  <Link href="/" className="text-[#7079ef]">
                    Login
                  </Link>
                </p>
              </form>
            </section>
          </main>
        </>
      )}
    </>
  );
}
