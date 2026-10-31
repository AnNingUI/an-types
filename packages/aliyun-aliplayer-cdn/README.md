# @an-types/aliyun-aliplayer-cdn

Highly detailed TypeScript definitions for the **Aliyun Apsara Media Box Web
Player** (Aliplayer), written against the real runtime of

```
https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/aliplayer-min.js
```

> The package version tracks the player version: `@an-types/aliyun-aliplayer-cdn@2.19.0`
> describes Aliplayer **2.19.0**. Pick the package version matching the CDN
> bundle you actually load.

These are **types only**. The package ships no JavaScript: you still load the
player from the CDN yourself.

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
  href="https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/skins/default/aliplayer-min.css"
/>
<script src="https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/aliplayer-min.js"></script>
```

> The stylesheet lives under `skins/default/` — there is **no** CSS file at the
> version root, and the file is `aliplayer-min.css`, not `aliplayer-css.min.css`.

The bundle is a single core script, but it lazy-loads siblings from the same
version directory when a feature needs them. Pinning the wrong version for those
is a runtime 404, not a type error — so the table below is the complete set,
verified live against the CDN:

| Loaded when | URL (relative to the version directory) |
| --- | --- |
| `vid` + `playauth` (VOD) | `hls/aliplayer-vod-p-min.js` |
| `encryptType: 1` (Aliyun VOD encryption) | `hls/aliplayer-vod-min.js` |
| HLS plugin | `hls/aliplayer-hls-min.js` |
| HLS plugin with `useHls2: true` | `hls/aliplayer-hls2-min.js` |
| FLV plugin | `flv/aliplayer-flv-min.js` |
| DRM (Widevine/PlayReady, Shaka) | `drm/aliplayer-drm-min.js` |

For example `…/apsara-media-box/imp-web-player/2.19.0/flv/aliplayer-flv-min.js`.

These paths are **not** option-configurable. `io.loadJS` composes them from the
`domain`/`path`/`h5Version` constants baked into the bundle, so they always point
at the directory matching the core bundle you loaded — which is exactly why the
whole set must be served from one version directory. (`skinsDomain`/`sdkDomain`
only redirect skin *images*, such as the progress drag cursor.)


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
  liveStartTime: '2024-01-01T00:00:00Z',
  liveOverTime: '2024-01-01T02:00:00Z',
  liveTimeShiftUrl: 'https://example.com/timeshift',
});

// ⚠️ `liveShiftSerivce` is misspelled in the bundle. The types keep the typo
//    on purpose so `player.liveShiftService` is a compile error you cannot ship.
live.liveShiftSerivce?.isLiveShiftPlaying();

const vod = new Aliplayer({ id: 'player', vid: 'myVid', playauth: '…' });
```

### Typed events

`on`/`one`/`off`/`trigger` are keyed by event name, so `paramData` is inferred:

```ts
player.on('error', (e) => {
  const code: number = e.paramData.error_code;   // structured
  if (code === 4002) player.options().refreshAccessInfo?.();
});

player.on('timeupdate', (e) => {
  const seconds: number = e.paramData;           // number, not an object
});

player.on(Aliplayer.EventType.Snapshoted, (e) => {
  download(e.paramData.base64);                  // data-URL of the frame
});
```

Use `Aliplayer.EventType.*` for the literal event names. The type
`Aliplayer.EventTypes` additionally describes the internal `Video` and `Private`
groups if you need to listen to those.

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

