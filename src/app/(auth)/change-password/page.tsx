"use client";
import Image from "next/image";
import ArrowButton from "@/app/components/Button";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import UpdatePasswordModal from "@/app/components/UpdatePasswordModal";
import { toast } from "sonner";
import { resetPassword } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { useDataContext } from "@/app/components/DataContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search } from "lucide-react";
import FullPageLoader from "@/app/components/Loaders";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useDataContext();
    const { data: session } = useSession();

      useEffect(() => {
        if (session) {
          router.push("/authority");
        }
      }, [session, router]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    // 🔹 Validation checks
    if (!password && !confirmPassword) {
      toast.error("Please Enter Password and Confirm Password.");
      return;
    }

    if (password && !confirmPassword) {
      toast.error("Please Enter Confirm Password.");
      return;
    }

    if (!password && confirmPassword) {
      toast.error("Please Enter Both Password and Confirm Password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    const resolvedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("auth.changePasswordToken") ?? "" : "");

    if (!resolvedToken) {
      toast.error("Session Expired try again and update password");
      return;
    }
    setLoading(true);
    startTransition(async () => {
      try {
        const response = await resetPassword({ password, token: resolvedToken });
        if (response?.status === 200) {
          setToken("");
          toast.success("Password updated successfully");
          setIsModalOpen(true);
        } else {
          toast.error("Failed to update password");
        }
      } catch (err: any) {
        if (err?.response?.status === 400) {
          toast.error("Invalid password format");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const handleCloseModalWithNavigation = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* {loading ? (
        <FullPageLoader />
      ) : (
        <> */}
          <main className="relative min-h-screen overflow-hidden">
            <Image src="/assets/AuthImage.png" alt="Auth background" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f87f6]">
              <Search className="h-5 w-5 text-white" />
            </div>

            <section className="relative z-10 flex min-h-screen items-center px-4 md:px-14">
              <form onSubmit={handleChangePassword} className="w-full max-w-[430px] rounded-3xl bg-[#f4f4f7] px-5 py-8 shadow-[0_20px_60px_rgba(8,10,20,0.22)] md:px-7">
                <h1 className="text-center text-[38px] font-medium leading-tight text-[#2b2b32]">Create New Password</h1>
                <p className="mx-auto mt-2 max-w-[310px] text-center text-[14px] leading-5 text-[#7d7d87]">
                  Create new password. The new password should be at least 8 digit long.
                </p>

                <div className="mt-8 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs text-[#7d7d87]">New Password</label>
                    <div className="relative">
                      <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="......."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-9"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7c2]" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#7d7d87]">Confirm Password</label>
                    <div className="relative">
                      <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="......."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-9"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7c2]" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 cursor-pointer">
                  <ArrowButton text={isPending ? "Please wait..." : "Update Password"} type="submit" disabled={isPending} />
                </div>

                <p className="pt-3 text-center text-[11px] text-[#9a9aa3]">
                  Remember Password?{" "}
                  <Link href="/login" className="cursor-pointer text-[#7079ef]">
                    Login
                  </Link>
                </p>
              </form>
            </section>

            <UpdatePasswordModal isOpen={isModalOpen} onClose={handleCloseModalWithNavigation} />
          </main>
        </>
      // )}
    // </>
  );
}
