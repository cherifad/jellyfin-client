import ItemDetails from "@/components/library/item-details";
import { getDetails } from "@/services/itemService";

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <ItemDetails itemId={id} />;
}
