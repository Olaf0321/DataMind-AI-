import React from 'react';

const VideoPlayer = () => {
  return (
    <div className="w-full h-full">
      <video
        src="/videos/top.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
