"use client";

import Lottie from "lottie-react";
import loading from "../public/loading.json";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie animationData={loading} />
    </div>
  );
}
