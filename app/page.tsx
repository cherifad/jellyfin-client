"use client";

import { useEffect, useState } from "react";
import { useJellyfinStore } from "@/store/jellyfinStore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  BaseItemDto,
  UserDto,
} from "@jellyfin/sdk/lib/generated-client/models";
import {
  fetchMovies,
  fetchTvShows,
  fetchRecentItems,
  fetchResumeItems,
} from "@/services/itemService";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getConnectedUser } from "@/services/authService";
import MediaCard from "@/components/library/media-card";
import { MediaHomeCaroussel } from "@/components/library/media-home-caroussel";
import { MediaCaroussel } from "@/components/library/media-caroussel";

export default function Home() {
  const { restoreSession, logout, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const [localLoading, setLoading] = useState(true);
  const [movies, setMovies] = useState<BaseItemDto[]>([]);
  const [tvShows, setTvShows] = useState<BaseItemDto[]>([]);
  const [recentItems, setRecentItems] = useState<BaseItemDto[]>([]);
  const [connectedUser, setConnectedUser] = useState<UserDto | null>(null);
  const [resumeItems, setResumeItems] = useState<BaseItemDto[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!api) {
      return;
    }
    const getMovies = async () => {
      setLoading(true);
      const movieList = await fetchMovies(api, 20);
      if (!movieList.success) {
        console.error("Failed to fetch movies:", movieList.error);
        return;
      }
      setMovies(movieList.data);
      setLoading(false);
    };

    const getTvShows = async () => {
      setLoading(true);
      const tvShowList = await fetchTvShows(api, 20);
      if (!tvShowList.success) {
        console.error("Failed to fetch TV shows:", tvShowList.error);
        return;
      }
      setTvShows(tvShowList.data);
      setLoading(false);
    };

    const getRecentItems = async () => {
      setLoading(true);
      const recentItemList = await fetchRecentItems(api, 20);
      if (!recentItemList.success) {
        console.error("Failed to fetch recent items:", recentItemList.error);
        return;
      }
      setRecentItems(recentItemList.data);
      setLoading(false);
    };

    const getResumeItems = async () => {
      setLoading(true);
      const resumeItemList = await fetchResumeItems(api, 20);
      if (!resumeItemList.success) {
        console.error("Failed to fetch resume items:", resumeItemList.error);
        return;
      }
      setResumeItems(resumeItemList.data);
      setLoading(false);
    };

    getMovies();
    getTvShows();
    getRecentItems();
    getResumeItems();

    getConnectedUser(api).then((user) => {
      setConnectedUser(user);
    });
  }, [api, loading]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading...</p>;
  }

  if (!api) {
    return null; // Redirecting to login
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <>
      <MediaHomeCaroussel medias={movies} />
      <MediaCaroussel
        medias={recentItems}
        title="Recently Added"
        viewAllTitle="View All"
      />
      <MediaCaroussel
        medias={resumeItems}
        title="Continue Watching"
        viewAllTitle="View All"
        buttonTitle="Resume"
      />
      <MediaCaroussel
        medias={tvShows}
        title="TV Shows"
        viewAllTitle="View All"
      />
      <MediaCaroussel medias={movies} title="Movies" viewAllTitle="View All" />
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}
