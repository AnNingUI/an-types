// ============================================================================
// Positive type tests — every line here MUST compile.
// Run with: pnpm --filter @an-types/aliyun-aliplayer-cdn test
// ============================================================================

import Aliplayer from '../index';

// ---------------------------------------------------------------------------
// 1. Construction forms
// ---------------------------------------------------------------------------

// 1a. Modern object form with `new` (what the docs show).
const p1 = new Aliplayer({ id: 'player', source: 'https://example.com/a.mp4' });

// 1b. Object form without `new` — the UMD factory returns the instance.
const p2 = Aliplayer({ id: 'player', source: 'https://example.com/a.mp4' });

// 1c. Legacy container-first form with an options object.
const p3 = Aliplayer('player', { source: 'https://example.com/a.mp4' });

// 1d. Element container + ready callback.
const container = document.getElementById('player')!;
const p4 = new Aliplayer(
  { id: container, source: 'https://example.com/a.mp4', isLive: false, autoplay: true },
  (player) => {
    // The ready callback receives the player.
    player.play();
  },
);

// Instances are the player type.
const typedPlayer: Aliplayer.Aliplayer = p1;
void p2;
void p3;
void p4;
void typedPlayer;

// ---------------------------------------------------------------------------
// 2. Static surface — exactly what the bundle exposes
// ---------------------------------------------------------------------------

const version: string = Aliplayer.getVersion();
const stopProp: (e: Event | Aliplayer.AliplayerEvent<any>) => void = Aliplayer.util.stopPropagation;
const readyName: 'ready' = Aliplayer.EventType.Ready;
const errName: 'error' = Aliplayer.EventType.Error;
const registry: Record<string, Aliplayer.Aliplayer> = Aliplayer.players;
const reload: typeof Aliplayer.reloadInstance = Aliplayer.reloadInstance;
void version;
void stopProp;
void readyName;
void errName;
void registry;
void reload;

// reloadInstance round-trip.
Aliplayer.reloadInstance(
  { ...p1.getOptions(), source: 'https://example.com/b.mp4' },
  (fresh) => fresh.play(),
  p1,
);

// ---------------------------------------------------------------------------
// 3. Options: representative subset with precise value types
// ---------------------------------------------------------------------------

const minimalOptions: Aliplayer.AliplayerOptions = { id: 'player', source: 'x' };

