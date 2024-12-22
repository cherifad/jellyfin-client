
interface VideoPlayerProps {
  src: string;
  type: string;
  poster?: string;
  subtitles?: { src: string; label: string; srclang: string }[];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type,
  poster,
  subtitles = [],
}) => {
  return <></>;
};
