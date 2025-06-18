import React from 'react';
import Image from "next/image";

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1.5px]">
    {/* Fullscreen invisible overlay to block interaction */}
    <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}></div>

    {/* Centered loading image */}
    <div className="relative z-10">
      <Image
        src="/images/loading.gif"
        alt="loading"
        width={100}
        height={100}
        className="opacity-70"
      />
    </div>
  </div>
);

export default LoadingSpinner;