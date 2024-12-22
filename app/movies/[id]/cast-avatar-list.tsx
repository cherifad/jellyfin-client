"use client";

import { BaseItemPerson } from "@jellyfin/sdk/lib/generated-client/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildPosterUrl, getInitals } from "@/lib/utils";
import { useJellyfinStore } from "@/store/jellyfinStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CastAvatarListProps {
  cast: BaseItemPerson[];
}

export default function CastAvatarList({ cast }: CastAvatarListProps) {
  const { serverUrl } = useJellyfinStore();

  return (
    <ul className="flex">
      {cast.slice(0, 5).map((person) => (
        <li
          key={person.Id}
          className="-ml-4 hover:z-10 hover:scale-125 transition-transform duration-300 select-none cursor-pointer truncate flex flex-col items-center"
        >
          <Avatar className="w-20 h-20 border-2 border-white">
            <AvatarImage
              src={buildPosterUrl(serverUrl ?? "", person.Id ?? "")}
              alt={person.Name ?? ""}
              className="object-cover"
            />
            <AvatarFallback>{getInitals(person.Name ?? "")}</AvatarFallback>
          </Avatar>
          <p className="text-center text-xs mt-2 truncate text-wrap w-16">{person.Name}</p>
        </li>
      ))}
      {cast.length > 5 && (
        <li className="-ml-4 hover:z-10 hover:scale-125 transition-transform duration-300 select-none cursor-pointer">
          <Button variant="blurred" className="w-20 h-20 shadow-lg">
            <Plus className="text-primary w-10 h-14" />
          </Button>
          <p className="text-center text-xs mt-2">More</p>
        </li>
      )}
    </ul>
  );
}
