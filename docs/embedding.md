# Embedding LinkedTrust claims on any site

Show a claim — a verified statement by a real person, with their words, photo,
or video — on any web page. No React, no build step: one script tag, one
element. See a live one: [live.linkedtrust.us/badge/124713](https://live.linkedtrust.us/badge/124713).

## The badge

```html
<script src="https://demos.linkedtrust.us/embed/badge.js" defer></script>
<linked-badge claim-id="124713" layout="row"></linked-badge>
```

| Attribute | Values |
|---|---|
| `claim-id` | the claim's numeric id (required) |
| `layout` | `card` (vertical, default) or `row` (horizontal) |
| `theme` | `light` (default) or `dark` |
| `compact` | flag, smaller variant |
| `api-base` | default `https://live.linkedtrust.us` |

**Layout and width — this is what makes badges look right or wrong.**
The badge pages (`live.linkedtrust.us/badge/<id>`) are `layout="row"` in a
**~600px container**: a 180px-tall strip with media in a 35% box. Row is
designed for that width — squeeze it into a ~350px grid cell and the media
crushes to ~120px and the aspect looks broken. Rules of thumb: give `row`
500-600px (a 1-2 column grid), or use `card` (natural media aspect, capped
280px tall) for narrow cells and 3+ column grids. If a badge looks squashed,
first check the width of the box you put it in.

**Prefer the web component over the iframe.** The iframe embed
(`live.linkedtrust.us/embed/<id>`) exists for sites that cannot run scripts;
everywhere else use `<linked-badge>` — it sizes itself, themes correctly,
and resolves media URLs against its `api-base`.

Every badge page (`live.linkedtrust.us/badge/<id>`) has copy-paste share and
embed buttons. Prefer an iframe? Each claim has a bare page at
`live.linkedtrust.us/embed/<id>`.

## The video recorder

Record-and-upload with a live self-view, timer, retake, and upload progress.
The camera opens into a preview first; recording starts on a second click.

```html
<script src="https://demos.linkedtrust.us/embed/video-recorder.js" defer></script>
<linked-video-recorder api-base="https://live.linkedtrust.us" max-duration="60"></linked-video-recorder>
<script>
  document.querySelector('linked-video-recorder')
    .addEventListener('video-uploaded', e => console.log(e.detail.videoUrl))
</script>
```

Attributes: `api-base` (required) · `max-duration` seconds (default 60) ·
`video-url` (mount already-attached, e.g. after a failed form submit).
Events: `video-uploaded {videoUrl}` · `video-removed`.

## Feeds

`claims-feed.js` (`<linked-claims-feed>`) renders a feed of claims;
`atproto-claims.js` (`<linked-claims-atproto>`) renders claims published on
ATProto. Usage headers are at the top of each file.

## Where the code lives

Source: [`trust_claim/public/`](https://github.com/Whats-Cookin/trust_claim/tree/main/public).
Served with no-cache from `https://demos.linkedtrust.us/embed/`. A page that
uses them in production: [workers.vc](https://workers.vc) (the wall and the
join page).

## Media on claims — how it actually works (verified 2026-07-17)

**Videos are attached, images are inline. Know the difference.**

- **Video**: upload the file to `POST {api}/api/video/upload` (multipart field
  `video`). The backend stores it in object storage (Backblaze B2) and returns
  `{ videoUrl }` — put that URL in the claim's `videoUrl` field. The claim row
  stays small. This is what the `<linked-video-recorder>` component does for
  you, and what trust_claim and talent both do.
- **Images**: there is **no image upload endpoint**. The backend stores
  whatever base64 you send in `images[].base64` as a data URL **in the
  database row** (`trust_claim_backend/src/api/claims.ts`, `prisma.image.create`
  with `url: dataUrl`). Send a raw phone photo and you create a multi-megabyte
  DB row that slows every render of that claim, and your POST may time out.

**Therefore: always resize images in the browser before the claim POST.**
trust_claim's `MediaUploader` (`src/components/Form/imageUploading.tsx`) is
the reference: files over 2MB get canvas-resized to max 1200px. Quality is
yours to choose (trust_claim ships 0.8; workers.vc uses 1.0 — at 1200px both
land in the low hundreds of KB).

A server-side image path matching the video one (upload → B2 → URL on the
claim) does not exist yet; until it does, client-side resize is not optional.
