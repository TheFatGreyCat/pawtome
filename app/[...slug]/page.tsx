import PawtomeApp from "../PawtomeApp";

export default async function RoutedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <PawtomeApp route={`/${slug.join("/")}`} />;
}