player.getComponent('hello');        // AliplayerComponent | null
```

---

## What makes these definitions different

They were produced by decompiling the published bundle into its 163 Browserify
modules (recovering the original internal `require` graph), then executing the
real bundle headlessly to enumerate the live prototype chain, own instance
state, static members and default option values, and by inspecting every
`trigger()` call site to type each event payload. Consequences worth knowing:

### The exposed static surface is small

`Aliplayer` really only carries `getVersion`, `util`, `Component`, `EventType`,
`players` and `reloadInstance`. The internal `lib/constants` module — error
codes, quality maps, storage keys — is **not** re-exported, so those exist here
as types only. `Aliplayer.ErrorCode` is an interface, not a value: referencing
`Aliplayer.ErrorCode.NotFoundSourceURL` at runtime is `undefined`. Switching on
an error code still gets literal precision through the
`Aliplayer.ErrorCodeValue` union:

```ts
player.on('error', (e) => {
  const code: Aliplayer.ErrorCodeValue = e.paramData.error_code as Aliplayer.ErrorCodeValue;
  switch (code) {
    case 4002: /* AuthKeyExpired */ break;
    case 4004: /* NotFoundSourceURL */ break;
  }
});
```

### Runtime typos are preserved, and enforced

The types deliberately keep the bundle's spelling so a "correction" becomes a
compile error instead of a runtime `TypeError`:

| Correct (as shipped) | Rejected |
| --- | --- |
| `setSanpshotProperties(...)` | `setSnapshotProperties(...)` |
| `getRecentOccuredEvent()` | `getRecentOccurredEvent()` |
| `player.liveShiftSerivce` | `player.liveShiftService` |
| `player.isMutiLevel` | `player.isMultiLevel` |
| `ErrorCode.EncrptyVideoNotSupport: 4010` | `EncryptVideoNotSupport` |
| `ErrorCode.NetworkUnavaiable: 4014` | `NetworkUnavailable` |
| `RtsAutoPLayFaild`, `RtsSubscribeNonthing`, `URLsIsEmpty` | conventional spellings |

`test-d/negative.ts` asserts the first four, so a future edit that "fixes" one of
these names fails CI instead of quietly breaking users at runtime.

### Some signatures surprise people

* **`on()` returns `void`.** The player's `on` is wrapped by
  `reloadInstanceUtil.storeUserEvents` to record listeners for replay, and that
  wrapper discards the return value. `one`/`off`/`trigger` *are* chainable.
  So `player.on(…).play()` does not compile — correctly.
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
* **`Aliplayer.players` is `{}`** and the 2.19 core never writes to it. Typed as
  a registry for consumers, but do not rely on the player self-registering.
* **`options(patch)` merges**, it does not replace (it shares the object with
  `getOptions()`).
* **`loadByUrl(url, time, autoplay, autoRetry)`** — the 4th parameter is real and
  used internally to skip the abort/VV reporting.
* **`source` accepts a JSON string** of `{"HD":"…","SD":"…"}` for multi-quality;
  the player builds `_urls` from it and `switchUrl()` cycles that list.

### Instance state you can actually read

Beyond the documented API, the real own-properties are typed: `tag`, `_el`,
`_options`, `_urls`, `_currentPlayIndex`, `isMutiLevel`, `resolution`,
`_eventState`, `loaded`, `played`, `oncePlayed`, `waiting`, `__disposed`,
`UI`, `_lifeCycleManager`, plus the services `fullscreenService`,
`liveShiftSerivce`, `_ccService`, `_audioTrackService`, `_qualityService`,
`_progressMarkerService`, `_thumbnailService` and `_monitor`. Internal members
are `_`-prefixed and may change between minor versions.

### Options are exhaustively enumerated

Every key with a default in `lib/playerutil.js` is present, with the default
documented in its JSDoc — plus the extra keys the player reads even though they
have no default (`skinsDomain`, `speedLevels`, `ai`, `extraInfo`,
`seamlessHandover`, `widevineCertId`, `shakaUrl`, `flvFrameChasing`, X5 keys,
`drmOption`, `hlsOption`/`flvOption`, …). `hlsOption`/`flvOption` are typed as
open passthrough objects, so hls.js/flv.js native keys pass while typos in the
known ones still get caught.

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
Aliplayer.EventType          // PascalCase key -> literal event name
Aliplayer.util.stopPropagation(event)
Aliplayer.players            // {} — see the note above
Aliplayer.reloadInstance(instanceLike, cb, oldInstance)

// Playback
play(isManual?) / replay() / pause(isManual?) / stop()   // chainable
seek(time) / setSpeed(rate, triggerEvent?) / setVolume(v)
mute() / unMute() / paused() / muted() / getVolume()
getCurrentTime() / getDuration() / getDisplayDuration() / getBuffered()

// Source
loadByUrl(url, time?, autoplay?, autoRetry?)
firstNewUrlloadByUrl(url, autoplay?) / switchUrl()

// State & info
getStatus() / getOptions() / options(patch?) / getSourceUrl()
getCurrentQuality() / getMonitorInfo() / getRecentOccuredEvent()
getCurrentPDT() / getReadyTime() / getMetaData() / getStats() / readyState()
getError()

// Picture
setRotate(deg) / getRotate() / setImage(m) / getImage() / cancelImage()
setCover(url) / setPlayerSize(w, h)

// Captions & markers
setTextTracks(tracks) / getTextTracks()
setProgressMarkers(ms?) / getProgressMarkers()
setSanpshotProperties(w, h, rate?)
setPreviewTime(s) / getPreviewTime() / isPreview() / exceedPreviewTime(t)

// Events (on returns void!)
on(name, handler) / one(name, handler) / off(name, handler?) / trigger(name, payload?)
```

## Licence

MIT
