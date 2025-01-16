"use client";

import { useJellyfinStore } from "@/store/jellyfinStore";
import { useEffect, useState } from "react";
import {
  getDetails,
  getSimilars,
  getVideoStream,
} from "@/services/itemService";
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
import { MediaCaroussel } from "./media-caroussel";
import { getSeasons } from "@/services/tvService";

interface ItemDetailsProps {
  itemId: string;
}

export default function ItemDetails({ itemId }: ItemDetailsProps) {
  const [item, setItem] = useState<BaseItemDto | null>(null);
  const [seasons, setSeasons] = useState<BaseItemDto[] | null>(null);
  const [similars, setSimilars] = useState<BaseItemDto[] | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const { user, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const { setBgImageUrl } = useBgStore();

  useEffect(() => {
    if (!user || !api) {
      return;
    }

    console.log("Fetching movie details for:", itemId);

    getDetails(api, itemId, user.Id!)
      .then((result) => {
        if (result.success) {
          setItem(result.data);
          setBgImageUrl(
            result.data.Name || "Movie Poster",
            buildBackdropUrl(serverUrl ?? "", result.data)
          );

          if (result.data && result.data.Type !== "Movie") {
            getSeasons(api, itemId, user.Id!)
              .then((result) => {
                if (result.success) {
                  console.log("Fetched seasons:", result.data);
                  setSeasons(result.data);
                } else {
                  console.error("Failed to fetch seasons:", result.error);
                }
              })
              .then(() => {
                getSimilars(api, itemId, user.Id!).then((result) => {
                  if (result.success) {
                    console.log("Fetched similars:", result.data);
                    setSimilars(result.data);
                  } else {
                    console.error("Failed to fetch similars:", result.error);
                  }
                });
              });
          }
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

  if (loading || !item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-6 flex-col">
      <div className="w-1/3">
        <div className="flex items-center gap-2">
          {item.ImageTags?.Logo ? (
            <Image
              src={buildLogoUrl(serverUrl ?? "", item)}
              width={200}
              height={200}
              alt={item.Name ? item.Name + " Logo" : "Movie Logo"}
            />
          ) : (
            <h1 className="text-4xl font-bold">{item.Name}</h1>
          )}
          <Button variant="blurred" className="w-14 h-14">
            {item.OfficialRating}
          </Button>
        </div>
        {item.Taglines && item.Taglines[0] && (
          <p className="my-6 text-opacity-65 italic">{item.Taglines[0]}</p>
        )}
        <p className="my-6 text-opacity-65">{item.Overview}</p>
        <CastAvatarList cast={item.People ?? []} />
        <ExternalLinkList externalLinks={item.ExternalUrls ?? []} />
        <div className="flex gap-2">
          <p>{truncateNumber(item.CommunityRating ?? 0, 1)}/10</p>
          <p className="flex gap-2">
            <CalendarDays size={24} />
            {item.ProductionYear}
          </p>
          <p className="flex gap-2">
            <Clock4 size={24} />
            {ticksToString(item.RunTimeTicks ?? 0)}
          </p>
        </div>
        <div className="flex gap-2 my-6">
          {item.Genres?.map((genre) => (
            <Button
              key={genre}
              variant="border"
              className="font-normal"
              asChild
            >
              <Link href={`/medias/genre/${genre}`}>{genre}</Link>
            </Button>
          ))}
        </div>
        <VideoPlayer src="/video/300.mkv" type="video/webm" />
      </div>
      {seasons && seasons.length > 0 && (
        <MediaCaroussel
          medias={seasons ?? []}
          title="Seasons"
          buttonTitle="View"
        />
      )}
      {similars && similars.length > 0 && (
        <MediaCaroussel
          medias={similars ?? []}
          title="Similars"
          buttonTitle="View"
        />
      )}
    </div>
  );
}
