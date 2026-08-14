import PawtomeApp from "../PawtomeApp";
import { getAnimalCatalog } from "@/lib/catalog-repository";

export default async function RoutedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const [{ slug }, catalog] = await Promise.all([params, getAnimalCatalog()]);
  return <PawtomeApp route={`/${slug.join("/")}`} catalogEntries={catalog.entries} catalogSource={catalog.source} catalogWarning={catalog.warning} />;
}
