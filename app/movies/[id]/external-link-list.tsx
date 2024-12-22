import { ExternalUrl } from "@jellyfin/sdk/lib/generated-client/models";
import Link from "next/link";
import Image from "next/image";

interface ExternalLinkListProps {
  externalLinks: ExternalUrl[];
}

const getImgUrl = (name: string) => {
  switch (name) {
    case "IMDb":
      return "/providers/IMDb.svg";
    case "TheMovieDb":
      return "/providers/TMDB.svg";
    case "TVDb":
      return "/providers/tvdb.png";
    case "Wikipedia":
      return "/providers/wikipedia.png";
    case "Trakt":
      return "/providers/trakt.svg";
    default:
      return "/providers/link.png";
  }
};

export default function ExternalLinkList({
  externalLinks,
}: ExternalLinkListProps) {
  return (
    <div className="flex gap-2 my-6">
      {externalLinks.map((link, index) => (
        <div key={`external-link-${index}`} className="h-12 w-12">
          <Link
            href={link.Url ?? "#"}
            className="opacity-65 hover:opacity-100 transition-opacity h-full flex items-center "
          >
            <Image
              src={getImgUrl(link.Name ?? "")}
              width={80}
              height={50}
              alt={link.Name ? link.Name + " Logo" : "External Link"}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
