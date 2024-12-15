"use client";

import { useEffect, useState } from "react";
import { useJellyfinStore } from '@/store/jellyfinStore';
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { fetchMovies } from '@/lib/jellyfinClient';

export default function Home() {
  const { restoreSession, logout, serverUrl } = useJellyfinStore();
  const { api, loading } = useAuth();
  const [localLoading, setLoading] = useState(true);
  const [movies, setMovies] = useState<BaseItemDto[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    if (!api) {
      return;
    }
    const getMovies = async () => {
      setLoading(true);
      const movieList = await fetchMovies(api, 20);
      setMovies(movieList);
      setLoading(false);
    };

    getMovies();
  }, [api, loading]);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Loading...</p>;
  }

  if (!api) {
    return null; // Redirecting to login
  }


  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to your Dashboard</h1>
      <p>You are connected to: <strong>{serverUrl}</strong></p>
      <ul>
        {movies.map((movie, index) => (
          <li key={movie.Id}>
            {index + 1} : <strong>{movie.Name}</strong> ({movie.ProductionYear || 'N/A'})
            {JSON.stringify(movie)}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} style={{ color: 'white', backgroundColor: 'red' }}>
        Logout
      </button>
    </div>
  );
}
