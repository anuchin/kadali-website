# ಕದಳಿ ಮಹಿಳಾ ಸಮಾಜ — Website

Modern, mobile-first website for Kadali women's club, built with **Astro + TypeScript + Tailwind CSS**, content managed by **Sveltia CMS**, hosted free on **Cloudflare Pages**.

- Public site: `https://yourdomain.org`
- CMS dashboard: `https://admin.yourdomain.org` (or `yourdomain.org/admin/`)
- Content + media live in the GitHub repository; publishing = commit → automatic rebuild.

## Requirements

- Node.js 20+ and pnpm
- A GitHub account (free) and Cloudflare account (free)

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static build into dist/
```

## Project structure

```
kadali/
├── public/
│   ├── admin/            # Sveltia CMS (index.html + config.yml)
│   ├── images/           # media uploaded via the CMS
│   └── robots.txt, favicon.svg
├── src/
│   ├── components/       # SiteNav, SiteFooter, ArticleCard, EventCard, SectionHead
│   ├── layouts/Base.astro
│   ├── lib/content.ts    # dates, event status helpers
│   ├── pages/            # index, about, articles/, events/, gallery, contact, privacy
│   ├── content/          # ← CMS-managed content (markdown + images)
│   │   ├── articles/  events/  announcements/  gallery/  site/home.md
│   ├── styles/global.css # design tokens + motifs (Tailwind v4)
│   └── content.config.ts # collection schemas (TypeScript)
├── astro.config.mjs      # set `site:` to your domain before deploying
└── docs/                 # validation report + guides
```

## Deployment (zero cost)

1. **GitHub**: create a **private** repo, push this project.
2. **Auth worker**: deploy [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)
   to Cloudflare Workers (one-click). Register a GitHub OAuth app with callback
   `<WORKER_URL>/callback`. Set worker env vars `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
   `ALLOWED_DOMAINS=admin.yourdomain.org`.
3. **Public site**: Cloudflare Pages → Create project → connect the GitHub repo.
   Build command `pnpm build`, output dir `dist`. Set `site` in `astro.config.mjs`.
4. **CMS**: either use `yourdomain.org/admin/` (already built into the site),
   or create a second Pages project serving only `public/admin/` and map `admin.yourdomain.org` to it.
5. Update `public/admin/config.yml`: set `backend.repo` and `backend.base_url` (worker URL).
6. **Branch protection** (required for the review workflow):
   protect `main` — no direct pushes, require a pull request before merging,
   restrict merges to administrators (the officer(s)).
7. Invite members as collaborators with **Write** (never Admin). See
   `docs/admin-guide.md` for the full security model.

## Publishing workflow (members)

Draft → officer review → publish. Full illustrated guide: `docs/member-guide.md`.

## Backups

All content is markdown + images in Git. To back up: clone/download the repo,
or enable periodic GitHub repo snapshots (`git bundle create kadali.bundle --all`).
