# Pawtome

Pawtome is a responsive, evidence-traceable multi-species pet knowledge and personalized care companion built with Next.js and an optional Supabase backend.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm test
```

`npm test` regenerates and validates deterministic seed SQL, builds the production app, and runs focused catalog/upload-boundary tests. See [docs/database-and-setup.md](docs/database-and-setup.md) for Supabase/Vercel setup and the database relationship diagram, and [docs/sources-and-licensing.md](docs/sources-and-licensing.md) for evidence and image-rights boundaries.

## Deploy

This project is configured for Vercel. Production deployment and database mutation require explicit confirmation; local builds do not fabricate credentials.
