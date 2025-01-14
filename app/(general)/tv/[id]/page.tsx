import TvDetails from "./tv-details";

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <TvDetails tvId={id} />;
}
