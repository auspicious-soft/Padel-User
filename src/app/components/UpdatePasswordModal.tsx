"use client";

import { PasswrodConfirmationIcon } from "@/utils/svgicons";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[320px] rounded-[20px] bg-[#f5f5f5] px-5 py-6 text-center shadow-2xl sm:max-w-[360px] sm:px-7 sm:py-8"
      >
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl sm:h-12 sm:w-12">
          {/* <Image
            src="/assets/updatePassword.png"
            alt="Password Updated"
            width={20}
            height={20}
            className="object-contain"
          /> */}
          <PasswrodConfirmationIcon />
        </div>

        {/* Title */}
        <h2 className="mt-4 font-heading text-[24px] font-semibold leading-[30px] text-[#2B2B2B] sm:text-[28px] sm:leading-[34px]">
          Password Updated
          <br />
          Successfully!
        </h2>

        {/* Description */}
        <p className="mt-3 text-[12px] leading-[18px] text-[#7B7B7B] sm:text-[13px] sm:leading-[20px]">
          Your password has been updated
          <br />
          successfully. Please login to continue.
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-[42px] w-full rounded-full bg-[#6E7BFF] text-[14px] font-medium text-white transition hover:opacity-90 sm:h-[46px] sm:text-[15px]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;