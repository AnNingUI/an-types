# @an-types/aliyun-aliplayer-cdn

Highly detailed TypeScript definitions for the **Aliyun Apsara Media Box Web
Player** (Aliplayer), written against the real runtime of

```
https://g.alicdn.com/apsara-media-box/imp-web-player/2.38.0/aliplayer-min.js
```

> The package version tracks the player version: this release,
> `@an-types/aliyun-aliplayer-cdn@2.38.0`, describes Aliplayer **2.38.0**
> (bundle banner `v2.38.0 - 2026-07-01`). Pick the package version matching the
> CDN bundle you actually load — `2.19.0` remains published for that older line.

These are **types only**. The package ships no JavaScript: you still load the
player from the CDN yourself.

> **License notice (new since 2024-12-01):** Aliyun requires a license for every
> deployment of this player. The basic license is free and valid for one year;
> H.265/H.266 playback additionally needs feature licenses. Without
> `license: { key, domain }` the bundle prints a console warning and playback
> fails with `LicenseEmpty` (4036). Apply via the
> [license authorization docs](https://help.aliyun.com/zh/vod/developer-reference/license-authorization-and-management)
> (see the `license` option below and the `LicenseResultCode` / 4035–4041 error
> codes in the types).

---

## Install

```bash
pnpm add -D @an-types/aliyun-aliplayer-cdn
# or: npm i -D @an-types/aliyun-aliplayer-cdn
```

Load the player (and its stylesheet) from the CDN:

```html
<link
  rel="stylesheet"
  href="https://g.alicdn.com/apsara-media-box/imp-web-player/2.38.0/skins/default/aliplayer-min.css"
/>
<script src="https://g.alicdn.com/apsara-media-box/imp-web-player/2.38.0/aliplayer-min.js"></script>
```

> The stylesheet lives under `skins/default/` — there is **no** CSS file at the
> version root, and the file is `aliplayer-min.css`, not `aliplayer-css.min.css`.

The bundle is a single core script, but it lazy-loads siblings from the same
version directory when a feature needs them. Pinning the wrong version for those
is a runtime 404, not a type error — so the table below is the complete set for
2.38.0, every row verified live against the CDN:

| Loaded when | URL (relative to the version directory) |
| --- | --- |
| `vid` + `playauth` (VOD) | `hls/aliplayer-vod-p-min.js` |
| `encryptType: 1` (Aliyun VOD encryption) | `hls/aliplayer-vod-min.js` |
| HLS plugin | `hls/aliplayer-hls-min.js` |
| HLS plugin with `useHls2: true` (**the 2.38.0 default**) | `hls/aliplayer-hls2-min.js` |
| HLS + `enableHlsH265: true` | `hls/aliplayer-hls2-hevc-min.js` |
| Service-Worker private-VOD pipeline (`useSW`) | `hls/aliplayer-hls2-demuxer-min.js`, `hls/aliplayer-remuxer-min.js` |
| FLV plugin (`useFlvPlugOnMobile` is `true` by default since 2.38.0) | `flv/aliplayer-flv-min.js` |
| DRM (Widevine/PlayReady, Shaka) | `drm/aliplayer-drm-min.js` |
| `.mpd` sources — **new DASH support in 2.38.0** | `dash/aliplayer-dash-min.js` |
| H.265/H.266 software renderer (splayer) | `splayer/videox-muxer.min.js` |

For example `…/apsara-media-box/imp-web-player/2.38.0/flv/aliplayer-flv-min.js`.

`io.loadJS` composes these from the `domain`/`path`/`h5Version` constants baked
into the bundle, so by default they always point at the version directory of the
core bundle you loaded — the whole set must be served from one version.
**New in 2.38.0:** the `assetPrefix` option overrides that root (for self-hosting
the full bundle set); `skinsDomain`/`sdkDomain` still only redirect skin
*images*, such as the progress drag cursor.

## Usage

### As a global (the usual CDN setup)

Because the declarations use `export as namespace Aliplayer`, `Aliplayer` is
typed globally in any script that the CDN bundle will reach at runtime:

```ts
const player = new Aliplayer({
  id: 'player',
  source: 'https://example.com/video.mp4',
  width: '100%',
  height: '100%',
  autoplay: false,
  license: { key: 'your-license-key', domain: 'your-authorized-domain' },
});

player.on('play', () => console.log('started'));
player.play();
```

Inside an ES module a global reference needs the import, so import for types:

```ts
import Aliplayer from '@an-types/aliyun-aliplayer-cdn';

const player = new Aliplayer({ id: 'player', source: '…' });
```

Both `new Aliplayer(options)` and the bare factory call `Aliplayer(options)`
are modelled, because the UMD wrapper is a factory that `return`s the created
instance — with or without `new`.

### Live streams, time shift, VOD

```ts
const live = new Aliplayer({
  id: 'player',
  source: 'https://example.com/live.m3u8',
  isLive: true,
  liveStartTime: '2026-01-01T00:00:00Z',
  liveOverTime: '2026-01-01T02:00:00Z',
  liveTimeShiftUrl: 'https://example.com/timeshift',
});

// ⚠️ The primary runtime property is misspelled `liveShiftSerivce`. Since
//    2.38.0 the correctly-spelled `liveShiftService` is assigned as an alias of
//    the same object, so both compile — but ONLY the misspelled name exists on
//    2.19.0, so keep using `liveShiftSerivce` if you support both lines.
live.liveShiftSerivce?.isLiveShiftPlaying();
live.liveShiftSerivce?.getLiveShiftOffset(); // new in 2.38.0

const vod = new Aliplayer({ id: 'player', vid: 'myVid', playauth: '…' });
```

### Typed events

`on`/`one`/`off`/`trigger` are keyed by event name, so `paramData` is inferred:

```ts
player.on('error', (e) => {
  const code: number = e.paramData.error_code;   // structured
  if (code === 4002) player.options().refreshAccessInfo?.();
  if (code === 4036) console.error('missing license params'); // new in 2.38.0
});

player.on('timeupdate', (e) => {
  const seconds: number = e.paramData;           // number, not an object
});

player.on(Aliplayer.EventType.Snapshoted, (e) => {
  download(e.paramData.base64);                  // data-URL of the frame
});

// New in 2.38.0 — ABR and manual quality switches now report results:
player.on('qualitySwitchResult', (e) => {
  const ok: boolean = e.paramData.success;       // { success, from, to, error? }
});
player.on('abrQualitySwitch', (e) => {
  const level: Aliplayer.QualitySwitchEntry = e.paramData;
});
```

Use `Aliplayer.EventType.*` for the literal event names (48 in 2.38.0). The type
`Aliplayer.EventTypes` additionally describes the internal `Video` (23) and
`Private` (97) groups if you need to listen to those.

### Snapshot (new in 2.38.0)

```ts
const shot = player.takeSnapshot();     // synchronous, no UI button required
if (!shot.error && shot.binary instanceof Uint8Array) {
  upload(shot.binary);                  // ⚠️ Uint8Array since 2.38.0 (was string in 2.19.0)
}
player.setSnapshotProperties(1280, 720, 0.9); // correctly-spelled alias added in 2.38.0
```

### Watch windows, sub-clips, logos (new in 2.38.0)

```ts
// Restrict seeking to [60s, 120s] (foreground clamp, progress bar re-masks):
player.setWatchTime(60, 120);

// Or play a sub-clip with its own 0-based timeline:
new Aliplayer({ id: 'p', source: '…', start: 30, end: 90 });

// Logo overlays:
new Aliplayer({
  id: 'p',
  source: '…',
  logo: [{ src: '/brand.png', position: 'bottom-right', offsetX: 16, offsetY: 16, unit: 'percentage' }],
});
```

### Custom UI components

`Aliplayer.Component` is a **factory**, not a class — it is `oo.extend` verbatim:

```ts
interface Hello extends Aliplayer.AliplayerComponent { _text: string }

const Hello = Aliplayer.Component<{ _text: string; setText(t: string): void }>({
  init(this: Hello, player, options) {
    this._text = String(options.text ?? 'hello');
  },
  createEl(this: Hello) {
    const el = document.createElement('div');
    el.className = 'prism-hello';
    return el;
  },
  renderUI(this: Hello) {
    this.el().textContent = this._text;
  },
  setText(this: Hello, t: string) {
    this._text = t;
    this.renderUI();
  },
});

const player = new Aliplayer({
  id: 'player',
  source: '…',
  components: [{ name: 'hello', type: Hello, args: [] }],
});

player.getComponent('hello');         // custom component | null
player.getBuildInComponent('controlBar'); // built-in skin component (2.38.0)
```

---

## What makes these definitions different

They were produced by decompiling the published bundle into its 191 Browserify
modules (recovering the original internal `require` graph), then executing the
real bundle headlessly to enumerate the live prototype chain (147 methods), own
instance state, static members and default option values, and by inspecting every
`trigger()` call site to type each event payload. Consequences worth knowing:

### The exposed static surface is small

`Aliplayer` really only carries `getVersion`, `util`, `Component`, `EventType`,
`players`, `reloadInstance` — and since 2.38.0, `tracer` (the bundled
`@ali/mediabox-quality-tracer` RUM client; the factory itself is `tracer.wrap(…)`
and the tracer starts disabled until a license is configured). The internal
`lib/constants` module — error codes, quality maps, storage keys — is **not**
re-exported, so those exist here as types only. `Aliplayer.ErrorCode` is an
interface, not a value: referencing `Aliplayer.ErrorCode.NotFoundSourceURL` at
runtime is `undefined`. Switching on an error code still gets literal precision
through the `Aliplayer.ErrorCodeValue` union:

```ts
player.on('error', (e) => {
  const code = e.paramData.error_code as Aliplayer.ErrorCodeValue;
  switch (code) {
    case 4002: /* AuthKeyExpired */ break;
    case 4004: /* NotFoundSourceURL */ break;
    case 4035: /* LicenseError (2.38.0) */ break;
  }
});
```

### Runtime typos are preserved

The types keep the bundle's spelling so a "correction" against an older player
becomes a compile error instead of a runtime `TypeError`:

| Correct (as shipped) | Rejected | Note |
| --- | --- | --- |
| `getRecentOccuredEvent()` | `getRecentOccurredEvent()` | still misspelled in 2.38.0 |
| `setSanpshotProperties(...)` | — | implementation name; 2.38.0 **adds** the `setSnapshotProperties` alias |
| `player.liveShiftSerivce` | — | 2.38.0 **adds** the `liveShiftService` alias; on 2.19.0 only the typo exists |
| `player.isMutiLevel` | `player.isMultiLevel` | still misspelled in 2.38.0 |
| `ErrorCode.EncrptyVideoNotSupport: 4010` | `EncryptVideoNotSupport` | |
| `ErrorCode.NetworkUnavaiable: 4014` | `NetworkUnavailable` | |
| `RtsAutoPLayFaild`, `RtsSubscribeNonthing`, `LicenseFeatrueUnauthorized` | conventional spellings | |

`test-d/negative.ts` asserts the enforcement rows, so a future edit that "fixes"
one of these names fails CI instead of quietly breaking users at runtime.

### Some signatures surprise people

* **`on()` returns `void`.** The player's `on` is wrapped by
  `reloadInstanceUtil.storeUserEvents` to record listeners for replay, and that
  wrapper discards the return value. `one`/`off`/`offAll`/`trigger` *are*
  chainable. So `player.on(…).play()` does not compile — correctly.
* **`seek()` returns `this | undefined`.** It returns nothing when the argument
  is `NaN`.
* **`getStats()` returns `PromiseLike`, not `Promise`** — the bundle builds it
  from the (possibly polyfilled) global `Promise` and only `.then`/`.catch` are
  guaranteed. The base player resolves **`undefined`**; only the RTS/splayer
  paths populate the stats fields.
* **`getTextTracks()` is a list-like union**, never assumed to be an array: the
  internal VTT broker's `TextTrackList`, the native `video.textTracks`, or `[]`
  depending on the rendering path. Iterate by `length` + index.
* **`getRotate(e)` declares an argument and ignores it**; `getImage()` and
  `getPreviewTime()` can return `undefined`; `getError()` can be `undefined`.
* **`Aliplayer.players` is `{}`** and the core never writes to it. Typed as
  a registry for consumers, but do not rely on the player self-registering.
* **`options(patch)` merges**, it does not replace (it shares the object with
  `getOptions()`).
* **`loadByUrl(url, time, autoplay, autoRetry)`** — the 4th parameter is real and
  used internally to skip the abort/VV reporting.
* **`source` accepts a JSON string** of `{"HD":"…","SD":"…"}` for multi-quality;
  the player builds `_urls` from it and `switchUrl()` cycles that list.

### What changed in the runtime between 2.19.0 and 2.38.0

Types for both versions exist on npm; your code should only use what your loaded
bundle provides. Summary of the API deltas these declarations encode:

* **Removed** (typed `never` so old calls fail at compile time):
  `firstNewUrlloadByUrl()`, `setControls()`, `offListener()` (player and
  components), and the `ai` / `controls` options (no longer read by the runtime).
* **Signature widening:** `mute(silent?)` / `unMute(silent?)` suppress the toast;
  `traceLog(source, msg, toRum?)`.
* **Type change:** the `snapshoted` payload's `binary` (and
  `takeSnapshot().binary`) became `Uint8Array` (was a binary string).
