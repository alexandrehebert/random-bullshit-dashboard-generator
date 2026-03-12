# Random Bullshit Dashboard Generator

A fun Next.js SPA that creates absurd dashboards on demand.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide icons (`lucide-react`)
- Deterministic random generation (`seedrandom`)

## Features

- User-selectable dashboard style
- Seeded generation for reproducible dashboards
- One-click regenerate button
- Shareable seed-only link (read-only dashboard, no generator form)
- API parity endpoint: `/api/widgets`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Useful Scripts

```bash
npm run lint
npm run type-check
npm run build
```

## API

Generate widgets via query params:

```txt
GET /api/widgets?style=corporate-parody&seed=demo-123&count=9
```

Supported styles:

- `corporate-parody`
- `midnight-ops`
- `cyberpunk-absurd`
- `retro-terminal`
- `clean-meme-minimal`

Seed-only share route:

```txt
GET /s/:seed
```

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Keep framework preset as Next.js.
4. Deploy.

This project is already Vercel-friendly and includes a basic `vercel.json`.
