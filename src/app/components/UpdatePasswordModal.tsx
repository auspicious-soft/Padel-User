"use client";

import Image from "next/image";
import React, { useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[342px] rounded-[20px] bg-[#f4f4f4] px-8 py-10 text-center shadow-xl"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6f80ff]">
          <Image src="/assets/updatePassword.png" alt="Password updated" width={22} height={22} />
        </div>

        <h3 className="mt-6 font-heading text-[48px] font-extrabold leading-[1.05] text-[#202530]">
          Password Updated Successfully!
        </h3>
        <p className="mt-4 text-[18px] leading-7 text-[#666a73]">
          Your password has been updated successfully. Please login to continue.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 h-14 w-full rounded-full bg-[#7382ff] text-2xl font-medium text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
