"use client";

import { useJellyfinStore } from "@/store/jellyfinStore";
import { useEffect, useState } from "react";
import { getDetails, getVideoStream } from "@/services/itemService";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useBgStore } from "@/store/bgStore";
import {
  buildBackdropUrl,
  buildPosterUrl,
  buildLogoUrl,
  ticksToString,
  truncateNumber,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import CastAvatarList from "./cast-avatar-list";
import ExternalLinkList from "./external-link-list";
import { Button } from "@/components/ui/button";
import { Clock4, CalendarDays } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "@/components/player/player";

interface MovieDetailsProps {
  movieId: string;
}

export default function MovieDetails({ movieId }: MovieDetailsProps) {
  const [movie, setMovie] = useState<BaseItemDto | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const { user, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const { setBgImageUrl } = useBgStore();

  useEffect(() => {
    if (!user || !api) {
      return;
    }

    console.log("Fetching movie details for:", movieId);

    getDetails(api, movieId, user.Id!)
      .then((result) => {
        if (result.success) {
          setMovie(result.data);
          setBgImageUrl(
            result.data.Name || "Movie Poster",
            buildBackdropUrl(serverUrl ?? "", result.data)
          );
          //   getVideoStream(api, result.data.MediaSources![0].Id ?? "").then(
          //     (result) => {
          //       if (result.success) {
          //         setVideo(result.data);
          //         console.log("Fetched video stream:", result.data);
          //       } else {
          //         console.error("Failed to fetch video stream:", result.error);
          //       }
          //     }
          //   );
        } else {
          console.error("Failed to fetch movie details:", result.error);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch movie details:", error);
      });
  }, [user, api, loading]);

  if (loading || !movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/3">
      <div className="flex items-center gap-2">
        {movie.ImageTags?.Logo ? (
          <Image
            src={buildLogoUrl(serverUrl ?? "", movie)}
            width={200}
            height={200}
            alt={movie.Name ? movie.Name + " Logo" : "Movie Logo"}
          />
        ) : (
          <h1 className="text-4xl font-bold">
            {movie.Name}
          </h1>
        )}
        <Button variant="blurred" className="w-14 h-14">
          {movie.OfficialRating}
        </Button>
      </div>
      {movie.Taglines && movie.Taglines[0] && (
        <p className="my-6 text-opacity-65 italic">{movie.Taglines[0]}</p>
      )}
      <p className="my-6 text-opacity-65">{movie.Overview}</p>
      <CastAvatarList cast={movie.People ?? []} />
      <ExternalLinkList externalLinks={movie.ExternalUrls ?? []} />
      <div className="flex gap-2">
        <p>{truncateNumber(movie.CommunityRating ?? 0, 1)}/10</p>
        <p className="flex gap-2">
          <CalendarDays size={24} />
          {movie.ProductionYear}
        </p>
        <p className="flex gap-2">
          <Clock4 size={24} />
          {ticksToString(movie.RunTimeTicks ?? 0)}
        </p>
      </div>
      <div className="flex gap-2 my-6">
        {movie.Genres?.map((genre) => (
          <Button key={genre} variant="border" className="font-normal" asChild>
            <Link href={`/movies/genre/${genre}`}>{genre}</Link>
          </Button>
        ))}
      </div>
      <VideoPlayer src="/video/300.mkv" type="video/webm" />
    </div>
  );
}
