"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import InputField from "../../components/InputField";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { forgotPasswordService } from "@/services/admin-services";
import { toast } from "sonner";
import { useDataContext } from "@/app/components/DataContext";
import { Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const { setDataEmail, setOtpToken, setOtpPurpose } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
    const { data: session } = useSession();

      useEffect(() => {
        if (session) {
          router.push("/authority/home");
        }
      }, [session, router]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFogetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setDataEmail(email);
    if (!email) {
      toast.error("Please Enter your Email address");
      return;
    }
    startTransition(async () => {
      setLoading(true);
      try {
        const response = await forgotPasswordService({ email: email });
        if (response?.status === 200 && response?.data?.success) {
          const resetToken = response?.data?.data?.resetToken;
          setOtpToken(resetToken ?? "");
          setOtpPurpose("FORGOT_PASSWORD");
          toast.success(response?.data?.message ?? "OTP sent successfully");
          router.push("/otp");
        } else {
          toast.error("User not Found");
        }
      } catch (err: any) {
        if (err.status == 400) toast.error("User not found");
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      {loading ? (
        <>loading</>
      ) : (
        <>
          <main className="relative min-h-screen overflow-hidden">
            <Image src="/assets/AuthImage.png" alt="Auth background" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f87f6]">
              <Search className="h-5 w-5 text-white" />
            </div>

            <section className="relative z-10 flex min-h-screen items-center px-4 md:px-14">
              <div className="w-full max-w-[430px] rounded-3xl bg-[#f4f4f7] px-5 py-8 shadow-[0_20px_60px_rgba(8,10,20,0.22)] md:px-7">
                <div className="mx-auto max-w-[330px]">
                  <h1 className="text-center text-[38px] font-medium leading-tight text-[#2b2b32]">Forgot Password</h1>
                  <p className="mt-2 text-center text-[14px] leading-5 text-[#7d7d87]">
                    Enter the email address associated with your account.
                  </p>

                  <form onSubmit={handleFogetPassword} className="mt-8 space-y-5">
                    <div>
                      <label className="mb-2 block text-xs text-[#7d7d87]">Email</label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#bebec8]" />
                        <InputField
                          type="email"
                          placeholder="Loisbketeck@gmail.com"
                          name="email"
                          value={email}
                          onChange={handleChange}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <ArrowButton type="submit" text={isPending ? "Please wait..." : "Continue"} disabled={isPending} />

                    <p className="pt-1 text-center text-[11px] text-[#9a9aa3]">
                      Remember Password?{" "}
                      <Link href="/" className="text-[#7079ef]">
                        Login
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
}
