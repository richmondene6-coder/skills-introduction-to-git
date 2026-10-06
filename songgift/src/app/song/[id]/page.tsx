import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { publicOrder } from "@/lib/public-order";
import SongView from "./song-view";

export default async function SongPage({ params, searchParams }: PageProps<"/song/[id]">) {
  const { id } = await params;
  const { paid } = await searchParams;
  const order = await getOrder(id);
  if (!order) notFound();
  return <SongView initial={publicOrder(order)} returnedFromCheckout={paid === "1"} />;
}
