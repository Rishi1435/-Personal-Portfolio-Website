# Project media (video loops)

`ProjectMedia` (`src/components/ProjectMedia.jsx`) plays a short **silent WebM
loop** for a project when one exists here, and otherwise falls back to the
animated SVG mockup (`ProjectQlue` / `ProjectXpensia`).

The video path is **not active yet** — it needs real footage, which has to be a
genuine screen recording of the app in use (not the schematic SVG mockup, and
not something generatable in CI). Once you have recordings, activate it:

## 1. Record

~10–15s silent screen capture of each app in actual use.

## 2. Encode to WebM (VP9), muted, under ~400 KB

```bash
ffmpeg -i qlue-raw.mov -c:v libvpx-vp9 -b:v 0 -crf 38 -an \
  -pix_fmt yuv420p -vf "scale=980:-2" qlue.webm
```

Also export a poster frame (shown before the video loads, since `preload="none"`):

```bash
ffmpeg -i qlue-raw.mov -frames:v 1 -vf "scale=640:-2" qlue-poster.png
```

Drop the files here as:

```
public/media/qlue.webm      public/media/qlue-poster.png
public/media/xpensia.webm   public/media/xpensia-poster.png
```

## 3. Point the project data at them

In `src/components/Projects.jsx`, set `video` / `poster` on the project:

```js
{ id: 'qlue', /* … */ video: '/media/qlue.webm', poster: '/media/qlue-poster.png' }
```

`ProjectMedia` then handles the rest: play on hover (desktop), tap-to-toggle +
autoplay-when-visible via `IntersectionObserver` (touch), pause off-screen, and
fall back to the SVG mockup on load error or when `navigator.connection.saveData`
is set. Nothing autoplays with sound (the track is muted and encoded `-an`), and
`preload="none"` keeps video out of the initial paint / LCP path.
