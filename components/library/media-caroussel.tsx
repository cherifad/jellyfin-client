"use client";

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
import { ChevronRight, ChevronLeft, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface MediaCarousselProps {
  medias: BaseItemDto[];
  title: string;
  buttonTitle?: string;
  viewAllLink?: string;
  viewAllTitle?: string;
}

export const MediaCaroussel = ({
  medias,
  title,
  buttonTitle = "Play",
  viewAllLink = "#",
  viewAllTitle = "View All",
}: MediaCarousselProps) => {
  const { serverUrl } = useJellyfinStore();
  const { setBgImageUrl } = useBgStore();

  const [api, setApi] = useState<CarouselApi>();

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <ChevronLeft
            onClick={() => api?.scrollPrev()}
            className="h-8 w-8 cursor-pointer"
          />
          <ChevronRight
            onClick={() => api?.scrollNext()}
            className="h-8 w-8 cursor-pointer"
          />
          <Button size="sm" asChild>
            <Link href={viewAllLink}>{viewAllTitle}</Link>
          </Button>
        </div>
      </div>
      <Carousel
        className="w-full flex flex-col transition-all duration-300 ease-in-out"
        setApi={setApi}
      >
        <CarouselContent className="border-black">
          {medias.map((media, index) => (
            <CarouselItem key={index} className="basis-1/6">
              <div className="group relative flex-1 h-full flex flex-col justify-between fading-border p-1">
                <div></div>
                <Image
                  src={`${serverUrl ?? ""}/Items/${media.Id}/Images/Primary?Height=300&tag=${media.ImageTags?.Primary}`}
                  alt={media.Name || "Media Poster"}
                  height={300}
                  width={200}
                  className="rounded-lg w-full"
                />
                <Badge className="absolute top-3 right-3 bg-opacity-50 rounded-full flex items-center">
                  <span className="text-lg">{media.CommunityRating}</span>
                  /10
                </Badge>
                <div className="flex justify-center">
                  <Button
                    className="-mt-5 w-fit flex items-center gap-2"
                    variant="blurred"
                  >
                    <Play className="h-6 w-6" />
                    {buttonTitle}
                  </Button>
                </div>
                <p className="truncate mt-2">{media.Name}</p>
                <div className="flex justify-between items-center">
                  <p>{media.ProductionYear}</p>
                  <Badge className="rounded-full">{media.Type}</Badge>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};
