import MovieDetails from "./movie-details";

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <MovieDetails movieId={id} />;
}
