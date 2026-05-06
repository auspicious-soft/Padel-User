// 'use client';

// export default function Loader() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
//       <div className="flex flex-col items-center gap-4">
//         {/* Spinner */}
//         <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-pink-500 animate-spin" />

//         {/* Text */}
//         <p className="text-sm text-zinc-300">Loading...</p>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xl z-[9999]">
      <motion.div
        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;
