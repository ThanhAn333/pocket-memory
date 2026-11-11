# Pocket Memories

Pocket Memories is a mobile-first graduation invitation told in five chapters. The React and TypeScript site builds to static files with Vite.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Add `?to=Minh%20Anh` to preview a personalized greeting. Use `npm run build` and `npm run preview` to check the production output.

## Configure the invitation

Edit [src/config/invitation.ts](src/config/invitation.ts).

- Fill in the graduate name, university, degree, year, venue, and full address.
- Set `dateTimeISO` and `endDateTimeISO` to ISO 8601 datetimes with explicit offsets, such as `2030-06-21T09:00:00+07:00`. Set `timeZone` to the IANA time zone for display. Use an end time after the start time to enable the calendar download.
- Set `mapUrl` to a Google Maps link and `rsvpUrl` to the public RSVP form. Blank URLs leave those actions disabled.
- Place optimized WebP or AVIF photos in `public/` and use paths such as `/photos/portrait.webp`. Set `portraitUrl`, `portraitAlt`, and three to six entries in `photos`. Give each photo a meaningful description and caption. The portrait frame crops to 4:5 and album frames to 4:3. An optional CSS `position` on each album photo preserves a specific crop.
- The background track is [Hứa by JGKiD, with a beat by Lion Riddims](https://soundcloud.com/jgkid/hua), shared by the artist under [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/3.0/). The recording is used in full. Set `musicUrl` to change or remove it. If the browser blocks playback on load, the page retries on the first click or tap.
- Edit `invitationMessage` to customize the closing paragraphs.
- Set `siteUrl` to the production HTTPS URL so the build emits absolute social image metadata and guests share the canonical link. Keep the included preview or change `shareImageUrl`. Shared URLs omit the guest name.

The starter configuration uses placeholders until the event details and personal media are supplied.

## Project structure

- `src/components/` contains the five chapters, including the layered envelope and its opening state.
- `src/hooks/useMotion.ts` contains the responsive GSAP effects.
- `src/lib/` contains date, calendar, and sharing utilities.
- `src/index.css` contains shared tokens and `src/App.css` contains chapter layouts.
- `public/` contains the botanical artwork, favicon, and social preview.
- `design-system/pocket-memories/MASTER.md` documents the visual system.

## Deploy on Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project**, then import the repository using the **Vite** framework preset.
3. Use Node.js 24, the build command `npm run build`, and the output directory `dist`. The project root is the directory containing `package.json`.
4. Set `siteUrl` to the final URL in the invitation configuration and deploy that commit. Open the deployed site and verify the ceremony links and shared preview.

See the [Vercel Vite guide](https://vercel.com/docs/frameworks/frontend/vite).
