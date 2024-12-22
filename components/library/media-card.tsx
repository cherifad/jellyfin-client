import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import Image from 'next/image'

interface MediaCardProps {
    media: BaseItemDto,
    imageUrl: string
}

export default function MediaCard({ media, imageUrl }: MediaCardProps) {
    return (
        <div className="flex flex-col items-center p-2 fading-border rounded-lg hover:p-0 transition-all cursor-pointer">
            <div className="w-full h-96 relative rounded-lg">
                <Image
                    src={imageUrl}
                    alt={media.Name || 'Movie Poster'}
                    layout="fill"
                    sizes="(max-width: 200px) 100vw, 200px"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg" // Optional: placeholder for faster loading
                    className="rounded-lg"
                />
            </div>
            <div className="w-full flex items-center justify-between">
                <p>
                    {media.ProductionYear || 'N/A'}
                </p>
                <p>
                    {media.CommunityRating}/10
                </p>
            </div>
            {/* <h1>
                {media.Name}
            </h1> */}
        </div>
    )
}