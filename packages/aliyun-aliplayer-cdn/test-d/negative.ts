// ============================================================================
// Negative type tests — every @ts-expect-error MUST suppress a real error.
// An unused directive is itself an error (TS2578), so these assertions cannot
// silently rot. Each directive is placed on the line directly above the fault.
// ============================================================================

import Aliplayer from '../index';

const p = new Aliplayer({ id: 'player', source: 'https://example.com/a.mp4' });

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

// @ts-expect-error a bare number is not a valid options object
new Aliplayer(123);

// @ts-expect-error `width` must be a CSS length/number, not a boolean
new Aliplayer({ id: 'player', width: true });

// @ts-expect-error `controlBarVisibility` is a closed union
new Aliplayer({ id: 'player', controlBarVisibility: 'sometimes' });

// @ts-expect-error `mediaType` is a closed union
new Aliplayer({ id: 'player', mediaType: 'subtitle' });

// @ts-expect-error `qualitySort` only accepts 'asc' | 'desc'
new Aliplayer({ id: 'player', qualitySort: 'random' });

// ---------------------------------------------------------------------------
// Static surface: the bundle really only exposes these
// ---------------------------------------------------------------------------

// @ts-expect-error `getVersion` takes no arguments
Aliplayer.getVersion('extra');

// @ts-expect-error `EventType` members are readonly
Aliplayer.EventType.Ready = 'changed';

// @ts-expect-error `util` exposes only stopPropagation, not the internal dom lib
Aliplayer.util.el('player');

// @ts-expect-error lib/constants is not re-exported onto the constructor
Aliplayer.ErrorCode;

// @ts-expect-error `players` values are players, not strings
const badRegistry: string = Aliplayer.players['x'];
void badRegistry;

// ---------------------------------------------------------------------------
// Event payloads
// ---------------------------------------------------------------------------

p.on('error', (e) => {
  // @ts-expect-error `error` payloads are structured, not a bare string
  const wrong: string = e.paramData;
  void wrong;
});

p.on('timeupdate', (e) => {
  // @ts-expect-error `timeupdate` carries a number, not an object
  const wrong: { currentTime: number } = e.paramData;
  void wrong;
});

p.on('snapshoted', (e) => {
  // @ts-expect-error `snapshoted.base64` is a string
  const wrong: number = e.paramData.base64;
  void wrong;
});

p.on('resolutionChange', (e) => {
  // @ts-expect-error `resolutionChange` has no `level` field
  const wrong = e.paramData.level;
  void wrong;
});

// @ts-expect-error `on`'s handler argument is required
p.on('play');

p.on('autoplay', (e) => {
  // @ts-expect-error the `autoplay` payload is boolean, not a string
  const wrong: string = e.paramData;
  void wrong;
});

// The patched player `on` returns void, so it must not be chained.
// @ts-expect-error chaining off `on` is not supported by the runtime
p.on('play', () => {}).pause();

p.on('ready', (e) => {
  // @ts-expect-error `ready` is signal-only: paramData is undefined
  const wrong: number = e.paramData;
  void wrong;
});

// ---------------------------------------------------------------------------
// Method signatures
// ---------------------------------------------------------------------------

// @ts-expect-error `setSpeed` requires a numeric rate
p.setSpeed('1.5');

// NOTE: `getRotate(45)` is deliberately *not* asserted invalid — the bundle
// declares `getRotate(e)` and ignores the argument, so the types accept it.

// @ts-expect-error `getDuration` takes no arguments
p.getDuration(true);

// @ts-expect-error `setVolume` is a number in [0,1], not a percentage string
p.setVolume('50%');

// @ts-expect-error `seek` takes a number, not a string
p.seek('30');

// @ts-expect-error `loadByUrl` requires a URL
p.loadByUrl();

// @ts-expect-error `getTextTracks` returns a readonly array
p.getTextTracks().push({} as TextTrack);

// @ts-expect-error `getStatus` returns the status union, not any string
const needsLiteral: 'playing' = p.getStatus();
void needsLiteral;

// getStats resolves `PlayerStats | undefined`; the base player resolves undefined.
p.getStats().then((s) => {
  // @ts-expect-error the resolved value may be undefined
  void s.bytesReceived;
});

// The correct narrowing form must compile (control for the line above).
p.getStats().then((s) => void s?.bytesReceived);

// NOTE: `trigger` deliberately keeps an `(name: string, paramData?: unknown)`
// escape hatch, because dispatching custom event names is supported. Payload
// *receiving* handlers stay strictly typed (see the `on` cases above).
p.trigger('error', { error_code: 4400, error_msg: 'manual' });
p.trigger('myOwnEvent', { anything: true });

