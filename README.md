# Picnic ABM Landing Pages

Personalized Gumloop picnic basket landing pages for ABM outreach. Each prospect gets a unique URL — for example `/picnic/dima` shows **"Hi Dima, We want to send you a picnic basket"** at the top.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/picnic/dima](http://localhost:3000/picnic/dima) to preview a personalized page.

## Routes

| URL | Greeting |
|-----|----------|
| `/picnic/dima` | Hi Dima, |
| `/picnic/sarah` | Hi Sarah, |
| `/picnic/john-smith` | Hi John Smith, |
| `/picnic` | Hi there, (fallback) |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no build settings needed.
4. Deploy.

### Custom domain

To serve at `gumloop.com/picnic/*`:

- **Option A — subdomain:** Point `picnic.gumloop.com` (or similar) to the Vercel project. Links become `https://picnic.gumloop.com/dima`.
- **Option B — path on main domain:** If `gumloop.com` already hosts another site, add a rewrite in that project's `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/picnic/:path*", "destination": "https://your-picnic-project.vercel.app/picnic/:path*" }
  ]
}
```

Or deploy this as the main `gumloop.com` site if it only needs the picnic pages.

## Project structure

- `app/picnic/[name]/page.tsx` — dynamic personalized route
- `components/ScrollHero.tsx` — scroll-driven JPG frame animation (270 frames)
- `components/PicnicPage.tsx` — main page layout
- `data/picnic.json` — tool logos, use cases, basket images
- `public/frames/` — scrollytelling JPG frames
- `gumloop-picnic-page.txt` — original HTML reference (kept for reference)

## Form webhook

The claim form validates locally and shows a success message without sending data anywhere. To connect a webhook later, set `NEXT_PUBLIC_WEBHOOK_URL` and update `components/ClaimForm.tsx`.

## Assets

- `assets/picnic-frames.zip` — source zip for frames (extracted to `public/frames/`)
- `assets/picnic-food-video.mp4` — source video (backup; frames are used for scroll hero)