const fullOptions: Aliplayer.AliplayerOptions = {
  id: 'player',
  vid: 'd99b4b1e5c3f4a9ea3a2',
  playauth: 'base64playauth',
  source: 'https://example.com/index.m3u8',
  isLive: true,
  autoplay: false,
  preload: true,
  rePlay: false,
  useNativeControls: false,
  width: '100%',
  height: 600,
  videoWidth: '100%',
  videoHeight: '100%',
  ratio: 16 / 9,
  cover: 'https://example.com/cover.jpg',
  showBarTime: 5000,
  controlBarForOver: false,
  controlBarVisibility: 'hover',
  playsinline: true,
  keyShortCuts: true,
  keyFastForwardStep: 15,
  enableSystemMenu: false,
  diagnosisButtonVisible: false,
  debug: true,
  language: 'zh-cn',
  languageTexts: { PlayButton_Text: 'Play' },
  extLanguageTexts: { PlayButton_Text: 'Play' },
  format: 'm3u8',
  definition: 'AUTO',
  defaultDefinition: 'HD',
  qualitySort: 'desc',
  isVBR: true,
  isDrm: false,
  seamlessHandover: true,
  mediaType: 'video',
  outputType: 'cdn',
  encryptType: 0,
  hlsUriToken: 'token',
  region: 'cn-shanghai',
  authTimeout: 1800,
  trackLog: true,
  logBatched: true,
  heartHeatInterval: 30,
  from: 'my-app',
  traceId: 'trace-1',
  enableMockFullscreen: true,
  x5_video_position: 'top',
  x5_fullscreen: false,
  x5_orientation: 'landscape|portrait',
  x5LandscapeAsFullScreen: true,
  useHlsPluginForSafari: true,
  enableMSEForAndroid: false,
  useHlsPlugOnMobile: true,
  useFlvPlugOnMobile: false,
  useHls2: true,
  enableWorker: true,
  lowLatencyMode: false,
  withCredentials: true,
  skipRtsSupportCheck: false,
  rtsFallbackSource: 'https://example.com/fallback.m3u8',
  rtsVersion: '2.4.3',
  rtsSdkUrl: 'https://example.com/rts.js',
  enableH265: true,
  forceH265: false,
  enableH266: true,
  forceH266: false,
  h265Threads: true,
  h265Simd: true,
  splayerUrl: 'https://example.com/splayer.js',
  splayerWasmDomain: 'https://wasm.example.com',
  liveTimeShiftUrl: 'https://example.com/timeshift',
  liveShiftSource: 'https://example.com/shift.m3u8',
  liveShiftTime: 1701403200,
  liveShiftMinOffset: 60,
  liveStartTime: '2023-12-01T08:00:00Z',
  liveOverTime: '2023-12-01T10:00:00Z',
  flvFrameChasing: true,
  hlsFrameChasing: true,
  chasingFirstParagraph: 3,
  chasingSecondParagraph: 6,
  chasingFirstSpeed: 1.1,
  chasingSecondSpeed: 1.5,
  autoPlayDelay: 1000,
  autoPlayDelayDisplayText: 'click to play',
  preventRecord: true,
  ai: { label: true },
  license: { key: 'lic', domain: 'example.com' },
  widevineCertId: 'cert',
  certId: 'cert2',
  shakaUrl: 'https://example.com/shaka.js',
  sdkDomain: 'https://sdk.example.com',
  drmOption: { sessionTimeout: 5000 },
  includeSnapshotList: true,
  extraInfo: { liveRetry: 3, anything: 1 },
  thumbnailUrl: 'https://example.com/thumb.vtt',
  mediaAuth: null,
  authInfo: { a: 1 },
  reAuthInfo: { b: 2 },
  refreshAccessInfo: async () => {},
  recreatePlayer: (player) => {
    const v: Aliplayer.Aliplayer | undefined = player;
    void v;
  },
  readyCallback: (player) => player.pause(),
  liveRetry: 5,
  liveRetryInterval: 1,
  liveRetryStep: 0,
  vodRetry: 3,
  loadDataTimeout: 20,
  waitingTimeout: 60,
  waitingBufferedTime: 3,
  delayLoadingShow: 1,
  nudgeMaxRetry: 5,
  drmSessionTimeout: 5000,
  hlsLoadingTimeOut: 20000,
  rtsLoadDataTimeout: 6000,
  enableStashBufferForFlv: true,
  stashInitialSizeForFlv: 128000,
  flvOption: { accurateSeek: false, stashInitialSize: 64000, customFlvKey: 1 },
  hlsOption: {
    stopLoadAsPaused: true,
    liveSyncDurationCount: 3,
    maxMaxBufferLength: 600,
    maxBufferSize: 60 * 1000 * 1000,
    maxBufferLength: 30,
    fragLoadingRetryDelay: 500,
    defaultBandwidth: 2_000_000,
    hlsBandWidthUpCacheTime: 1000,
    anythingElse: 'ok',
  },
  snapshotWatermark: {
    left: 500,
    top: '100',
    text: 'watermark',
    font: '16px sans-serif',
    fillColor: '#FFFFFF',
    strokeColor: '#000000',
  },
  playConfig: { PreviewTime: 60 },
  speedLevels: [
    { key: 0.5, text: '0.5x' },
    { key: 2, text: '2.0x' },
  ],
  progressMarkers: [
    { offset: 10, text: 'intro' },
    { offset: 20, title: 'ad', text: 'ad break' },
  ],
  tracks: [{ kind: 'subtitles', srclang: 'en', label: 'English', src: 'en.vtt', codec: 'avc1', type: 1 }],
  textTracks: [{ srclang: 'zh', label: '中文', src: 'zh.vtt' }],
  controls: true,
  skinLayout: false,
  components: false,
};
void minimalOptions;
void fullOptions;