* **Default flips** (behaviour, not types): `useFlvPlugOnMobile: true`,
  `useHls2: true`, `enableStashBufferForFlv: false`, `flvOption: {}`.
* **Additions:** 7 new Player events (ABR/subtitle pipeline/videoUnavailable), 11
  new Private events, `Video.Resize`, 10 new
  license/module error codes, `takeSnapshot`, `setSnapshotProperties`,
  `loadByUrlWithConfig`, `setLogo`, `setWatchTime`/`setStartEnd` (+`Next`
  variants), `getPlayTime`/`start|stopPlayTimeMonitor`,
  `show|hideControlBar`, `enable|disableClickPause`, `getChild`/`getBuildInComponent`/
  `offAll`, `_qualityService.changeQuality/getCurrentQuality`, 2 new
  `liveShiftSerivce` methods, `Aliplayer.tracer`, DASH playback, dynamic
  watermark / memory-play / press-fast-forward UI components, ~53 new options
  (all marked *New in 2.38.0* in their JSDoc).

### Instance state you can actually read

Beyond the documented API, the real own-properties are typed: `tag`, `_el`,
`_options`, `_urls`, `_currentPlayIndex`, `isMutiLevel`, `resolution`,
`_eventState`, `loaded`, `played`, `oncePlayed`, `waiting`, `__disposed`,
`UI`, `_lifeCycleManager`, plus the services `fullscreenService`,
`liveShiftSerivce` (+ `liveShiftService` alias), `_ccService`,
`_audioTrackService`, `_qualityService`, `_progressMarkerService`,
`_thumbnailService`, `_monitor` and (2.38.0) `_monitor2`. Internal members are
`_`-prefixed and may change between minor versions.

