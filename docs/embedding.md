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

## Posting claims with photos

Compress images in the browser before the claim POST — canvas resize to max
1200px at 0.8 JPEG quality for files over 2MB (see trust_claim's
`MediaUploader`). Inline multi-megabyte base64 images bloat the claim store
and slow every render of that claim.
