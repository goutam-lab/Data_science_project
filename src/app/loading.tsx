// src/app/loading.tsx

"use client";

import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../public/animations/loading.json";

export default function Loading() {
  // This is the component that will be displayed during page transitions.
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-48 h-48">
        <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
      </div>
    </div>
  );
}