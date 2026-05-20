"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import {
  changeUserPasswordService,
  deleteUserProfileService,
  getUserProfileService,
  getUserTransactionsService,
  updateUserProfileService,
} from "@/services/admin-services";
import { toast } from "sonner";
import { EditIcon } from "@/utils/svgicons";

type ProfileData = {
  _id: string;
  fullName: string;
  role: string;
  email: string;
  image: string;
  membershipBought: boolean;
  deviceType: string;
};

type PasswordErrors = {
  oldPassword?: string;
  newPassword?: string;
};

type ProductTransaction = {
  _id: string;
  productId?: {
    name?: string;
  };
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);

  // =========================
  // CHANGE 1:
  // Better loading separation
  // pageLoading => profile loading
  // transactionsLoading => transaction table loading
  // =========================
  const [pageLoading, setPageLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordErrors, setPasswordErrors] =
    useState<PasswordErrors>({});

  const [transactions, setTransactions] = useState<
    ProductTransaction[]
  >([]);

  const loadProfile = async () => {
    setPageLoading(true);
    setError("");

    try {
      const res = await getUserProfileService();

      const profile = res?.data?.data as ProfileData;

      setData(profile);
      setFullName(profile?.fullName ?? "");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to fetch profile.";
      setError(message);
      toast.error(message);
    } finally {
      setPageLoading(false);
    }
  };

  const loadTransactions = async () => {
    // =========================
    // CHANGE 2:
    // Added dedicated transaction loader
    // =========================
    setTransactionsLoading(true);

    try {
      const res = await getUserTransactionsService("product");

      setTransactions(
        (res?.data?.data ?? []) as ProductTransaction[]
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        "Failed to fetch transactions."
      );
      // Keep profile page usable even if transaction API fails.
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadTransactions();
  }, []);

  const handleProfileUpdate = async () => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setSavingProfile(true);
    setError("");

    try {
      const res = await updateUserProfileService({
        fullName: fullName.trim(),
      });

      const updatedProfile = res?.data?.data as ProfileData;

      setData(updatedProfile);

      if (typeof window !== "undefined") {
        const rawUser = localStorage.getItem("userDetails");

        if (rawUser) {
          const parsedUser = JSON.parse(rawUser);

          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              ...parsedUser,
              fullName: updatedProfile.fullName,
            })
          );
        }
      }

      toast.success(
        res?.data?.message ??
        "Profile updated successfully."
      );

      setShowEditModal(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const validatePasswordFields = () => {
    const nextErrors: PasswordErrors = {};

    if (!oldPassword.trim()) {
      nextErrors.oldPassword =
        "Old password is required.";
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword =
        "New password is required.";
    }

    if (newPassword && newPassword.length < 6) {
      nextErrors.newPassword =
        "New password must be at least 6 characters.";
    }

    if (
      oldPassword &&
      newPassword &&
      oldPassword === newPassword
    ) {
      nextErrors.newPassword =
        "New password must be different from old password.";
    }

    setPasswordErrors(nextErrors);

    const firstErrorMessage =
      nextErrors.oldPassword ??
      nextErrors.newPassword;

    if (firstErrorMessage) {
      toast.error(firstErrorMessage);
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordFields()) return;

    setChangingPassword(true);
    setError("");

    try {
      const res = await changeUserPasswordService({
        oldPassword,
        newPassword,
      });


      setOldPassword("");
      setNewPassword("");
      setPasswordErrors({});
      toast.success(
        res?.data?.message ??
        "Password updated successfully."
      );
      setShowPasswordModal(false);

    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to change password.";
      setError(message);
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeletingAccount(true);
    setError("");

    try {
      const res = await deleteUserProfileService();

      toast.success(
        res?.data?.data ??
        "Account deactivated successfully."
      );

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      router.replace("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to delete profile.";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };


  if (pageLoading && !data) {
    return (
      <main className="min-h-screen bg-[#d7dbe6] text-[#2f3552]">
        <div className="px-3 pt-3">
          <RouteHeader activeItem="Membership Pass" />

          <div className="flex min-h-[70vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#596086]" />
          </div>
        </div>

        <WebsiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#d7dbe6] text-[#2f3552]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="" />

        <section className="mx-auto mt-10 w-full max-w-[1200px] pb-12 items-center">
          <div className="grid gap-5 md:grid-cols-[0.5fr_1fr]  items-center">
            <div className="mx-auto h-[200px] w-[200px] md:h-[320px] md:w-[320px] overflow-hidden p-1 bg-white rounded-[999px] border-[6px] border-white shadow-md">
              <Image
                src={
                  data?.image
                    ? data.image
                    : "/assets/defaultProfile.png"
                }
                alt="Profile"
                width={190}
                height={190}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-4xl font-normal text-[#7b84f7] rasputin">
                    {data?.fullName ?? "-"}
                  </h1>

                  <p className="px-7 py-2 bg-white rounded-3xl  mt-2 inline-block text-[#848EFF] text-sm font-semibold ">
                    {data?.membershipBought
                      ? "Member"
                      : "Not a Member"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="flex gap-1 rounded-full bg-[#8b93fb] px-4 py-2 text-xs text-white items-center"
                >
                  <EditIcon />
                  Edit Profile
                </button>
              </div>

              <div className="mt-5 grid gap-5 text-xs text-[#6d7394] sm:grid-cols-3">
                <p>
                  <span className="text-[#7E7E8A] text-sm font-normal leading-6">
                    Email Address
                  </span>
                  <br />
                  <span className="text-[#1C2329] text-sm font-medium mt-2">
                    {data?.email ?? "-"}
                  </span>
                </p>

                <p>
                  <span className="text-[#7E7E8A] text-sm font-normal leading-6 ">
                    Last Match
                  </span>
                  <br />
                  <span className="text-[#1C2329] text-sm font-medium mt-2">
                    27 Dec 2025
                  </span>
                </p>

                <p>
                  <span className="text-[#7E7E8A] text-sm font-normal leading-6">
                    Device
                  </span>
                  <br />
                  <span className="text-[#1C2329] text-sm font-medium mt-2">
                    {data?.deviceType ?? "-"}
                  </span>
                </p>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl bg-[#848EFF] p-5 text-white sm:grid-cols-3">
                <div>
                  <p className=" text-[#FFFFFF] text-xs font-medium">
                    Total Matches
                  </p>
                  <p className="text-base font-normal">240</p>
                </div>

                <div>
                  <p className="text-[#FFFFFF] text-xs font-medium">
                    Last Bookings
                  </p>
                  <p className="text-base font-normal">120</p>
                </div>

                <div>
                  <p className="text-[#FFFFFF] text-xs font-medium">
                    Fav Bookings
                  </p>
                  <p className="text-base font-normal">120</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordErrors({});
                    setOldPassword("");
                    setNewPassword("");
                    setShowPasswordModal(true);
                  }}
                  className="rounded-full bg-[#5566d6] px-4 py-2 text-xs text-white"
                >
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-full bg-[#dd5572] px-4 py-2 text-xs text-white"
                >
                  Delete Account
                </button>
              </div>

              {error && (
                <p className="mt-3 text-sm text-[#d64567]">
                  {error}
                </p>
              )}
            </div>
          </div>


          <div className="mt-14">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl md:text-4xl font-normal text-[#848EFF] rasputin">
                Recent Transactions
              </h2>

              <button
                type="button"
                className="rounded-full bg-[#efefef] px-5 py-2 text-xs text-[#7b7b7b]"
              >
                All
              </button>
            </div>

            {/* ================= DESKTOP/TABLET TABLE ================= */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-[#10131e]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-[#7f88fb] text-white">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium">
                        Sr No.
                      </th>

                      <th className="px-4 py-3 text-sm font-medium">
                        Date
                      </th>

                      <th className="px-4 py-3 text-sm font-medium">
                        Name/Description
                      </th>

                      <th className="px-4 py-3 text-sm font-medium">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-[#d8def7]">
                    {transactionsLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center"
                        >
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[#d8def7]" />
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length > 0 ? (
                      transactions.map((row, index) => (
                        <tr
                          key={`${row._id}-${index}`}
                          className={`border-b border-neutral-700/20 ${index % 2 === 0
                              ? "bg-[#19191D]"
                              : "bg-[#14141A]"
                            }`}
                        >
                          <td className="px-4 py-4">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4">
                            {new Date(
                              row.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-4">
                            {row.productId?.name ?? "Product"}
                          </td>

                          <td className="px-4 py-4">
                            $
                            {Number(
                              row.totalPrice || 0
                            ).toFixed(2)}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${row.status === "completed"
                                  ? "bg-green-500/20 text-green-300"
                                  : row.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-[#6f7696]"
                        >
                          No product transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= MOBILE VIEW ================= */}
            <div className="space-y-4 md:hidden">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-[#596086]" />
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((row, index) => (
                  <div
                    key={`${row._id}-${index}`}
                    className="rounded-2xl bg-[#10131e] p-4 text-white shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#8f96b2]">
                          Transaction
                        </p>

                        <h3 className="mt-1 text-sm font-medium break-words">
                          {row.productId?.name ?? "Product"}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-medium capitalize whitespace-nowrap ${row.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : row.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                      >
                        {row.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#8f96b2]">Date</p>

                        <p className="mt-1 text-white">
                          {new Date(
                            row.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#8f96b2]">Amount</p>

                        <p className="mt-1 text-white">
                          $
                          {Number(
                            row.totalPrice || 0
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#8f96b2]">Sr No.</p>

                        <p className="mt-1 text-white">
                          {index + 1}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#8f96b2]">Status</p>

                        <p className="mt-1 capitalize text-white">
                          {row.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-[#10131e] py-8 text-center text-sm text-[#6f7696]">
                  No product transactions found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-medium text-[#2e3550]">
              Edit Profile
            </h3>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Full Name"
              className="mt-4 w-full rounded-lg border border-[#d8dff4] px-3 py-2 outline-none"
            />

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-full border border-[#d8dff4] px-4 py-2 text-sm text-[#4A5C7A]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingProfile}
                onClick={handleProfileUpdate}
                className="rounded-full bg-[#7F8CFF] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-medium text-[#2e3550]">
              Change Password
            </h3>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);

                if (passwordErrors.oldPassword) {
                  setPasswordErrors((prev) => ({
                    ...prev,
                    oldPassword: undefined,
                  }));
                }
              }}
              placeholder="Old Password"
              className="mt-4 w-full rounded-lg border border-[#d8dff4] px-3 py-2 outline-none"
            />

            {passwordErrors.oldPassword && (
              <p className="mt-1 text-xs text-[#d64567]">
                {passwordErrors.oldPassword}
              </p>
            )}

            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);

                if (passwordErrors.newPassword) {
                  setPasswordErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }
              }}
              placeholder="New Password"
              className="mt-3 w-full rounded-lg border border-[#d8dff4] px-3 py-2 outline-none"
            />

            {passwordErrors.newPassword && (
              <p className="mt-1 text-xs text-[#d64567]">
                {passwordErrors.newPassword}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowPasswordModal(false)
                }
                className="rounded-full border border-[#d8dff4] px-4 py-2 text-sm text-[#4A5C7A]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={changingPassword}
                onClick={handleChangePassword}
                className="inline-flex items-center justify-center rounded-full bg-[#7F8CFF] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {changingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-medium text-[#2e3550]">
              Delete Account
            </h3>

            <p className="mt-2 text-sm text-[#66708f]">
              Are you sure you want to deactivate this
              account?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                className="rounded-full border border-[#d8dff4] px-4 py-2 text-sm text-[#4A5C7A]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteProfile}
                className="rounded-full bg-[#df4f6b] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingAccount
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <WebsiteFooter />
    </main>
  );
}
