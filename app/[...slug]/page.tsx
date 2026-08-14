import PetWiseApp from "../PetWiseApp";

export default async function RoutedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <PetWiseApp route={`/${slug.join("/")}`} />;
}
