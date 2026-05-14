"use client";
import React from "react";
import { motion } from "framer-motion";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex  items-center justify-center bg-black/80 px-4">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
