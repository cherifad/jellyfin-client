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
import { getSeasons } from "@/services/tvService";
import { MediaCaroussel } from "@/components/library/media-caroussel";

interface TvDetailsProps {
  tvId: string;
}

export default function TvDetails({ tvId }: TvDetailsProps) {
  const [tv, setTv] = useState<BaseItemDto | null>(null);
  const [seasons, setSeasons] = useState<BaseItemDto[] | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const { user, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const { setBgImageUrl } = useBgStore();

  useEffect(() => {
    if (!user || !api) {
      return;
    }

    console.log("Fetching tv details for:", tvId);

    getDetails(api, tvId, user.Id!)
      .then((result) => {
        if (result.success) {
          console.log("Fetched tv details:", result.data);
          setTv(result.data);
          setBgImageUrl(
            result.data.Name || "tv Poster",
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
          console.error("Failed to fetch tv details:", result.error);
        }
      })
      .then(() => {
        getSeasons(api, tvId, user.Id!).then((result) => {
          if (result.success) {
            console.log("Fetched seasons:", result.data);
            setSeasons(result.data);
          } else {
            console.error("Failed to fetch seasons:", result.error);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to fetch tv details:", error);
      });
  }, [user, api, loading]);

  if (loading || !tv) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="w-1/3">
        <div className="flex items-center gap-2">
          {tv.ImageTags?.Logo ? (
            <Image
              src={buildLogoUrl(serverUrl ?? "", tv)}
              width={200}
              height={200}
              alt={tv.Name ? tv.Name + " Logo" : "tv Logo"}
            />
          ) : (
            <h1 className="text-4xl font-bold">{tv.Name}</h1>
          )}
          <Button variant="blurred" className="w-14 h-14">
            {tv.OfficialRating}
          </Button>
        </div>
        {tv.Taglines && tv.Taglines[0] && (
          <p className="my-6 text-opacity-65 italic">{tv.Taglines[0]}</p>
        )}
        <p className="my-6 text-opacity-65">{tv.Overview}</p>
        <CastAvatarList cast={tv.People ?? []} />
        <ExternalLinkList externalLinks={tv.ExternalUrls ?? []} />
        <div className="flex gap-2">
          <p>{truncateNumber(tv.CommunityRating ?? 0, 1)}/10</p>
          <p className="flex gap-2">
            <CalendarDays size={24} />
            {tv.ProductionYear}
          </p>
          <p className="flex gap-2">
            <Clock4 size={24} />
            {ticksToString(tv.RunTimeTicks ?? 0)}
          </p>
        </div>
        <div className="flex gap-2 my-6">
          {tv.GenreItems?.map((genre) => (
            <Button
              key={genre.Id}
              variant="border"
              className="font-normal"
              asChild
            >
              <Link href={`/genre/${genre.Id}`}>{genre.Name}</Link>
            </Button>
          ))}
        </div>
        <VideoPlayer src="/video/300.mkv" type="video/webm" />
      </div>
      <MediaCaroussel
        medias={seasons ?? []}
        title="Seasons"
        buttonTitle="View"
      />
    </div>
  );
}
