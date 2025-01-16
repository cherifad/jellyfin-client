import PersonDetails from "@/components/library/person-details";

export default async function ActorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <PersonDetails personId={id} />;
}
