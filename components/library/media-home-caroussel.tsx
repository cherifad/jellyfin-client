"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { type CarouselApi } from "@/components/ui/carousel";
import { useBgStore } from "@/store/bgStore";
import { useJellyfinStore } from "@/store/jellyfinStore";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { buildBackdropUrl, truncateNumber } from "@/lib/utils";

interface MediaHomeCarousselProps {
  medias: BaseItemDto[];
}

export const MediaHomeCaroussel = ({ medias }: MediaHomeCarousselProps) => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const { serverUrl } = useJellyfinStore();
  const { setBgImageUrl } = useBgStore();

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || medias.length === 0) {
      return;
    }

    setBgImageUrl(
      medias[0].Name || "Media Poster",
      buildBackdropUrl(serverUrl ?? "", medias[0])
    );

    api.on("select", () => {
      const media = medias[api.selectedScrollSnap()];
      console.log(api.selectedScrollSnap(), media);
      if (!media) {
        return;
      }
      setBgImageUrl(
        media.Name || "Media Poster",
        buildBackdropUrl(serverUrl ?? "", media)
      );
    });
  }, [api, medias]);

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-[65vh] flex flex-col"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="flex-1 border-black">
          {medias.map((media, index) => (
            <CarouselItem key={index} className="h-full flex flex-col">
              <div className="flex h-[65vh]">
                <div className="flex-1 flex flex-col justify-center p-4">
                  <h1 className="text-5xl font-bold">{media.Name}</h1>
                  <p>{media.ProductionYear || "N/A"}</p>
                  <p>
                    <span className="text-3xl">
                      {truncateNumber(media.CommunityRating ?? 0, 1)}
                    </span>
                    /10
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Button size="lg">
                      <Play className="h-6 w-6" />
                      WATCH NOW
                    </Button>
                    <Button size="lg" variant="border" asChild>
                      <Link
                        href={`${media.Type === "Movie" ? "/movies" : "/tv"}/${
                          media.Id
                        }`}
                      >
                        MORE INFO
                        <ChevronRight className="h-6 w-6" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  {/* <Image
                    src={`${serverUrl}/Items/${media.Id}/Images/Primary?Height=300&tag=${media.ImageTags?.Primary}`}
                    alt={media.Name || "Media Poster"}
                    height={300}
                    width={200}
                    className="rounded-lg"
                  />
                  <div className="text-sm mt-2">{media.Name}</div> */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </>
  );
};
