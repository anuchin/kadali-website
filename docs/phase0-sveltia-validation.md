# Sveltia CMS — Critical Requirements Validation (Phase 0)

Status: **documented validation complete; hands-on Android test pending (checklist below).**
No website code is built until the checklist items marked ☐ are signed off.

Sources consulted (2026-11-10):
- Sveltia CMS docs — GitHub backend: https://sveltiacms.app/en/docs/backends/github
- Sveltia CMS Authenticator: https://github.com/sveltia/sveltia-cms-auth
- Sveltia CMS features overview: https://sveltiacms.app/en/features
- Live demo (no account needed): https://demo.sveltiacms.app/

---

## 1. Authentication — ✅ Validated (with one free Cloudflare Worker)

- GitHub **PKCE sign-in is unimplemented** (blocked on GitHub — confirmed in docs). So a pure
  client-side OAuth login is *not* available. Do not plan around it.
- The supported path for **non-technical users** is the **authorization code flow** via an OAuth
  client. Recommended: **Sveltia CMS Authenticator**, an official, free Cloudflare Workers script.
  - One-click deploy button; GitHub OAuth app registered by us; client ID/secret stored as
    **encrypted Worker env vars** (never in the repo or frontend).
  - `ALLOWED_DOMAINS` must be set to `admin.yourdomain.org` — the worker then **refuses to issue
    tokens to any other site**, closing the abuse/leak hole.
- Alternative (rejected for members): personal access tokens — fine for the one developer/admin,
  unusable for non-technical contributors.
- Cost: Workers free tier (100k req/day) is far beyond a club's needs. **₹0.**

**Verdict: requirement met.** Login = "Sign in with GitHub" button; members never see a token.

## 2. Mobile + WYSIWYG editing — ✅ Validated on evidence; hands-on test pending

Documented capabilities (all confirmed in official docs, not marketing claims):

| Plan requirement | Sveltia capability |
|---|---|
| Visual editor (bold/italic/headings/lists/links/quotes/images) | Rich Text field on **Lexical** — toolbar, floating link editor, image paste, tables, raw mode |
| Mobile editing | Dedicated "Mobile and tablet support" incl. quick QR-code sign-in; installable as a phone app |
| Phone gallery uploads | Drag-and-drop / file-picker uploads from mobile browsers |
| Huge phone photos | **Built-in image optimisation: converts uploads to WebP, including HEIC from phones** + configurable file-size caps that block oversized uploads |
| Draft safety | Automatic in-browser draft backups, conflict detection |

**Verdict: architecture approved.** Final go/no-go needs the physical Android test below, since
only touch ergonomics can't be verified from docs.

## 3. GitHub permissions & security model — ✅ Understood; documented limitations

This is the most important finding. **Sveltia CMS has no CMS-level user roles. Authorisation is
100% GitHub repository access.** Consequences:

1. Every member who can log in and publish needs **Write access** to the repository
   (Write / Maintain / Admin role). Read-only users cannot sign in (unless Open Authoring is used).
2. **Write access is repository-wide, not per-collection.** A member with Write can, from the CMS,
   edit *any* content collection — and could also edit code if they used GitHub directly. The CMS
   UI hides this, but it does not *prevent* it. This limitation must be documented to the committee.
3. **Branch protection changes workflow behaviour** (documented): with a protected `main`
   requiring PRs, Simple Workflow collections and the Asset Library become **read-only**, while the
   **Editorial Workflow keeps working** (it commits to its own branches). GitHub does not expose
   "can this user merge?" so the Publish button may appear but the merge is refused for
   unauthorised users.

### Chosen security architecture (Editorial-first, as the plan prefers)

- Repo: **private** GitHub repo (free tier), one owner account (admin/secretary).
- Members invited as **collaborators with Write** (never Admin/Maintain).
- `main` branch **protected**: no direct pushes, PR + 1 approval required, only admins may merge.
- CMS collections configured with the **Editorial Workflow** → members save drafts → their own
  branch + PR is opened automatically → an officer approves and merges in the CMS (or GitHub).
  Publishing to live is thus gated on the officer, not the member.
- Sveltia Authenticator worker with `ALLOWED_DOMAINS=admin.yourdomain.org`.
- Removal procedure = remove the GitHub collaborator (documented in admin guide).
- Optional hardening for larger membership later: **Open Authoring** (members contribute via
  personal forks and need **no** repository write access at all) — evaluate if the club grows
  beyond ~10 contributors; slightly more friction on first use.

### Residual risks (accepted / documented)

- A Write collaborator bypassing the CMS can push to non-protected branches — mitigated by
  branch protection; content-only damage via CMS is recoverable from Git history (backup story).
- Media lives in the repo (WebP-capped); repo soft limit ~1–5 GB is fine for years at club scale;
  escape hatch: Cloudflare R2 media storage (free tier 10 GB), supported natively by Sveltia.

---

## 4. Hands-on Android validation checklist (blocking Phase 2+)

Run against the deployed demo/staging CMS on a real Android phone (Chrome):

☐ Login via "Sign in with GitHub" completes on mobile
☐ Article form: all inputs usable, no horizontal scroll
☐ Rich text: bold/heading/list/link/quote applied by touch; Kannada typing works (IME)
☐ Cover image upload opens the phone gallery; HEIC photo accepted and converted to WebP
☐ Save (draft) and Publish buttons reachable; entry appears in the list
☐ Logout/login round-trip works; unauthorised GitHub account is refused
☐ Editorial workflow: draft → PR visible to approver → publish → site rebuilds

Sign-off: ____________  Date: ________

---

## 5. Go/No-Go decision

**GO** for Phase 1–3 (foundation, design, CMS integration) using:
Astro + TypeScript + Tailwind · Sveltia CMS (RichText fields) · GitHub private repo with
protected `main` · Editorial Workflow · Sveltia CMS Authenticator on Cloudflare Workers ·
Cloudflare Pages ×2 (site + admin). Only recurring cost: the domain.