// ---------------------------------------------------------------------------
// Misspelled runtime names: the misspelling stays the implementation name even
// though 2.38.0 added a corrected alias for the snapshot setter and the
// live-shift property. These directives guard the *still-wrong* names.
// ---------------------------------------------------------------------------

// @ts-expect-error the runtime method is `getRecentOccuredEvent` (no corrected alias exists)
p.getRecentOccurredEvent();

// @ts-expect-error the runtime property is `isMutiLevel` (sic)
p.isMultiLevel;

// @ts-expect-error `Aliplayer.ErrorCode` is a type, never a runtime value
const codeValue = Aliplayer.ErrorCode.NotFoundSourceURL;
void codeValue;

// ---------------------------------------------------------------------------
// APIs removed in 2.38.0 — typed as `never` so old call sites fail at compile
// time (their runtime absence would otherwise be a TypeError mid-playback).
// ---------------------------------------------------------------------------

// @ts-expect-error `firstNewUrlloadByUrl` no longer exists in 2.38.0
p.firstNewUrlloadByUrl('https://example.com/x.mp4');

// @ts-expect-error `setControls` no longer exists in 2.38.0
p.setControls();

// @ts-expect-error `offListener` no longer exists on player or component
p.offListener(document.body, 'click');

// ---------------------------------------------------------------------------
// Signature widening in 2.38.0: `mute`/`unMute` gained an optional `silent`
// flag, but it is still boolean-typed.
// ---------------------------------------------------------------------------

// @ts-expect-error `mute(silent)` takes a boolean, not an arbitrary string
p.mute('loud');

// ---------------------------------------------------------------------------
// New-in-2.38.0 option unions are just as closed as the old ones.
// ---------------------------------------------------------------------------

// @ts-expect-error `menuMode` is a closed union
new Aliplayer({ id: 'player', menuMode: 'drawer' });

// @ts-expect-error `subtitleRenderMode` accepts only 0..3
new Aliplayer({ id: 'player', subtitleRenderMode: 7 });

// @ts-expect-error `autoplayPolicy.fallbackToMute` is boolean
new Aliplayer({ id: 'player', autoplayPolicy: { fallbackToMute: 'yes' } });

// @ts-expect-error `resultType` is the 'Multiple' sentinel or a free string, not a boolean
new Aliplayer({ id: 'player', resultType: true });

// @ts-expect-error `LogoItem.position` is one of four corners (free strings allowed via `string`)
new Aliplayer({ id: 'player', logo: [{ src: 'x.png', position: 12 }] });

// @ts-expect-error `watermark.speed` is a number (clamped 0–100), not a word
new Aliplayer({ id: 'player', watermark: { speed: 'fast' } });

// @ts-expect-error `watermark.opacity` is a number, not a string percentage
new Aliplayer({ id: 'player', watermark: { opacity: '50%' } });

// @ts-expect-error `memoryPlay.getTimeFunction` returns a value, not a void-only callback
new Aliplayer({ id: 'player', memoryPlay: { getTimeFunction: (k: string) => { void k; } } });

// ---------------------------------------------------------------------------
// 2.38.0 new event payloads: each is a distinct shape.
// ---------------------------------------------------------------------------

p.on('qualitySwitchResult', (e) => {
  // @ts-expect-error `success` is a boolean, not a string
  const wrong: string = e.paramData.success;
  void wrong;
});

p.on('vttSwitchResult', (e) => {
  // @ts-expect-error the payload has no `subtitle` field
  const wrong = e.paramData.subtitle;
  void wrong;
});

p.on('abrQualitySwitch', (e) => {
  // The 2.38.0 level mapper renames `Url` → `url`, so the PascalCase key falls
  // through to the `unknown` index — never a plain string.
  // @ts-expect-error `unknown` is not assignable to `string`
  const wrong: string = e.paramData.Url;
  void wrong;
});

// ---------------------------------------------------------------------------
// Instance properties
// ---------------------------------------------------------------------------

// @ts-expect-error `tag` is a video element, not a div
const wrongTag: HTMLDivElement = p.tag;
void wrongTag;

// @ts-expect-error `resolution.width` is numeric
p.resolution.width = 'wide';

// @ts-expect-error `_currentPlayIndex` is a number
p._currentPlayIndex = 'first';

// @ts-expect-error unknown members are not part of the typed surface
p.thisMethodDoesNotExist();

export {};
