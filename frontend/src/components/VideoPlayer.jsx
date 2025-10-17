import React, { useState } from 'react';

function VideoPlayer() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <div className="max-w-[350px] mx-auto p-4 absolute top-[55%] left-[50%]">
      <video
        src="/video.mp4"
        autoPlay
        muted
        loop
        controls
        preload="metadata"
        className="w-full rounded-xl shadow-lg  border-2 border-white"
        onError={() => setHasError(true)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
