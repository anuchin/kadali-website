# Administrator Guide — ಕದಳಿ ಜಾಲತಾಣ

For the officer/developer managing the site. Read `docs/phase0-sveltia-validation.md`
first — it documents the security model this guide builds on.

## Security model (know this cold)

- **Sveltia CMS has no user roles.** CMS access = GitHub repository access.
- Members are invited as collaborators with **Write** on the (private) repository.
  Write is **repository-wide**: a member editing through the CMS sees only content
  collections, but technically their GitHub token can write anything in the repo.
- Mitigations (already required by setup):
  - `main` branch protected: no direct pushes, PR + approval required,
    only admins may merge → nothing reaches the live site without an officer.
  - CMS uses the Editorial workflow; the officer's approval is the publish gate.
  - Auth worker `ALLOWED_DOMAINS` prevents token theft by other sites.
- **Removing a member** = remove the GitHub collaborator (Settings → Collaborators).
  Takes effect immediately; their browser token stops working on next use.

## Inviting a new contributor

1. Member creates a free GitHub account (help them over phone if needed).
2. Repo → Settings → Collaborators → Add people → their username, role **Write**.
3. They sign in at `admin.yourdomain.org` → "Sign in with GitHub" → done.
4. Send them `docs/member-guide.md`.

## Publishing/reviewing as the officer

1. Sign in to the CMS. Entries saved by members appear under each collection
   with draft status (they live on auto-created branches + pull requests).
2. Open the draft, review, edit if needed.
3. **Publish** merges the PR into `main` (requires your admin/maintain rights —
   this is why branch protection restricts merges to officers).
   Cloudflare Pages rebuilds automatically; live in ~2–3 minutes.
4. To reject: delete the entry in the CMS (or close the PR on GitHub) and tell the member.

## Backups and recovery

- Every change is a Git commit. Nothing is stored anywhere else.
- **Backup**: Settings your schedule — e.g. monthly:
  `git clone --mirror <repo-url> kadali-backup.git` (or Download ZIP from GitHub).
- **Restore a deleted/broken article**: GitHub → commits for
  `src/content/articles/<slug>.md` → Revert / restore the old version,
  or edit in the CMS again.
- **Site broken by a publish**: Cloudflare Pages → Deployments → roll back to the
  previous deployment instantly, then fix the content.

## Domain and deployment

- DNS and the domain are managed in Cloudflare (only recurring cost: domain renewal).
- Public site: Pages project connected to the GitHub repo (`main`), build `pnpm build`,
  output `dist`.
- CMS: same build (it includes `/admin/`); optionally a separate Pages project for
  `admin.yourdomain.org`.
- Auth worker: Cloudflare dashboard → Workers → `sveltia-cms-auth`. Secrets are in
  the worker's encrypted env vars — never commit them.
- After changing the domain in `astro.config.mjs` (`site:`), also update
  `public/robots.txt` sitemap URL.

## Changing what editors can edit

All form fields live in `public/admin/config.yml` (collections: articles, events,
announcements, gallery, homepage). Website schemas live in `src/content.config.ts`.
The two must stay in sync — if you add a field to one, add it to the other.

## Image hygiene

- Sveltia converts uploads (including HEIC) to WebP and rejects files > 4 MB
  (`media_library.max_file_size`). Don't raise the cap casually: images live in Git.
- If the repo grows past a few GB after years of photos, move media to Cloudflare R2
  (Sveltia supports it natively) — decision documented for then, not now.
