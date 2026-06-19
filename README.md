# Stephan Rozario — photography portfolio

A single Next.js codebase containing both the public website and the admin
panel, built with **Payload CMS**. Photos live in **Cloudinary**, content
(pages + menu) lives in **Neon Postgres**.

- Public site: `/`
- Admin panel: `/admin`
- Domain (production): stephanrozario.com

## What you can do in the admin

- **Pages** — build each page from blocks (text, image, gallery, columns,
  icon box, heading, button, form) stacked in any order, then publish/hide.
- **Forms** — build a contact (or any) form, then drop it on a page with the
  Form block. Submissions are saved under Form Submissions; set SMTP env vars
  to also receive them by email.
- **Navigation** — the drag-and-drop menu builder. Add items, nest sub-pages
  under a dropdown (e.g. Portfolio), or add external links.
- **Site settings** — site title, tagline, social links (icon-only, open in
  a new tab), the site theme (two light + one dark), and optional sidebar /
  page background colours.

---

## Setup

You need free accounts at **Neon** (database) and **Cloudinary** (photos),
plus Node.js 18.20.2+.

### Path A — recommended (most reliable across Payload versions)

The files inside `src/app/(payload)/` are standard Payload scaffold and can
drift between versions. The safest route:

1. `npx create-payload-app@latest stephan-portfolio`
   - Template: **blank**
   - Database: **PostgreSQL**
2. From this repo, copy into the new project (overwriting where needed):
   - `src/collections/`, `src/globals/`, `src/lib/`, `src/components/`
   - `src/app/(frontend)/`
   - `src/payload.config.ts`
   - `next.config.mjs`
3. `npm install payload-cloudinary yet-another-react-lightbox`
4. Copy the env vars below into `.env`.
5. `npm run generate:importmap` then `npm run dev`.

### Path B — run this repo directly

```bash
cp .env.example .env      # then fill in real values
npm install
npm run generate:importmap
npm run dev
```

Open http://localhost:3000/admin and create your first admin user.

### Environment variables

See `.env.example`. For `DATABASE_URI`, use Neon's **pooled** connection
string (the host contains `-pooler`) — important for serverless on Vercel.

---

## First-run checklist (in /admin)

1. **Create your login** (first visit to `/admin`).
2. **Site settings** → set title, tagline, and add social links.
3. **Pages** → create a few gallery pages (e.g. "Publish story",
   "Tear sheet"), upload photos to each. Create text pages for "About me"
   and "Contact".
4. **Navigation** → build the menu:
   - Add a **Dropdown** item labelled "Portfolio" and add your gallery pages
     as its sub-pages.
   - Add "About me" and "Contact" as page items.
   - Add social links as external items if you want them inline.
5. Visit `/` — the menu and pages render from what you just set up.

---

## How it fits together

| Piece | Role |
|-------|------|
| Next.js + Payload | One app: public site + `/admin`, deploy together |
| Neon (Postgres) | Stores pages, the menu, and settings |
| Cloudinary | Stores and optimises the photo files |

The left menu and every page are generated from the database, so adding a
page or rearranging the menu needs no code changes.

---

## Deploying (Vercel)

1. Push to GitHub, import into Vercel.
2. Add the same env vars in Vercel project settings.
3. Point stephanrozario.com at the Vercel project.

**Large photo uploads:** Vercel limits server uploads to ~4.5 MB. If you
upload bigger originals through the admin, enable client-side uploads — the
`payload-cloudinary` plugin and alternatives like
`@jhb.software/payload-cloudinary-plugin` support a `clientUploads: true`
option that sends files straight to Cloudinary from the browser.

## Notes

- Run `npm run generate:types` anytime you change collections/globals to keep
  `src/payload-types.ts` in sync (the `as any` casts in the frontend can then
  be replaced with the generated types).
- `npm run generate:importmap` must be run after adding/renaming custom admin
  components (like `NavRowLabel`).
