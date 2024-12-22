// components/VideoPlayer.tsx
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./custom-controls-bridge";
import Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = true,
  controls = false,
  loop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, {
        autoplay,
        controls,
        loop,
        fluid: true,
        sources: [
          {
            src,
            type: "video/mp4",
          },
        ],
      });

      // Add the custom control component to the Video.js player
      playerRef.current.addChild("CustomControlsBridge", {});

      // Dispose of the player when the component unmounts
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [src, autoplay, controls, loop]);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered h-96"
        poster={poster}
      />
    </div>
  );
};

export default VideoPlayer;
