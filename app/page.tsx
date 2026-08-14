import PawtomeApp from "./PawtomeApp";
import { getAnimalCatalog } from "@/lib/catalog-repository";

export default async function Home() {
  const catalog = await getAnimalCatalog();
  return <PawtomeApp route="/" catalogEntries={catalog.entries} catalogSource={catalog.source} catalogWarning={catalog.warning} />;
}