// skinLayout tree with nested children and mixed offset units.
const layout: Aliplayer.SkinLayoutItem[] = [
  { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
  { name: 'H5Loading', align: 'cc' },
  { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
  { name: 'infoDisplay' },
  { name: 'tooltip', align: 'blabs', x: 0, y: '56px' },
  { name: 'thumbnail' },
  {
    name: 'controlBar',
    align: 'blabs',
    x: 0,
    y: 0,
    children: [
      { name: 'progress', align: 'blabs', x: 0, y: 44 },
      { name: 'playButton', align: 'tl', x: 15, y: 12 },
      { name: 'timeDisplay', align: 'tl', x: 10, y: 5 },
      { name: 'fullScreenButton', align: 'tr', x: 10, y: 12 },
      { name: 'subtitle', align: 'tr', x: 15, y: 12 },
      { name: 'setting', align: 'tr', x: 15, y: 12 },
      { name: 'volume', align: 'tr', x: 5, y: 10 },
      { name: 'snapshot', align: 'tr', x: 5, y: 10, children: false },
    ],
  },
];

// A builtin component name is assignable to the layout name field.
const builtin: Aliplayer.BuiltinComponentName = 'liveShiftProgress';
void layout;
void builtin;

// ---------------------------------------------------------------------------
// 4. Playback control + chaining
// ---------------------------------------------------------------------------

p1.play();
p1.play(true);
p1.pause();
p1.pause(true);
p1.replay();
p1.stop();
p1.seek(30);
p1.mute();
p1.unMute();
p1.setSpeed(1.5);
p1.setSpeed(1.5, false);
p1.setVolume(0.5);
p1.setRotate(90);
p1.setImage('horizon');
p1.cancelImage();
p1.setCover('https://example.com/poster.jpg');
p1.setPreviewTime(30);
p1.setProgressMarkers([{ offset: 1, text: 'a' }]);
p1.setProgressMarkers();
p1.setTraceId('tid');
p1.setPlayerSize(640, 360);
p1.setPlayerSize('100%', 'auto');
p1.setTextTracks([{ srclang: 'en', src: 'en.vtt' }]);
// Chainable: play/pause return `this`. `seek` returns `this | undefined`
// because the runtime returns nothing when the argument is NaN, so a chain
// that continues past `seek` must narrow first.
p1.play().pause().play(false);
const seeked = p1.seek(0);
if (seeked) {
  seeked.play(true);
}

// `getRotate()` declares one parameter but ignores it, so both forms are valid.
const rotate: number = p1.getRotate();
const rotateToo: number = p1.getRotate(45);
// `getImage()` is `undefined` until a mirror has been applied.
const mirrored: string | undefined = p1.getImage();
void rotate;
void rotateToo;
void mirrored;

// ---------------------------------------------------------------------------
// 5. Getters return the precise runtime types
// ---------------------------------------------------------------------------

const currentTime: number = p1.getCurrentTime();
const duration: number = p1.getDuration();
const displayDuration: number = p1.getDisplayDuration();
const buffered: TimeRanges = p1.getBuffered();
const readyState: number = p1.readyState();
// getError() may be undefined before any error occurs.
const mediaError: MediaError | null | undefined = p1.getError();
const volume: number = p1.getVolume();
const isPaused: boolean = p1.paused();
const isMuted: boolean = p1.muted();
const status: Aliplayer.PlayerStatus = p1.getStatus();
const options: Aliplayer.AliplayerOptions = p1.getOptions();
const optionsViaAccessor: Aliplayer.AliplayerOptions = p1.options();
const merged: Aliplayer.AliplayerOptions = p1.options({ autoplay: false });
const sourceUrl: string = p1.getSourceUrl();
const recentEvent: string = p1.getRecentOccuredEvent();
const monitorInfo: Aliplayer.MonitorInfo = p1.getMonitorInfo();
const readyTime: number = p1.getReadyTime();
const isPreview: boolean = p1.isPreview();
const exceeded: boolean = p1.exceedPreviewTime(10);
// getPreviewTime() returns undefined when preview was never configured.
const previewTime: number | undefined = p1.getPreviewTime();
const markers: Aliplayer.ProgressMarker[] = p1.getProgressMarkers();
const supportsMse: boolean = p1.isSupportMSE();
const online: boolean = p1.checkOnline();
const element: HTMLElement = p1.el();
const content: HTMLElement = p1.contentEl();
const id: string = p1.id();
const internalId: string = p1.getId();
const ownPlayerRef: Aliplayer.Aliplayer = p1.player();
const selfBackRef: Aliplayer.Aliplayer = p1._player;
const videoTag: HTMLVideoElement = p1.tag;
const resolution: { width: number; height: number } = p1.resolution;
const urls: Aliplayer.UrlItem[] = p1._urls;
const currentPlayIndex: number = p1._currentPlayIndex;
const multiLevel: boolean = p1.isMutiLevel;
const eventState: string = p1._eventState;
const loadedFlag: boolean = p1.loaded;
const oncePlayedFlag: boolean = p1.oncePlayed;
const disposedFlag: boolean = p1.__disposed;
void currentTime; void duration; void displayDuration; void buffered; void readyState;
void mediaError; void volume; void isPaused; void isMuted; void status; void options;
void optionsViaAccessor; void merged; void sourceUrl; void recentEvent; void monitorInfo;
void readyTime; void isPreview; void exceeded; void previewTime; void markers;
void supportsMse; void online; void element; void content; void id; void internalId;
void ownPlayerRef; void selfBackRef; void videoTag; void resolution; void urls;
void currentPlayIndex; void multiLevel; void eventState; void loadedFlag;
void oncePlayedFlag; void disposedFlag;

// getCurrentQuality(): object OR empty string — a real union in the runtime.
const quality: Aliplayer.CurrentQuality | '' = p1.getCurrentQuality();
if (quality !== '') {
  const w: number | undefined = quality.width;
  const u: string | undefined = quality.url;
  const d: string | undefined = quality.definition;
  void w; void u; void d;
}

// getCurrentPDT() is only implemented for iOS/Safari live, hence optional.
const pdt: number | undefined = p1.getCurrentPDT();
void pdt;

// getMetaData() is a stub on the base player.
const meta: unknown = p1.getMetaData();
void meta;

// getStats() is a PromiseLike (poly-filled), NOT a native Promise.
const statsPromise: PromiseLike<Aliplayer.PlayerStats | undefined> = p1.getStats();
statsPromise.then((stats) => {
  if (stats) {
    const bytes: number | undefined = stats.bytesReceived;
    const frames: number | undefined = stats.framesDecoded;
    const rtt: number | undefined = stats.rtt;
    void bytes; void frames; void rtt;
  }
});
// `.then` alone must work (that is all the monitor itself relies on).
void statsPromise.then(() => undefined);

// loadByUrl family.
p1.loadByUrl('https://example.com/c.mp4');
p1.loadByUrl('https://example.com/c.mp4', 10);
p1.loadByUrl('https://example.com/c.mp4', 10, true);
p1.loadByUrl('https://example.com/c.mp4', 10, true, true);
p1.firstNewUrlloadByUrl('https://example.com/d.mp4');
p1.firstNewUrlloadByUrl('https://example.com/d.mp4', true);
p1.switchUrl();

// VOD/SaaS re-auth paths.
p1.replayByVidAndPlayAuth('vid', 'newPlayauth');
p1.updateSourcesByVidAndPlayAuth('vid', 'newPlayauth');
p1.reloaduserPlayInfoAndVidRequestMts('vid', 'newPlayauth');

// Snapshot config: note the misspelled runtime name is what we must call.
p1.setSanpshotProperties(1280, 720);
p1.setSanpshotProperties(1280, 720, 0.8);

// Text tracks getter: a list-like union, so iterate by index (never assume
// array methods or `.item()` exist).
const trackList = p1.getTextTracks();
for (let i = 0; i < trackList.length; i++) {
  const track = trackList[i];
  if (track) {
    const lang: string = track.language;
    void lang;
  }
}
// The internal list exposes its backing array.
if ('list' in trackList) {
  const inner: readonly Aliplayer.AliplayerTextTrack[] = trackList.list;
  void inner;
}
// The internal track type carries the player-specific extras.
const sample: Aliplayer.AliplayerTextTrack | undefined =
  trackList[0] as Aliplayer.AliplayerTextTrack | undefined;
if (sample && typeof sample.setExtData === 'function') {
  sample.setExtData({ provider: 'aliyun' });
  const cues: readonly VTTCue[] = sample.cues;
  void cues;
}

// Internal lifecycle hooks that are part of the component contract.
p1.initPlay();
p1.initPlay(true);
p1.initChildren();
p1.setControls();
p1.hideProgress();
p1.cancelHideProgress();
p1.syncUI();
p1.renderUI();
p1.bindEvent();

// Telemetry helpers.
p1.traceLog('base/player', 'some detail');
p1.log('PLAY', { vt: 12 });
p1.log('CUSTOM');
p1.logError({ error_code: 4013 }, true);
p1.logError();

// ---------------------------------------------------------------------------
// 6. Events — typed paramData per event
// ---------------------------------------------------------------------------

// ✅ `on` returns void in the runtime (the patched listener recorder discards it).
const onResult: void = p1.on(Aliplayer.EventType.TimeUpdate, (e) => {
  const time: number = e.paramData;
  const name: string = e.type;
  void time; void name;
});
void onResult;

// Typed payloads for each documented event.
p1.on('error', (e) => {
  const code: number | Aliplayer.ErrorCodeValue = e.paramData.error_code;
  const msg: string = e.paramData.error_msg;
  const display: string | undefined = e.paramData.display_msg;
  const mediaId: string | number | undefined = e.paramData.mediaId;
  void code; void msg; void display; void mediaId;
});

p1.on('snapshoted', (e) => {
  const time: number = e.paramData.time;
  const base64: string = e.paramData.base64;
  const binary: string = e.paramData.binary;
  const err: string | undefined = e.paramData.error;
  void time; void base64; void binary; void err;
});

p1.on('textTrackReady', (e) => {
  const first: Aliplayer.SubtitleTrackInfo | undefined = e.paramData[0];
  if (first) {
    const value: string = first.value;
    const text: string = first.text;
    void value; void text;
  }
});

p1.on('audioTrackReady', (e) => {
  // Nullable in the runtime (`_getTracks` can return null).
  if (e.paramData) {
    const track: Aliplayer.AudioTrackInfo = e.paramData[0];
    void track;
  }
});

p1.on('resolutionChange', (e) => {
  const oldW: number = e.paramData.oldResolution.width;
  const newH: number = e.paramData.newResolution.height;
  void oldW; void newH;
});

p1.on('canplay', (e) => {
  if (e.paramData) {
    const loadtime: number = e.paramData.loadtime;
    void loadtime;
  }
});

p1.on('autoplay', (e) => {
  const started: boolean = e.paramData;
  void started;
});

p1.on('levelsLoaded', (e) => {
  const levels: Aliplayer.HlsLevel[] | undefined = e.paramData.levels;
  if (levels && levels[0]) {
    const bandwidth: string | undefined = levels[0].attrs?.BANDWIDTH;
    void bandwidth;
  }
});

p1.on('rtsFallback', (e) => {
  const reason: string | undefined = e.paramData.reason;
  const url: string | undefined = e.paramData.fallbackUrl;
  void reason; void url;
});

p1.on('h265PlayInfo', (e) => {
  const codecTag: string | undefined = e.paramData.codecTag;
  const renderType: string | undefined = e.paramData.renderType;
  void codecTag; void renderType;
});

p1.on('defaultbandwidth', (e) => {
  const bitrate: number = e.paramData.bitrate;
  void bitrate;
});

p1.on('settingSelected', (e) => {
  const text: string | undefined = e.paramData.text;
  void text;
});

p1.on('autoResize', (e) => {
  const w: number = e.paramData.width;
  const h: number = e.paramData.height;
  void w; void h;
});

p1.on('startSeek', (e) => {
  const from: number = e.paramData;
  void from;
});

// Signal-only events carry `undefined` payloads.
p1.on('ready', (e) => {
  const nothing: undefined = e.paramData;
  void nothing;
});

// Event-name constants give the literal names.
p1.on(Aliplayer.EventType.Play, () => {});
p1.on(Aliplayer.EventType.Pause, () => {});
p1.on(Aliplayer.EventType.Ended, () => {});
p1.on(Aliplayer.EventType.Waiting, () => {});
p1.on(Aliplayer.EventType.RequestFullScreen, () => {});
p1.on(Aliplayer.EventType.CancelFullScreen, () => {});
p1.on(Aliplayer.EventType.LiveStreamStop, () => {});
p1.on(Aliplayer.EventType.OnM3u8Retry, () => {});
p1.on(Aliplayer.EventType.AutoPlayPrevented, () => {});
p1.on(Aliplayer.EventType.CompleteSeek, () => {});
p1.on(Aliplayer.EventType.DurationChange, () => {});
p1.on(Aliplayer.EventType.Init, () => {});
p1.on(Aliplayer.EventType.Playing, () => {});
p1.on(Aliplayer.EventType.LevelsLoaded, () => {});
p1.on(Aliplayer.EventType.LevelSwitch, () => {});
p1.on(Aliplayer.EventType.LevelSwitched, () => {});
p1.on(Aliplayer.EventType.AudioTrackUpdated, () => {});
p1.on(Aliplayer.EventType.AudioTrackSwitch, () => {});
p1.on(Aliplayer.EventType.AudioTrackSwitched, () => {});
p1.on(Aliplayer.EventType.MarkerDotOver, () => {});
p1.on(Aliplayer.EventType.MarkerDotOut, () => {});
p1.on(Aliplayer.EventType.SeiFrame, () => {});
p1.on(Aliplayer.EventType.RtsTraceId, () => {});
p1.on(Aliplayer.EventType.H265DecoderOverload, () => {});
p1.on(Aliplayer.EventType.H266PlayInfo, () => {});
p1.on(Aliplayer.EventType.Snapshoting, () => {});

// Listener `this` is the emitting element.
p1.on('play', function (e) {
  const el: HTMLElement = this;
  const tag: string | undefined = el.tagName;
  void e; void tag;
});

// Array-of-events overload (lib/event.on accepts a list).
p1.on(['timeupdate', 'play', 'pause'], (e) => {
  void e.type;
});

// `one`, `off`, `trigger` are chainable.
const oneChain: Aliplayer.Aliplayer = p1.one('ended', () => {});
const offChain: Aliplayer.Aliplayer = p1.off('ended');
const offWithHandler: Aliplayer.Aliplayer = p1.off('ended', () => {});
const triggerChain: Aliplayer.Aliplayer = p1.trigger('error', {
  mediaId: 'vid',
  error_code: 4400,
  error_msg: 'manual',
});
p1.trigger('myCustomEvent', { any: 'payload' });
void oneChain; void offChain; void offWithHandler; void triggerChain;

// Event object surface.
p1.on('timeupdate', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const prevented: boolean = e.defaultPrevented;
  const dm: boolean = e.isDefaultPrevented();
  const ps: boolean = e.isPropagationStopped();
  const ip: boolean = e.isImmediatePropagationStopped();
  const target: EventTarget | null = e.target;
  const which: number | undefined = e.which;
  void prevented; void dm; void ps; void ip; void target; void which;
});

// ---------------------------------------------------------------------------
// 7. Services exposed on the instance
// ---------------------------------------------------------------------------

const fs2: Aliplayer.FullscreenService = p1.fullscreenService;
fs2.requestFullScreen();
fs2.cancelFullScreen();
const isFs: boolean = fs2.getIsFullScreen();
const fullWindow: boolean = fs2.isFullWindow;
void isFs; void fullWindow;

// ⚠️ The misspelled facade name is intentional: it is what the runtime sets.
const shift = p1.liveShiftSerivce;
if (shift) {
  shift.setLiveTimeRange('2023-12-01T08:00:00Z', '2023-12-01T10:00:00Z');
  shift.queryLiveShift('https://example.com/q', (data) => {
    const retCode: number = data.retCode;
    void retCode;
  });
  const playing: boolean = shift.isLiveShiftPlaying();
  void playing;
}

if (p1._ccService) {
  const cc: Aliplayer.SubtitleService = p1._ccService;
  cc.close();
  const opened: { label: string; language: string } = cc.open();
  cc.switch('off');
  const current: string = cc.getCurrentSubtitle();
  void opened; void current;
}

if (p1._audioTrackService) {
  p1._audioTrackService.support();
  p1._audioTrackService.switch('2');
}

if (p1._qualityService) {
  const levels: Aliplayer.QualityLevel[] = p1._qualityService.levels;
  const drm: Aliplayer.UrlItem[] = p1._qualityService.drmUrl;
  p1._qualityService.loadLevels('https://example.com/index.m3u8');
  void levels; void drm;
}

if (p1._progressMarkerService) {
  const pm: Aliplayer.ProgressMarker[] = p1._progressMarkerService.progressMarkers;
  void pm;
}

if (p1._thumbnailService) {
  const svc: Aliplayer.ThumbnailService = p1._thumbnailService;
  svc.get('https://example.com/thumb.vtt');
  const cue: Aliplayer.ThumbnailCue | null = svc.findAvailableCue(10);
  const resolved: string = svc.makeUrl('sprite.jpg');
  const base: string = svc.baseUrl;
  void cue; void resolved; void base;
}

// Optional internal instances (present depending on config/renderer).
const monitor: Aliplayer.Monitor | null | undefined = p1._monitor;
if (monitor) {
  const opt: Aliplayer.MonitorInfo = monitor.opt;
  void opt;
}
const lifecycle: Aliplayer.LifecycleManager = p1._lifeCycleManager;
const component: Aliplayer.AliplayerComponent | null = lifecycle.getComponent('hello');
void component;
const uiRegistry: Record<string, Aliplayer.ComponentClass<any>> = p1.UI;
void uiRegistry;

// ---------------------------------------------------------------------------
// 8. Custom components via Aliplayer.Component (factory, not a class)
// ---------------------------------------------------------------------------

interface HelloState extends Aliplayer.AliplayerComponent {
  _text: string;
  setText(text: string): void;
}

const HelloSpec = {
  init(this: HelloState, player: Aliplayer.Aliplayer, options: Aliplayer.UIComponentOptions) {
    this._text = String(options.text ?? 'hello');
    // Inherited members are available while typing `this`.
    player.on('ready', () => this.syncUI());
  },
  createEl(this: HelloState): HTMLElement {
    const el = document.createElement('div');
    el.className = 'prism-hello';
    return el;
  },
  renderUI(this: HelloState) {
    this.el().textContent = this._text;
  },
  syncUI(this: HelloState) {},
  setText(this: HelloState, text: string) {
    this._text = text;
    this.renderUI();
  },
};

const Hello = Aliplayer.Component<typeof HelloSpec>(HelloSpec);

// Use it through the components option.
const withComponent = new Aliplayer({
  id: 'player',
  source: 'x',
  components: [{ name: 'hello', type: Hello, args: [] }],
});
const helloInstance = withComponent.getComponent('hello');
if (helloInstance) {
  void helloInstance.el();
}

// Subclass an existing component class.
const ControlBar = p1.UI.controlBar;
const Extended = ControlBar.extend({ renderUI(this: Aliplayer.AliplayerComponent) {} });
void Extended;

// Instantiate directly and attach.
const helloDirect = new Hello(p1, { name: 'hello', align: 'tl', x: 8, y: 8 });
p1.addChild(helloDirect);
p1.addChild('bigPlayButton', { align: 'blabs', x: 30, y: 80 });
p1.removeChild(helloDirect);
helloDirect.addClass('a');
helloDirect.removeClass('a');
helloDirect.show();
helloDirect.hide();
helloDirect.destroy();
const helloParent: Aliplayer.Aliplayer = helloDirect.player();
const helloOptions: Aliplayer.UIComponentOptions = helloDirect.options();
void helloParent; void helloOptions;

// ---------------------------------------------------------------------------
// 9. AliplayerEvent is structural and pass-through friendly
// ---------------------------------------------------------------------------

function describe(event: Aliplayer.AliplayerEvent<unknown>): string {
  const out = [event.type, String(event.paramData), String(event.which)];
  event.stopImmediatePropagation();
  // Unknown native fields remain accessible (index signature).
  const nativeField = event['someNativeField'];
  void nativeField;
  return out.join('|');
}
p1.on('waiting', (e) => {
  void describe(e);
});

// ---------------------------------------------------------------------------
// 10. Ambient globals
// ---------------------------------------------------------------------------

// `window.Aliplayer` mirrors the module value.
const fromWindow: typeof Aliplayer = window.Aliplayer;
const viaWindow = new fromWindow({ id: 'player', source: 'x' });
void viaWindow;

// The bundle back-references the player on the media element.
const video = document.createElement('video');
video.player = p1;
const roundTrip: Aliplayer.Aliplayer | undefined = video.player;
void roundTrip;

// ---------------------------------------------------------------------------
// 11. Realistic end-to-end usage
// ---------------------------------------------------------------------------

const vod = new Aliplayer({
  id: 'player',
  vid: 'vid',
  playauth: 'playauth',
  cover: 'https://example.com/cover.jpg',
  width: '100%',
  height: '100%',
  progressMarkers: [{ offset: 5, text: 'chapter 1' }],
  skinLayout: [
    { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
    { name: 'infoDisplay' },
    { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
    {
      name: 'controlBar',
      align: 'blabs',
      x: 0,
      y: 0,
      children: [
        { name: 'progress', align: 'blabs', x: 0, y: 44 },
        { name: 'playButton', align: 'tl', x: 15, y: 12 },
      ],
    },
  ],
});

vod.on('error', (e) => {
  const code = e.paramData.error_code;
  if (code === 4002) {
    // AuthKeyExpired → refresh credentials through the documented *option* hook
    // (it lives on the options object, not on the instance).
    vod.options().refreshAccessInfo?.();
  }
  if (code === 4004) {
    vod.switchUrl();
  }
  console.error(code, e.paramData.error_msg);
});

vod.on('timeupdate', (e) => {
  const t = e.paramData;
  const total = vod.getDuration();
  if (Number.isFinite(total) && total > 0) {
    const pct: number = (t / total) * 100;
    void pct;
  }
});

const stats = vod.getStats();
void stats.then((s) => s?.rtt);

export {};
