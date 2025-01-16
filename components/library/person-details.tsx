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

interface PersonDetailsProps {
  personId: string;
}

export default function PersonDetails({ personId }: PersonDetailsProps) {
  const [item, setItem] = useState<BaseItemDto | null>(null);
  const { user, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const { setBgImageUrl } = useBgStore();

  useEffect(() => {
    if (!user || !api) {
      return;
    }

    console.log("Fetching movie details for:", personId);

    getDetails(api, personId, user.Id!)
      .then((result) => {
        if (result.success) {
          setItem(result.data);
          setBgImageUrl(
            result.data.Name || "Movie Poster",
            buildBackdropUrl(serverUrl ?? "", result.data)
          );
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
      {/* {JSON.stringify(item)} */}
      <div className="flex gap-6">
        <div className="w-1/3">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{item.Name}</h1>
          </div>
          {
            <Image
              src={buildPosterUrl(serverUrl ?? "", item.Id ?? "")}
              alt={item.Name ? item.Name + " Poster" : "Movie Poster"}
              width={400}
              height={300}
              className="rounded-md my-6"
            />
          }
        </div>
        <div className="w-2/3">
          <p className="my-6 text-opacity-65">{item.Overview}</p>
          <ExternalLinkList externalLinks={item.ExternalUrls ?? []} />
        </div>
      </div>
    </div>
  );
}