### Options are exhaustively enumerated

Every key with a default in `lib/playerutil.js` is present (152 of them in
2.38.0, checked automatically by `tools/check-coverage.mjs`), with the default
documented in its JSDoc — plus the extra keys the player reads even though they
have no default (`skinsDomain`, `speedLevels`, `extraInfo`, `seamlessHandover`,
`widevineCertId`, `shakaUrl`, X5 keys, `drmOption`, `hlsOption`/`flvOption`, …).
`hlsOption`/`flvOption`/`dashOption`/`rtsOption` are typed as open passthrough
objects, so engine-native keys pass while typos in the known ones still get
caught.

### Ambient augmentation

The bundle back-references the player on the media element
(`videoElement.player = this`), so `HTMLVideoElement.player` is augmented, and
`window.Aliplayer` is declared.

---

## API at a glance

```ts
// Construction
new Aliplayer({ id, source })
Aliplayer({ id, source }, readyCallback)
Aliplayer('containerId', { source })            // legacy

// Statics
Aliplayer.getVersion(): string
Aliplayer.Component(spec) => ComponentClass     // factory, not a class
Aliplayer.EventType          // PascalCase key -> literal event name (48)
Aliplayer.util.stopPropagation(event)
Aliplayer.players            // {} — see the note above
Aliplayer.reloadInstance(instanceLike, cb, oldInstance)
Aliplayer.tracer             // QualityTracer (2.38.0, RUM, disabled until licensed)

// Playback
play(isManual?) / replay() / pause(isManual?) / stop()   // chainable
seek(time) / setSpeed(rate, triggerEvent?) / setVolume(v)
mute(silent?) / unMute(silent?) / paused() / muted() / getVolume()
getCurrentTime() / getDuration() / getDisplayDuration() / getBuffered()
takeSnapshot()                          // 2.38.0
showControlBar() / hideControlBar()     // 2.38.0
enableClickPause() / disableClickPause() // 2.38.0

// Source
loadByUrl(url, time?, autoplay?, autoRetry?)
loadByUrlWithConfig(url, { seconds?, autoPlay?, enableABR?, startQuality?, defaultSubtitleLang? })  // 2.38.0
switchUrl()

// Watch windows (2.38.0)
setWatchTime(s?, e?) / setNextWatchTime(s?, e?)
setStartEnd(s?, e?) / setNextStartEnd(s?, e?)
getPlayTime() / startPlayTimeMonitor() / stopPlayTimeMonitor()

// State & info
getStatus() / getOptions() / options(patch?) / getSourceUrl()
getCurrentQuality() / getMonitorInfo() / getRecentOccuredEvent()
getCurrentPDT() / getReadyTime() / getMetaData() / getStats() / readyState()
getError() / canSeekable?(t)

// Picture
setRotate(deg) / getRotate() / setImage(m) / getImage() / cancelImage()
setCover(url) / setLogo(logoItems) / setPlayerSize(w, h)

// Captions & markers
setTextTracks(tracks) / getTextTracks()
setProgressMarkers(ms?) / getProgressMarkers()
setSanpshotProperties(w, h, rate?) / setSnapshotProperties(...)   // alias since 2.38.0
setPreviewTime(s) / getPreviewTime() / isPreview() / exceedPreviewTime(t)

// Components
getComponent(name) / getBuildInComponent(name) / getChild(name) / addChild / removeChild

// Events (on returns void!)
on(name, handler) / one(name, handler) / off(name, handler?) / offAll(name?) / trigger(name, payload?)
```

## Licence

MIT
