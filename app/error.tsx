"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="container route-state" role="alert"><p className="eyebrow">Pawtome</p><h1>We could not load this page.</h1><p>Your saved local data is unchanged. Try the request again.</p><button className="button primary" onClick={reset}>Try again</button></main>;
}
