// =============================================================================
// @an-types/aliyun-aliplayer-cdn  —  TypeScript definitions
//
// Target artifact:
//   https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/aliplayer-min.js
//   (banner: /*! aliyun-aliplayer - v2.19.0 - 2023-12-01 11.44.13 */)
//
// These declarations were derived by decompiling the published bundle into its
// 163 Browserify modules and by executing the real bundle under jsdom to
// enumerate the live prototype chain, own instance state, the `EventType`
// registry and the exact `paramData` payloads behind every `trigger()` call.
// They therefore describe what the code *actually does*, which differs from the
// marketing API in several documented below places (misspelled `liveShiftSerivce`,
// `setSanpshotProperties`, `getRecentOccuredEvent`, `on()` returning `void`, …).
//
// Installation (CDN global):
//   <script src="https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/aliplayer-min.js"></script>
//   <script src="https://g.alicdn.com/apsara-media-box/imp-web-player/2.19.0/aliplayer-min.css"></script>
//   then either reference `window.Aliplayer` globally (UMD `export as namespace`)
//   or `import Aliplayer from "@an-types/aliyun-aliplayer-cdn";` for types only.
// =============================================================================

export = Aliplayer;
export as namespace Aliplayer;

// -----------------------------------------------------------------------------
// The callable / constructible value.
//
// The bundle's UMD wrapper assigns a plain factory function to
// `window.Aliplayer`. That function does `return Aliplayer.create(...)` internally,
// so it works both with and without `new`, and it carries the static members
// (`getVersion`, `util`, `Component`, `EventType`, `players`, `reloadInstance`).
// A `var` of an interface with both call and construct signatures models this
// exactly and keeps `import Aliplayer from "…"` working under `esModuleInterop`.
// -----------------------------------------------------------------------------
interface Aliplayer {
  /** Modern form: container supplied through `options.id`. */
  (options: Aliplayer.AliplayerOptions, readyCallback?: Aliplayer.ReadyCallback): Aliplayer.Aliplayer;
  new (options: Aliplayer.AliplayerOptions, readyCallback?: Aliplayer.ReadyCallback): Aliplayer.Aliplayer;

  /**
   * Legacy / document form. The first argument is still read as
   * `options.id` by `playerutil.createWrapper`, so it must be a container id or
   * element; passing a bare element here resolves via `nodeName`.
   */
  (tagOrId: string | HTMLElement, options?: Aliplayer.AliplayerOptions, readyCallback?: Aliplayer.ReadyCallback): Aliplayer.Aliplayer;
  new (tagOrId: string | HTMLElement, options?: Aliplayer.AliplayerOptions, readyCallback?: Aliplayer.ReadyCallback): Aliplayer.Aliplayer;

  /** The running player build, read from the bundled `package.json` (`"2.19.0"`). */
  getVersion(): string;

  /**
   * The tiny utility bag actually hung on the constructor by
   * `lib/componentutil.register` — only `stopPropagation` is exposed.
   */
  util: Aliplayer.AliplayerUtil;

  /**
   * UI-component factory (this is `lib/oo.extend` verbatim).
   *
   * It is a **factory, not a class**: it takes a spec object whose `init`
   * becomes the constructor, and returns a subclass constructor. It has no
   * `.create` and must not be used with `new` directly.
   *
   * @example
   * ```ts
   * interface Hello extends Aliplayer.AliplayerComponent { _text: string }
   * const Hello = Aliplayer.Component<Aliplayer.UIComponentMethods & { _text: string }>({
   *   init(this: Hello, player, options) { this._text = String(options.text ?? 'hello'); },
   *   createEl(this: Hello) { return document.createElement('div'); },
   *   renderUI(this: Hello) { this.el().textContent = this._text; },
   * });
   * const player = new Aliplayer({ id: 'p', components: [{ name: 'hello', type: Hello, args: [] }] });
   * player.getComponent('hello');
   * ```
   */
  Component<Spec extends Record<string, unknown>>(
    spec?: Spec,
  ): Aliplayer.ComponentClass<Aliplayer.ComponentInstance<Spec>>;

  /**
   * Public event registry: `PascalCase` key → the literal event name emitted.
   * `player.on(Aliplayer.EventType.Ready, …)`.
   */
  EventType: Aliplayer.PlayerEventTypeMap;

  /**
   * Declared as `{}` by the bundle (`window.Aliplayer.players = {}`). The 2.19
   * core never writes to it, so treat it as an optional consumer-owned registry.
   */
  players: Record<string, Aliplayer.Aliplayer>;

  /**
   * Dispose `oldInstance`, rebuild a player from `instanceLike` (the previous
   * internal options), re-attach every user handler recorded through the
   * patched `on`, and graft the new prototype back onto the old object — so the
   * caller's variable keeps pointing at a working player.
   */
  reloadInstance(
    instanceLike: Aliplayer.AliplayerOptions & {
      readyCallback?: Aliplayer.ReadyCallback;
      _readyCallbackCalled?: boolean;
    },
    callback: (player: Aliplayer.Aliplayer) => void,
    oldInstance: Aliplayer.Aliplayer,
  ): Aliplayer.Aliplayer;
}

declare var Aliplayer: Aliplayer;

declare namespace Aliplayer {
  // ===========================================================================
  // 1. Event & callback primitives
  // ===========================================================================

  /** Invoked once the player has finished its ready sequence. */
  type ReadyCallback = (player: Aliplayer) => void;

  /**
   * The normalised event object handed to every listener.
   *
   * `lib/event.fixEvent` copies the native event's own enumerable properties
   * onto a fresh object, adds jQuery-style `isDefaultPrevented()` helpers and a
   * normalised `which`/`button`, and `component.trigger` injects the player's
   * own payload as `paramData`. Because arbitrary native fields pass through,
   * an index signature is required.
   */
  interface AliplayerEvent<Payload = undefined> {
    /** Event name, e.g. `"timeupdate"`. */
    readonly type: string;
    /** The element the dispatcher was bound to (root `_el`, video tag, …). */
    readonly target: EventTarget | null;
    /** Player payload; `undefined` for signal-only events. */
    readonly paramData: Payload;
    readonly relatedTarget?: EventTarget | null;
    /** Normalised key code (`charCode || keyCode`) or mouse button. */
    readonly which?: number;
    /** Normalised to 0/1/2 by `fixEvent`. */
    readonly button?: number;
    readonly clientX?: number;
    readonly clientY?: number;
    readonly pageX?: number;
    readonly pageY?: number;
    readonly layerX?: number;
    readonly layerY?: number;
    readonly screenX?: number;
    readonly screenY?: number;
    readonly keyCode?: number;
    readonly charCode?: number;
    readonly altKey?: boolean;
    readonly ctrlKey?: boolean;
    readonly shiftKey?: boolean;
    readonly metaKey?: boolean;
    defaultPrevented: boolean;
    /** `trigger` defaults to bubbling unless explicitly `false`. */
    bubbles?: boolean;
    cancelBubble?: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    stopImmediatePropagation(): void;
    isImmediatePropagationStopped(): boolean;
    /** Passed through from the native event when the trigger originated there. */
    currentTarget?: EventTarget | null;
    eventPhase?: number;
    timeStamp?: number;
    detail?: unknown;
    srcElement?: EventTarget | null;
    returnValue?: boolean;
    [key: string]: unknown;
  }

  /**
   * A player event listener.
   * `lib/event.on` calls handlers as `handler.call(element, event)`, so `this`
   * is the emitting element — **not** the player and not bound by arrow scope.
   */
  type PlayerEventListener<Payload = unknown> = (
    this: HTMLElement,
    event: AliplayerEvent<Payload>,
  ) => void;

  // ===========================================================================
  // 2. Player events → paramData payload map (verified per trigger site)
  // ===========================================================================

  /** `error` payload. Codes come from {@link ErrorCode}. */
  interface PlayerErrorPayload {
    mediaId?: string | number;
    /**
     * One of {@link ErrorCodeValue} for known codes. Written as a
     * `(number & {})` union so the known literals still autocomplete while an
     * unlisted code from a newer build stays assignable.
     */
    error_code: ErrorCodeValue | (number & NonNullable<unknown>);
    error_msg: string;
    /** Localised message safe to show to an end user. */
    display_msg?: string;
    /** Server-API variant surfaces the raw `Code`/`Message` pair. */
    Code?: number;
    Message?: string;
    sri?: string;
    [key: string]: unknown;
  }

  /** `snapshoted` payload (from `ui/player/component/snapshot`). */
  interface SnapshotPayload {
    /** Capture position in seconds. */
    time: number;
    /** `data:` URL of the captured frame. */
    base64: string;
    /** The base64 payload converted to a binary string. */
    binary: string;
    /** Non-empty when the canvas capture failed. */
    error?: string;
  }

  /** One subtitle entry in a `textTrackReady` payload. */
  interface SubtitleTrackInfo {
    /** Language code; `"off"` for the disabled pseudo-track. */
    value: string;
    /** Human-readable label. */
    text: string;
  }

  /** One audio entry in an `audioTrackReady` payload. */
  interface AudioTrackInfo {
    value: string | number;
    text: string;
  }

  /** Modes used by the player's internal text-track implementation. */
  type AliplayerTrackMode = 'disabled' | 'showing' | 'hidden';

  /** Kinds used by the player's internal text-track implementation. */
  type AliplayerTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'metadata' | 'chapters';

  /**
   * The player's own `TextTrack` (module `lib/vtt/text-track.js`).
   *
   * It mirrors the DOM `TextTrack` API but is a distinct class: cues are held on
   * the instance and mirrored onto `_nativeTrack` when the broker attaches one.
   * `metadata`/`chapters` kinds default to `"hidden"` mode.
   */
  interface AliplayerTextTrack {
    readonly id: string;
    readonly kind: AliplayerTrackKind;
    /** Writable: setting it also propagates to the native track. */
    language: string;
    label: string;
    /** Writable: setting it also propagates to the native track. */
    mode: AliplayerTrackMode;
    readonly default: boolean | undefined;
    readonly cues: readonly VTTCue[];
    readonly activeCues: readonly VTTCue[];
    /** The mirrored native track, when one is attached. */
    nativeTrack: TextTrack | null;
    addCue(cue: VTTCue): void;
    removeCue(cue: VTTCue): void;
    /** Merge extra data onto the track (used by the VTT renderer). */
    setExtData(data: Record<string, unknown>): void;
    /** The normalised settings object backing the accessors above. */
    readonly _settings: {
      kind: AliplayerTrackKind;
      language: string;
      label: string;
      mode: AliplayerTrackMode;
      default?: boolean;
    };
    readonly _extData: Record<string, unknown>;
  }

  /**
   * The player's own `TextTrackList` — a list-like object, neither an array nor
   * the DOM `TextTrackList`.
   */
  interface AliplayerTextTrackList {
    readonly length: number;
    /** The backing array of tracks. */
    readonly list: readonly AliplayerTextTrack[];
    /** Append a track (ignored if already present); defines the numeric index getter. */
    addTrack(track: AliplayerTextTrack): void;
    [index: number]: AliplayerTextTrack | undefined;
  }

  /** `levelsLoaded` payload — raw parsed HLS master playlist. */
  interface LevelsLoadedPayload {
    url?: string;
    levels?: HlsLevel[];
    [key: string]: unknown;
  }

  interface HlsLevel {
    url?: string | string[];
    height?: number;
    width?: number;
    bitrate?: number;
    attrs?: HlsLevelAttrs;
    [key: string]: unknown;
  }

  /** `#EXT-X-STREAM-INF` attribute list (upper-cased as parsed). */
  interface HlsLevelAttrs {
    RESOLUTION?: string;
    BANDWIDTH?: string;
    CODECS?: string;
    'PROGRAM-ID'?: string;
    [key: string]: string | undefined;
  }

  /** `resolutionChange` payload (live sources whose natural size changes). */
  interface ResolutionChangePayload {
    oldResolution: { width: number; height: number };
    newResolution: { width: number; height: number };
  }

  /** `h265PlayInfo` / `h266PlayInfo` payload. */
  interface DecoderPlayInfoPayload {
    renderType?: 'native' | 'wasm' | 'gpu' | string;
    /** e.g. `"hvc1"`, `"hev1"`, `"vvc1"`, `"vvcC"`, `"avc1"`. */
    codecTag?: string;
    isHevcSupported?: boolean;
    waitRenderType?: boolean;
    [key: string]: unknown;
  }

  /** `h265DecoderOverload` payload — the splayer `decoderoverload` CustomEvent detail. */
  type H265DecoderOverloadPayload = Record<string, unknown>;

  /** `settingSelected` payload — a menu entry in the setting selector. */
  interface SettingSelectedPayload {
    name?: string;
    type?: string;
    text?: string;
    key?: string | number;
    [key: string]: unknown;
  }

  /** `defaultbandwidth` payload. */
  interface DefaultBandWidthPayload {
    width: number;
    height: number;
    bitrate: number;
  }

  /** `canplay` payload — `{ loadtime }` in milliseconds. */
  interface CanPlayPayload {
    loadtime: number;
  }

  /** `rtsFallback` payload. */
  interface RtsFallbackPayload {
    reason?: string;
    fallbackUrl?: string;
  }

  /** `rtsTraceId` payload. */
  interface RtsTraceIdPayload {
    traceId?: string;
    source?: string;
  }

  /** `audioTrackUpdated` payload. */
  interface AudioTrackUpdatedPayload {
    audioTracks?: readonly MediaTrackLike[];
    [key: string]: unknown;
  }

  /**
   * Maps each public event name to the exact `paramData` type the 2.19 bundle
   * passes at its `trigger()` call sites. `undefined` means "signal only".
   */
  interface PlayerEventPayloadMap {
    timeupdate: number;
    durationchange: undefined;
    init: undefined;
    ready: undefined;
    play: undefined;
    playing: undefined;
    pause: undefined;
    canplay: CanPlayPayload | undefined;
    waiting: undefined;
    ended: undefined;
    error: PlayerErrorPayload;
    requestFullScreen: undefined;
    cancelFullScreen: undefined;
    snapshoted: SnapshotPayload;
    snapshoting: undefined;
    onM3u8Retry: undefined;
    liveStreamStop: undefined;
    autoPlayPrevented: undefined;
    autoplay: boolean;
    startSeek: number;
    completeSeek: number;
    textTrackReady: readonly SubtitleTrackInfo[];
    audioTrackReady: readonly AudioTrackInfo[] | null;
    audioTrackUpdated: AudioTrackUpdatedPayload;
    audioTrackSwitch: unknown;
    audioTrackSwitched: unknown;
    levelsLoaded: LevelsLoadedPayload;
    levelSwitch: undefined;
    levelSwitched: undefined;
    markerDotOver: undefined;
    markerDotOut: undefined;
    defaultbandwidth: DefaultBandWidthPayload;
    resolutionChange: ResolutionChangePayload;
    seiFrame: unknown;
    rtsFallback: RtsFallbackPayload;
    rtsTraceId: RtsTraceIdPayload;
    h265PlayInfo: DecoderPlayInfoPayload;
    h266PlayInfo: DecoderPlayInfoPayload;
    h265DecoderOverload: H265DecoderOverloadPayload;
    settingSelected: SettingSelectedPayload;
    autoResize: { width: number; height: number };
    /**
     * Internal (`Private.LifeCycleChanged`) but observable through `on`.
     * Carried whenever the lifecycle manager re-dispatches a media event.
     */
    lifeCycleChanged: { type: string; data: Event | AliplayerEvent<unknown> };
  }

  /**
   * Every event name with a *documented* payload. This is a superset of
   * {@link PlayerEventTypeMap} values: it also includes internal
   * (`Private`) events that can still be observed through {@link Aliplayer.on}.
   * Any other string is accepted as well, with `paramData: unknown`.
   */
  type PlayerEventName = keyof PlayerEventPayloadMap;

  /**
   * Shape of the `Aliplayer.EventType` object.
   * Source of truth: `player/base/event/eventtype.js` → `Player` group,
   * re-exported verbatim by `lib/componentutil.register`.
   */
  interface PlayerEventTypeMap {
    readonly TimeUpdate: 'timeupdate';
    readonly DurationChange: 'durationchange';
    readonly Init: 'init';
    readonly Ready: 'ready';
    readonly Play: 'play';
    readonly Playing: 'playing';
    readonly Pause: 'pause';
    readonly CanPlay: 'canplay';
    readonly Waiting: 'waiting';
    readonly Ended: 'ended';
    readonly Error: 'error';
    readonly RequestFullScreen: 'requestFullScreen';
    readonly CancelFullScreen: 'cancelFullScreen';
    readonly Snapshoted: 'snapshoted';
    readonly Snapshoting: 'snapshoting';
    readonly OnM3u8Retry: 'onM3u8Retry';
    readonly LiveStreamStop: 'liveStreamStop';
    readonly AutoPlayPrevented: 'autoPlayPrevented';
    readonly AutoPlay: 'autoplay';
    readonly StartSeek: 'startSeek';
    readonly CompleteSeek: 'completeSeek';
    readonly TextTrackReady: 'textTrackReady';
    readonly AudioTrackReady: 'audioTrackReady';
    readonly AudioTrackUpdated: 'audioTrackUpdated';
    readonly LevelsLoaded: 'levelsLoaded';
    readonly AudioTrackSwitch: 'audioTrackSwitch';
    readonly AudioTrackSwitched: 'audioTrackSwitched';
    readonly LevelSwitch: 'levelSwitch';
    readonly LevelSwitched: 'levelSwitched';
    readonly MarkerDotOver: 'markerDotOver';
    readonly MarkerDotOut: 'markerDotOut';
    readonly DefaultBandWidth: 'defaultbandwidth';
    readonly ResolutionChange: 'resolutionChange';
    readonly SeiFrame: 'seiFrame';
    readonly RtsFallback: 'rtsFallback';
    readonly RtsTraceId: 'rtsTraceId';
    readonly H265PlayInfo: 'h265PlayInfo';
    readonly H266PlayInfo: 'h266PlayInfo';
    readonly H265DecoderOverload: 'h265DecoderOverload';
    readonly SettingSelected: 'settingSelected';
    readonly AutoResize: 'autoResize';
  }

  /**
   * Full internal event registry (`player/base/event/eventtype.js`).
   * Only `Player` is re-exported on the public constructor, but the private and
   * video groups are emitted on the DOM and can be observed by advanced code.
   */
  interface EventTypes {
    /** Native media-element events mirrored onto the video tag. */
    readonly Video: {
      readonly TimeUpdate: 'timeupdate';
      readonly Play: 'play';
      readonly Playing: 'playing';
      readonly Pause: 'pause';
      readonly CanPlay: 'canplay';
      readonly Waiting: 'waiting';
      readonly Ended: 'ended';
      readonly Error: 'error';
      readonly Suspend: 'suspend';
      readonly Stalled: 'stalled';
      readonly LoadStart: 'loadstart';
      readonly DurationChange: 'durationchange';
      readonly LoadedData: 'loadeddata';
      readonly LoadedMetadata: 'loadedmetadata';
      readonly Progress: 'progress';
      readonly CanPlayThrough: 'canplaythrough';
      readonly ContextMenu: 'contextmenu';
      readonly Seeking: 'seeking';
      readonly Seeked: 'seeked';
      readonly ManualEnded: 'manualended';
      readonly VolumeChange: 'volumechange';
      readonly RateChange: 'ratechange';
    };
    readonly Player: PlayerEventTypeMap;
    /** Internal UI plumbing — not part of the supported public surface. */
    readonly Private: {
      readonly Create: 'create';
      readonly Play_Btn_Show: 'play_btn_show';
      readonly Play_Btn_Hide: 'play_btn_hide';
      readonly UiH5Ready: 'uiH5Ready';
      readonly Error_Hide: 'error_hide';
      readonly Error_Show: 'error_show';
      readonly Info_Show: 'info_show';
      readonly Info_Hide: 'info_hide';
      readonly H5_Loading_Show: 'h5_loading_show';
      readonly H5_Loading_Hide: 'h5_loading_hide';
      readonly HideProgress: 'hideProgress';
      readonly CancelHideProgress: 'cancelHideProgress';
      readonly UpdateProgress: 'updateProgress';
      readonly UpdateCursorPosition: 'updateCursorPosition';
      readonly Click: 'click';
      readonly MouseOver: 'mouseover';
      readonly MouseOut: 'mouseout';
      readonly MouseEnter: 'mouseenter';
      readonly MouseLeave: 'mouseleave';
      readonly TouchStart: 'touchstart';
      readonly TouchMove: 'touchmove';
      readonly TouchEnd: 'touchend';
      readonly HideBar: 'hideBar';
      readonly ShowBar: 'showBar';
      readonly ControlBarClick: 'controlBarClick';
      readonly ReadyState: 'readyState';
      readonly SourceLoaded: 'sourceloaded';
      readonly QualityChange: 'qualitychange';
      readonly Cover_Hide: 'cover_hide';
      readonly Cover_Show: 'cover_show';
      readonly SeekStart: 'seekStart';
      readonly EndStart: 'endStart';
      readonly UpdateProgressBar: 'updateProgressBar';
      readonly LifeCycleChanged: 'lifeCycleChanged';
      readonly Dispose: 'dispose';
      readonly Created: 'created';
      readonly Snapshot_Hide: 'snapshot_hide';
      readonly AutoStreamShow: 'auto_stream_show';
      readonly AutoStreamHide: 'auto_stream_hide';
      readonly VolumnChanged: 'volumnchanged';
      readonly LiveShiftQueryCompleted: 'liveShiftQueryCompleted';
      readonly LiveShiftSwitchToLive: 'LiveShiftSwitchToLive';
      readonly StreamSelectorHide: 'streamSelectorHide';
      readonly SpeedSelectorHide: 'speedSelectorHide';
      readonly SettingShow: 'settingShow';
      readonly SettingHide: 'settingHide';
      readonly SelectorShow: 'selectorShow';
      readonly SelectorHide: 'selectorHide';
      readonly SettingListShow: 'settingListShow';
      readonly SettingListHide: 'settingListHide';
      readonly ThumbnailHide: 'thumbnailHide';
      readonly ThumbnailShow: 'thumbnailShow';
      readonly ThumbnailLoaded: 'thumbnailLoaded';
      readonly TooltipShow: 'tooltipShow';
      readonly TooltipHide: 'tooltipHide';
      readonly SelectorUpdateList: 'selectorUpdateList';
      readonly SelectorValueChange: 'selectorValueChange';
      readonly SelectorGenerateList: 'selectorGenerateList';
      readonly VolumeVisibilityChange: 'volumeVisibilityChange';
      readonly VolumeUpdatePosition: 'volumeUpdatePosition';
      readonly ChangeURL: 'changeURL';
      readonly UpdateToSettingList: 'updateToSettingList';
      readonly CCChanged: 'CCChanged';
      readonly CCStateChanged: 'CCStateChanged';
      readonly CCReset: 'ccReset';
      readonly TextTrackFounded: 'textTrackFounded';
      readonly UserTrackReset: 'userTrackReset';
      readonly PlayClick: 'click';
      readonly ProgressMarkerLoaded: 'progressMarkerLoaded';
      readonly ProgressMarkerChanged: 'progressMarkerChanged';
      readonly MarkerTextShow: 'markerTextShow';
      readonly MarkerTextHide: 'markerTextHide';
      readonly PREPARE: 'prepare';
      readonly SeiFrame: 'privateSeiFrame';
      readonly PlayInfoLoaded: 'playInfoLoaded';
      readonly Retry: 'retry';
      readonly LicenseHasResult: 'licenseHasResult';
      readonly PatchWaiting: 'patchWaiting';
      readonly VttHide: 'vttHide';
      readonly VttSwitchTrack: 'vttSwitchTrack';
      readonly VttClearTracks: 'vttClearTracks';
      readonly SafariDrmLevelSwitch: 'safariDrmLevelSwitch';
      readonly VodRequestException: 'vodRequestException';
      readonly VodRequestExceptionResume: 'vodRequestExceptionResume';
      readonly TraceLog: 'traceLog';
      readonly PlaybackRateChanged: 'playbackRateChanged';
    };
  }

  /** Payload for the internal `info_show` event (volume/quality toast). */
  interface InfoShowPayload {
    text: string;
    /** Auto-hide delay in ms. */
    duration: number;
    /** CSS-ish alignment token, e.g. `"lb"`. */
    align: string;
  }

  // ===========================================================================
  // 3. Error & result codes (lib/constants)
  // ===========================================================================

  /**
   * Player/server error codes surfaced as `error_code` on the `error` event.
   * Extracted from `lib/constants.ErrorCode` of the 2.19.0 build.
   */
  interface ErrorCode {
    readonly InvalidParameter: 4001;
    readonly AuthKeyExpired: 4002;
    readonly InvalidSourceURL: 4003;
    readonly NotFoundSourceURL: 4004;
    readonly StartLoadData: 4005;
    readonly LoadedMetadata: 4006;
    readonly PlayingError: 4007;
    readonly LoadingTimeout: 4008;
    readonly RequestDataError: 4009;
    /** Note the typo `Encrpty` is present in the shipped bundle. */
    readonly EncrptyVideoNotSupport: 4010;
    readonly FormatNotSupport: 4011;
    readonly PlayauthDecode: 4012;
    readonly PlayDataDecode: 4013;
    readonly NetworkUnavaiable: 4014;
    readonly UserAbort: 4015;
    readonly NetworkError: 4016;
    readonly URLsIsEmpty: 4017;
    readonly DrmLicenseRequestFailed: 4018;
    readonly RecordNotAllowed: 4019;
    readonly MediaNotFound: 4020;
    readonly DrmNotSupported: 4021;
    readonly DrmLoadError: 4022;
    readonly RegionBlock: 4023;
    readonly CrossDomain: 4027;
    readonly OtherError: 4400;
    readonly ServerAPIError: 4500;
    readonly FlashNotInstalled: 4600;
    readonly RtsSignalError: 4100;
    readonly RtsPlayFailedError: 4200;
    readonly RtsNotSupportWebRtc: 4110;
    readonly RtsBrowserNotSupport: 4111;
    readonly RtsBrowserVersionTooLow: 4112;
    readonly RtsNotSupportH264: 4113;
    readonly RtsCreateOfferError: 4114;
    readonly RtsAutoPLayFaild: 4115;
    readonly RtsPlayUrlError: 4116;
    readonly RtsSubscribeNonthing: 4117;
    readonly RtsHtmlElementError: 4118;
    readonly RtsHtmlElementNotMatch: 4119;
    readonly RtsBrowserNotSupportRtc: 4120;
    readonly RtsHttpRequestFaild: 4121;
    readonly RtsHttpAnswerFaild: 4122;
    readonly RtsPeerConnectionUnknown: 4123;
    readonly SplayerEnvCheckError: 4300;
    readonly SplayerCoroutineError: 4301;
    readonly SplayerDecodeError: 4302;
    readonly SplayerBufferingError: 4303;
    readonly SplayerParserNotFound: 4304;
  }

  /** Every error code the 2.19 bundle can emit, as a union of literals. */
  type ErrorCodeValue = ErrorCode[keyof ErrorCode];

  /**
   * `VideoErrorCode`: HTML `MediaError.code` → player error code.
   * `1`→4015 (abort), `2`→4016 (network), `3`→4013 (decode), `4`→4400 (server).
   */
  type VideoErrorCodeMap = { 1: 4015; 2: 4016; 3: 4013; 4: 4400 };

  /**
   * `LicenseResultCode`: result of the H.265/H.266 commercial-license check
   * carried on the internal `licenseHasResult` event.
   */
  type LicenseResultCode =
    | 0 // Success
    | 1 // NotFound
    | 2 // Expired
    | 3 // CertInvalid
    | 4 // WasmNotSupported
    | 5 // ResourceIncorrect
    | 6 // LicenseKeyInvalid
    | 7; // DomainInvalid

  /** `EncryptionType`: Private=1, Standard=2, ChinaDRM=3, PlayReady=4, Widevine=5. */
  type EncryptionTypeValue = 1 | 2 | 3 | 4 | 5;

  /** `DRMType`. */
  type DRMTypeName = 'Widevine' | 'PlayReady';

  /** `DRMKeySystem` (`4`→playready, `5`→widevine). */
  type DRMKeySystemName = 'com.microsoft.playready' | 'com.widevine.alpha';

  /** `WidthMapToLevel`: pixel dimension → localised quality label. */
  type WidthMapToLevelMap = {
    0: 'OD';
    640: 'FD';
    960: 'LD';
    1280: 'SD';
    1920: 'HD';
    2580: '2K';
    3840: '4K';
  };

  /** Speed menu keys shipped in `SpeedLevels` (0.5×, 1×, 1.25×, 1.5×, 2×). */
  type DefaultSpeedKey = 0.5 | 1 | 1.25 | 1.5 | 2;

  /** `IconType`: iconfont injection mode. */
  type IconTypeName = 'fontclass' | 'symbol' | 'Sprite';

  /**
   * Cookie keys the player persists. `selectedStreamLevel` and `selectedCC` are
   * written with a 365-day lifetime, so a test fixture should clear them to get
   * deterministic quality/subtitle defaults.
   */
  type PlayerStorageKey =
    | 'selectedStreamLevel'
    | 'selectedCC'
    | 'HWDetectHvc1'
    | 'HWDetectHvc1Hls'
    | 'HWDetectHev1'
    | 'HWDetectHev1Hls';

  /** Auth lifetimes: play-auth 7200s, refresh tick 7000ms, authInfo 100s. */
  type AuthKeyExpiredSeconds = 7200;

  /**
   * Quality definition labels recognised by the VOD play-info API.
   * `"AUTO"` is the adaptive sentinel the API returns for the auto-select entry.
   */
  type DefinitionLabel = QualityLabel | 'AUTO';

  // ===========================================================================
  // 4. Configuration
  // ===========================================================================

  /**
   * Every key the player recognises, with its default where the bundle has one
   * (`lib/playerutil.js`'s default-option object is the source of truth).
   *
   * Unknown keys are merged into `_options` and preserved, so an index
   * signature is included — but every supported key is spelled out below.
   */
  interface AliplayerOptions {
    // ---- container & lifecycle ------------------------------------------------

    /**
     * Container element or its DOM id (a leading `"#"` is stripped).
     * Resolution happens in `playerutil.createWrapper`; if the result is not an
     * element with `nodeName` the constructor throws
     * `TypeError("没有为播放器指定容器")` ("no container specified for the player").
     */
    id?: string | HTMLElement | undefined;
    /**
     * Media address. Also accepts a **JSON string** mapping quality definitions
     * to URLs (`{"HD":"https://…","SD":"https://…"}`), which `switchUrl()` cycles
     * through — see `_extraMultiSources`.
     */
    source?: string | undefined;
    /** Called once when the player is ready (`ready` event). Also settable post-creation. */
    readyCallback?: ReadyCallback | undefined;
    /** Internal flag: whether `readyCallback` already fired. */
    _readyCallbackCalled?: boolean;
    /** Hook used by internal recovery to rebuild the player. */
    recreatePlayer?: ((player?: Aliplayer) => void) | undefined;
    /** Hook invoked when long-lived VOD auth expires so you can supply fresh credentials. */
    refreshAccessInfo?: (() => void | Promise<void>) | undefined;

    /** Play as live: no duration semantics, live-retry + `liveStreamStop`. Default `false`. */
    isLive?: boolean | undefined;
    /** Autoplay. Default `true`. */
    autoplay?: boolean | undefined;
    /** `preload` attribute on the media element. Default `true`. */
    preload?: boolean | undefined;
    /** Loop VOD playback. Default `false`. */
    rePlay?: boolean | undefined;
    /** Use the browser's native `<video controls>`. Default `false`. */
    useNativeControls?: boolean | undefined;
    /**
     * Allow the browser context menu on the video. Default `false`, in which
     * case `contextmenu` is `preventDefault`ed.
     */
    enableSystemMenu?: boolean | undefined;
    /** Show the diagnose/retry button in the error overlay. Default `true`. */
    diagnosisButtonVisible?: boolean | undefined;
    /** Verbose internal logging. Default `false`. */
    debug?: boolean | undefined;

    // ---- sizing ---------------------------------------------------------------

    /** Outer container width (CSS length). Also applied via `adjustContainerLayout`. Default `"100%"`. */
    width?: string | number | undefined;
    /** Outer container height. Default `"300px"`. */
    height?: string | number | undefined;
    /** Inner `<video>` width. Default `"100%"`. */
    videoWidth?: string | number | undefined;
    /** Inner `<video>` height. Default `"100%"`. */
    videoHeight?: string | number | undefined;
    /** Forced aspect ratio (w/h). When set, the ratio adapter letterboxes instead of using the natural size. */
    ratio?: number | undefined;
    /** Poster/cover image URL shown before first play. */
    cover?: string | undefined;

    // ---- chrome & UI ----------------------------------------------------------

    /** Delay (ms) before the control bar auto-hides. Default `5000`. */
    showBarTime?: number | undefined;
    /** Let the control bar overlay the video. Default `false`. */
    controlBarForOver?: boolean | undefined;
    /** Control bar reveal strategy. Default `"hover"`. */
    controlBarVisibility?: 'hover' | 'click' | 'always' | undefined;
    /**
     * Skin layout. `false` removes all chrome; an array replaces the default
     * layout. Anything else throws `"PrismPlayer Error: skinLayout should be
     * false or type of array!"`. When omitted, a default layout is injected per
     * media type (H5 VOD, live, RTS, audio, flash, live-shift).
     */
    skinLayout?: false | SkinLayoutItem[] | undefined;
    /**
     * Custom components. When omitted/empty the runtime substitutes the internal
     * `defaultemptycomponent`, so this is safe to pass as `[]`.
     */
    components?: ComponentRegistration[] | false | undefined;
    /**
     * Base URL for skin **image** assets. Checked first; used only for
     * `<base>/skins/default/img/dragcursor.png` (see also {@link sdkDomain}).
     */
    skinsDomain?: string | undefined;
    /** Skin resource atlas URL (flash path). Derived from `domain`/`flashVersion` by default. */
    skinRes?: string | undefined;
    /** Override the speed menu entries (defaults to the built-in 0.5×–2× list). */
    speedLevels?: SpeedOption[] | undefined;
    /** Inline playback on mobile (adds `playsinline`, `webkit-playsinline`, `x5-playsinline`, `x-webkit-airplay`). Default `true`. */
    playsinline?: boolean | undefined;
    /** Keyboard shortcuts. Default `false`. */
    keyShortCuts?: boolean | undefined;
    /** Seek step (seconds) for keyboard fast-forward/rewind. Default `10`. */
    keyFastForwardStep?: number | undefined;

    // ---- VOD / Media-VOD credentials -----------------------------------------

    /** Media asset id. When set without `source`, the player takes a VOD/MTS/SaaS path. */
    vid?: string | number | undefined;
    /** Encrypted play-auth token (the usual VOD credential). */
    playauth?: string | undefined;
    readonly accessKeyId?: string | undefined;
    readonly accessKeySecret?: string | undefined;
    /** STS token paired with `accessKeyId`/`accessKeySecret`. */
    securityToken?: string | undefined;
    /** Region for API endpoints. Default `"cn-shanghai"`. */
    region?: string | undefined;
    /** Domain region override for the MTS endpoint. */
    domainRegion?: string | undefined;
    /** Auth-info blob for the MPS/SaaS signature path. */
    authInfo?: string | Record<string, unknown> | undefined;
    /** `mediaAuth` token for the newer VOD API. `null`/`undefined` ⇒ URL mode. */
    mediaAuth?: string | null | undefined;
    reAuthInfo?: Record<string, unknown> | undefined;
    /** Auth timeout in seconds; defaults to {@link AuthKeyExpiredSeconds} when unset. */
    authTimeout?: number | string | undefined;
    /**
     * MTS signature-flow aliases, read by `saas/mtsplayer` when building the
     * signed API request (`accessId`/`accessSecret`/`securityToken` equivalents).
     */
    accId?: string | undefined;
    accSecret?: string | undefined;
    stsToken?: string | undefined;
    accessSecret?: string | undefined;
    /**
     * Forwarded verbatim into the (Aliyun-forked) hls.js configuration object by
     * `hls/hlsinjector` — they are **not** API/MTS parameters. `domain` here does
     * not change any CDN host: that comes from the bundle-internal `config`
     * module.
     */
    app?: string | undefined;
    stream?: string | undefined;
    domain?: string | undefined;
    regionId?: string | undefined;
    /** Request the snapshot list along with play info. */
    includeSnapshotList?: boolean | undefined;
    /** Free-form extras; `liveRetry` here overrides the top-level retry count. */
    extraInfo?: { liveRetry?: number; [key: string]: unknown } | undefined;
    /** Flash-only: window mode of the embedded object. */
    wmode?: string | undefined;

    // ---- stream selection -----------------------------------------------------

    /** Format filter/hint: `""`, `"mp4"`, `"m3u8"`, `"mp3"`, `"flv"`, … */
    format?: string | undefined;
    /** Restrict play info to a single definition (`"AUTO"`, `"HD"`, `"SD"`, …). */
    definition?: string | undefined;
    /** Preferred definition on first load. */
    defaultDefinition?: string | undefined;
    /** Ordering of the quality list. Default `"asc"`. */
    qualitySort?: 'asc' | 'desc' | undefined;
    /** Source is variable-bitrate; enables HLS level parsing/`levelsLoaded`. Default `false`. */
    isVBR?: boolean | undefined;
    /** Source is DRM. Default `false`. */
    isDrm?: boolean | undefined;
    /** Hand over HLS levels without a visible reload. */
    seamlessHandover?: boolean | undefined;
    /** Token appended to HLS segment URIs for authorisation. */
    hlsUriToken?: string | undefined;
    /** Encryption type for legacy private encryption (only `1` is supported). Default `0`. */
    encryptType?: number | undefined;
    /** VTT thumbnail-sprite URL for scrubber previews. */
    thumbnailUrl?: string | undefined;
    /** Additional audio/text track descriptors. */
    tracks?: MediaTrackLike[] | undefined;
    /** User text tracks (deduplicated by `srclang`, labels disambiguated). */
    textTracks?: UserTextTrack[] | undefined;
    /** Progress-bar chapter/ad markers. */
    progressMarkers?: ProgressMarker[] | undefined;

    // ---- retries & timeouts ---------------------------------------------------

    /** Live retry count. Default `5`. */
    liveRetry?: number | undefined;
    /** Base retry delay in seconds. Default `1`. */
    liveRetryInterval?: number | undefined;
    /** Added per-attempt delay in seconds (linear backoff). Default `0`. */
    liveRetryStep?: number | undefined;
    /** VOD retry count. Default `3`. */
    vodRetry?: number | undefined;
    /** Timeout for fetching play data, in **seconds**. Default `20`. */
    loadDataTimeout?: number | undefined;
    /** Buffering timeout in seconds before recovery. Default `60`. */
    waitingTimeout?: number | undefined;
    /** Buffered seconds required to leave `waiting`. Default `3`. */
    waitingBufferedTime?: number | undefined;
    /** Seconds before the loading spinner appears. Default `1`. */
    delayLoadingShow?: number | undefined;
    /** Max stall-nudge retries. Default `5`. */
    nudgeMaxRetry?: number | undefined;
    /** DRM session timeout in ms. Default `5000`. */
    drmSessionTimeout?: number | undefined;
    /** hls.js load timeout in ms. Default `20000`. */
    hlsLoadingTimeOut?: number | undefined;
    /** RTS load-data timeout in ms. Default `6000`. */
    rtsLoadDataTimeout?: number | undefined;
    /** Timeout forwarded to injector paths (seconds). */
    loadingTimeOut?: number | undefined;
    /** Seconds to delay autoplay while displaying a hint. Default `0`. */
    autoPlayDelay?: number | undefined;
    /** Overlay text shown during `autoPlayDelay`. */
    autoPlayDelayDisplayText?: string | undefined;

    // ---- live time shift ------------------------------------------------------

    /** Time-shift query API base URL. */
    liveTimeShiftUrl?: string | undefined;
    /** URL used while playing shifted content. */
    liveShiftSource?: string | undefined;
    /** Time-shift anchor timestamp. */
    liveShiftTime?: string | number | undefined;
    /** Minimum offset (seconds) kept from the live edge. Default `30`. */
    liveShiftMinOffset?: number | undefined;
    /** Live start boundary (ISO string or epoch). */
    liveStartTime?: string | number | undefined;
    /** Live end boundary. */
    liveOverTime?: string | number | undefined;
    /** Chasing-to-live-edge configuration for flv/hls. */
    flvFrameChasing?: boolean | undefined;
    hlsFrameChasing?: boolean | undefined;
    chasingFirstParagraph?: number | undefined;
    chasingSecondParagraph?: number | undefined;
    chasingFirstSpeed?: number | undefined;
    chasingSecondSpeed?: number | undefined;

    // ---- codec / renderer -----------------------------------------------------

    /** Software-render H.265. Default `false`. */
    enableH265?: boolean | undefined;
    /** Force the H.265 software path. Default `false`. */
    forceH265?: boolean | undefined;
    /** Software-render H.266/VVC. Default `false`. */
    enableH266?: boolean | undefined;
    /** Force the H.266 software path. Default `false`. */
    forceH266?: boolean | undefined;
    /** WASM threads for H.265. Default `true`. */
    h265Threads?: boolean | undefined;
    /** SIMD for H.265. Default `true`. */
    h265Simd?: boolean | undefined;
    /** splayer bundle URL; defaults to the pinned `amcom-splayer` CDN build. */
    splayerUrl?: string | null | undefined;
    /** Override the WASM asset domain used by splayer. */
    splayerWasmDomain?: string | null | undefined;

    // ---- rendering engine selection ------------------------------------------

    /** Force hls.js on Safari even when native HLS is available. Default `false`. */
    useHlsPluginForSafari?: boolean | undefined;
    /** Enable MSE playback on Android. Default `true`. */
    enableMSEForAndroid?: boolean | undefined;
    /** Prefer hls.js on capable mobile browsers. Default `true`. */
    useHlsPlugOnMobile?: boolean | undefined;
    /** Prefer flv.js on mobile. Default `false`. */
    useFlvPlugOnMobile?: boolean | undefined;
    /** Pin hls.js v2. `undefined` ⇒ auto-select. */
    useHls2?: boolean | undefined;
    /** Run demuxing in a Web Worker. Default `true`. */
    enableWorker?: boolean | undefined;
    /** RTS/HLS low-latency mode. Default `false`. */
    lowLatencyMode?: boolean | undefined;
    /** Send credentials on segment XHRs. */
    withCredentials?: boolean | undefined;

    // ---- RTS ------------------------------------------------------------------

    /** Skip the WebRTC support probe. Default `false`. */
    skipRtsSupportCheck?: boolean | undefined;
    /** URL to fall back to when RTS negotiation fails (`rtsFallback` event). */
    rtsFallbackSource?: string | undefined;
    rtsVersion?: string | undefined;
    rtsSdkUrl?: string | undefined;

    // ---- DRM ------------------------------------------------------------------

    widevineCertId?: string | undefined;
    certId?: string | undefined;
    /** Custom Shaka bundle URL. */
    shakaUrl?: string | undefined;
    /**
     * Base URL for skin **image** assets. Read only by the progress-bar drag
     * cursor (`skins/default/img/dragcursor.png`); it does not affect the
     * lazily-loaded `hls`/`flv`/`drm` scripts.
     */
    sdkDomain?: string | undefined;
    /** Passed through to the DRM injector. */
    drmOption?: Record<string, unknown> | undefined;

    // ---- flash legacy ---------------------------------------------------------

    /** Force the Flash prism player. `false`; implied by `rtmp:` sources. */
    useFlashPrism?: boolean | undefined;
    /** SWF path override. */
    playerSwfPath?: string | undefined;

    // ---- fullscreen -----------------------------------------------------------

    /** Use a CSS "mock" fullscreen on WebViews without the API. Default `false`. */
    enableMockFullscreen?: boolean | undefined;

    // ---- X5 / Android WebView -------------------------------------------------

    /** `x5-video-position`: `"normal"` or `"top"` (keeps video at the page top). */
    x5_video_position?: 'normal' | 'top' | '' | undefined;
    x5_type?: string | undefined;
    /** Request X5 native fullscreen. Default `false`. */
    x5_fullscreen?: boolean | undefined;
    /** Allowed X5 orientations. Default `"landscape|portrait"`. */
    x5_orientation?: string | undefined;
    /** Treat X5 landscape rotation as fullscreen. Default `true`. */
    x5LandscapeAsFullScreen?: boolean | undefined;

    // ---- media type / output --------------------------------------------------

    /** Logical media kind. Default `"video"`; forced to `"audio"` for `.mp3`. */
    mediaType?: 'video' | 'audio' | undefined;
    /** Output type hint forwarded to the play-info API. */
    outputType?: string | undefined;

    // ---- telemetry ------------------------------------------------------------

    /** Send usage logs to the Aliyun log service. Default `true`. */
    trackLog?: boolean | undefined;
    /** Batch log uploads. Default `true`. */
    logBatched?: boolean | undefined;
    /** Heartbeat stats interval in seconds. Default `30`. */
    heartHeatInterval?: number | undefined;
    /** Business id (`bi`) attached to telemetry. */
    from?: string | number | undefined;
    /** Trace id attached to logs and forwarded to media services. */
    traceId?: string | undefined;
    /**
     * Internal: forces the software/WASM renderer path. Set by injectors
     * (`saasplayer` assigns `false`), not usually a user knob.
     */
    _native?: boolean | undefined;
    /** Internal autoplay mirror used by some retry paths. */
    _autoplay?: boolean | undefined;
    /** Internal preload mirror. */
    _preload?: boolean | undefined;

    // ---- protection & extras --------------------------------------------------

    /** Anti screen-capture / recording protection. Default `false`. */
    preventRecord?: boolean | undefined;
    /** AI labelling feature switches (`ai.label` suppresses the `autoplay` attribute on iOS). */
    ai?: { label?: boolean; [key: string]: unknown } | undefined;
    /** Commercial licence for H.265/H.266 features. */
    license?: { key?: string; domain?: string; [key: string]: unknown } | undefined;
    /** Canvas watermark baked into snapshot output. */
    snapshotWatermark?: SnapshotWatermark | undefined;
    /** VOD play/preview configuration (trial window). */
    playConfig?: PlayConfig | undefined;

    // ---- engine option passthroughs ------------------------------------------

    /** flv.js config override. Default `{ accurateSeek: true }`. */
    flvOption?: FlvOption | undefined;
    /** hls.js config override. Default `{ stopLoadAsPaused: false }`. */
    hlsOption?: HlsOption | undefined;
    /** Enable flv.js stash buffer. Default `true`. */
    enableStashBufferForFlv?: boolean | undefined;
    /** Initial stash buffer size for flv.js (bytes). */
    stashInitialSizeForFlv?: number | undefined;

    /** Language code for built-in UI/error strings. Default `"zh-cn"` (`"en-us"`, `"ja"`, …). */
    language?: string | undefined;
    /** Override/extend the bundled language dictionary. */
    languageTexts?: Record<string, string> | undefined;
    /** Additional language texts merged over `languageTexts`. */
    extLanguageTexts?: Record<string, string> | undefined;

    /**
     * Controls: either `true` for native controls, or an object that is expanded
     * into a control-bar skin layout and added as a child component.
     */
    controls?: boolean | UIComponentOptions | undefined;

    /**
     * Child-component list. Normally you set {@link skinLayout} instead;
     * `initChildren()` copies `skinLayout` into `children`, and `setControls()`
     * does the same for the object form of `controls`, so this key is present on
     * `_options` on every live player.
     */
    children?: SkinLayoutItem[] | false | undefined;

    /** Extra CSS class applied to the component root by the base constructor. */
    className?: string | undefined;

    /**
     * Internal: a snapshot of the options as originally supplied, taken by
     * `adaptivePlayer.create` before defaults are merged
     * (`options._userOptions ??= { ...options }`). `reloadInstance` reads it.
     */
    _userOptions?: AliplayerOptions | undefined;

    /** Anything else is merged into `_options` verbatim. */
    [key: string]: unknown;
  }

  /** Skin layout alignment tokens handled by `lib/layout.render`. */
  type SkinAlign = 'tl' | 'tr' | 'tlabs' | 'trabs' | 'blabs' | 'brabs' | 'cc';

  /** One node of the `skinLayout` tree. */
  interface SkinLayoutItem {
    /** Registered component name — must exist in `player.UI`. */
    name: string;
    align?: SkinAlign | undefined;
    /**
     * Horizontal offset. A number is treated as pixels; a string containing
     * `"%"` is used as-is (see `layout.render`).
     */
    x?: number | string | undefined;
    y?: number | string | undefined;
    className?: string | undefined;
    /** Nested components; `false` removes the default children. */
    children?: SkinLayoutItem[] | false | undefined;
    [key: string]: unknown;
  }

  /** Known built-in component names (keys of `player.UI`). */
  type BuiltinComponentName =
    | 'H5Loading'
    | 'bigPlayButton'
    | 'controlBar'
    | 'progress'
    | 'playButton'
    | 'liveDisplay'
    | 'timeDisplay'
    | 'fullScreenButton'
    | 'volume'
    | 'snapshot'
    | 'errorDisplay'
    | 'infoDisplay'
    | 'liveShiftProgress'
    | 'liveShiftTimeDisplay'
    | 'setting'
    | 'subtitle'
    | 'thumbnail'
    | 'tooltip'
    | 'cover'
    | 'playanimation'
    | 'autoStreamSelector'
    | 'progressMarker'
    | 'textTrackDisplay'
    /** Flash-only children present in the default flash layout. */
    | 'nextButton'
    | 'streamButton'
    | 'liveIco'
    | 'fullControlBar'
    | 'fullTitle'
    | 'fullNormalScreenButton'
    | 'fullTimeDisplay'
    | 'fullZoom';

  /** One entry of the `components` option. */
  interface ComponentRegistration {
    /** Name used by `player.getComponent(name)`. */
    name?: string | undefined;
    /**
     * Component constructor produced by {@link Aliplayer.Component}.
     * Defaults to the registration object itself when omitted.
     */
    type?: ComponentClass | undefined;
    /** Arguments prepended to `(player, options)` via `Function.bind`-style construction. */
    args?: readonly unknown[] | undefined;
    [key: string]: unknown;
  }

  /** Snapshot canvas watermark. Values are passed straight to canvas 2D. */
  interface SnapshotWatermark {
    left?: string | number;
    top?: string | number;
    text?: string;
    /** Canvas font shorthand. Default `"16px 宋体"`. */
    font?: string;
    fillColor?: string;
    strokeColor?: string;
  }

  /** VOD play/preview configuration. */
  interface PlayConfig {
    /**
     * Trial window in seconds. While `0 < PreviewTime < duration`, the player is
     * in "preview" mode and pauses at the boundary (`isPreview()`,
     * `exceedPreviewTime()`).
     */
    PreviewTime?: number;
    [key: string]: unknown;
  }

  /** One entry of `speedLevels`. */
  interface SpeedOption {
    key: number;
    text: string;
  }

  /** Progress-bar marker. */
  interface ProgressMarker {
    /** Position in seconds along the media. */
    offset?: number;
    /** Text shown in the hover bubble (`markerTextShow`). */
    text?: string;
    /** Optional title shown alongside the text bubble. */
    title?: string;
    [key: string]: unknown;
  }

  /** Generic audio/text track descriptor. */
  interface MediaTrackLike {
    id?: string | number;
    kind?: string;
    label?: string;
    language?: string;
    srclang?: string;
    default?: boolean;
    enabled?: boolean;
    /** Codec string such as `"hvc1.1.6.L120.90"` or `"avc1.64001f,mp4a.40.2"`. */
    codec?: string;
    codecTag?: string;
    /** Numeric track type; `1` selects it as the video track (`getVideoTrack`). */
    type?: number | string;
    [key: string]: unknown;
  }

  /** A user-supplied subtitle track. */
  interface UserTextTrack {
    kind?: string;
    /** Deduplication key; also the fallback label. */
    srclang: string;
    label?: string;
    /** WebVTT URL. */
    src: string;
    [key: string]: unknown;
  }

  /** flv.js passthrough (`_options.flvOption`). */
  interface FlvOption {
    accurateSeek?: boolean;
    stashInitialSize?: number;
    /** Extra flv.js configuration keys are forwarded verbatim. */
    [key: string]: unknown;
  }

  /** hls.js passthrough (`_options.hlsOption`). */
  interface HlsOption {
    stopLoadAsPaused?: boolean;
    liveSyncDurationCount?: number;
    maxMaxBufferLength?: number;
    maxBufferSize?: number;
    maxBufferLength?: number;
    fragLoadingRetryDelay?: number;
    /** Also readable via the top-level `defaultBandwidth` option. */
    defaultBandwidth?: number;
    hlsBandWidthUpCacheTime?: number;
    [key: string]: unknown;
  }

  // ===========================================================================
  // 5. Runtime data shapes
  // ===========================================================================

  /** Returned by `getCurrentQuality()` when a quality list exists. */
  interface CurrentQuality {
    width?: number;
    url?: string;
    definition?: string;
  }

  /** Quality labels used by VOD definitions. */
  type QualityLabel = 'OD' | 'LD' | 'FD' | 'SD' | 'HD' | '2K' | '4K' | 'XLD' | 'FHD' | 'SQ' | 'HQ';

  /** One normalised quality URL (`saas/util.getItem` output). */
  interface UrlItem {
    Url: string;
    width?: number;
    height?: number;
    definition?: DefinitionLabel | (string & NonNullable<unknown>);
    format?: 'mp4' | 'mp3' | 'm3u8' | string;
    /** Localised quality description. */
    desc?: string;
    duration?: number;
    bitrate?: number;
    /** `1` ⇒ encrypted stream. */
    encrypt?: number;
    encryptionType?: number;
    plaintext?: string;
    rand?: string;
    [key: string]: unknown;
  }

  /** Raw `PlayInfoList.PlayInfo` entry as returned by the VOD/MTS API (PascalCase). */
  interface RawPlayInfo {
    Width?: number;
    Height?: number;
    Definition?: QualityLabel | 'AUTO' | string;
    PlayURL?: string;
    Format?: string;
    EncryptType?: string;
    Encrypt?: number;
    Plaintext?: string;
    Rand?: string;
    Duration?: number;
    Bitrate?: number;
    [key: string]: unknown;
  }

  /** Result bag handed to the VOD/SaaS `loadData` success callback. */
  interface LoadDataResult {
    requestId?: string;
    urls: UrlItem[];
    encryptUrlArr?: UrlItem[];
    thumbnailUrl?: string;
    coverUrl?: string;
    videoId?: string | number;
    userId?: string | number;
    textTracks?: UserTextTrack[];
    playInfoAry?: RawPlayInfo[];
    [key: string]: unknown;
  }

  /** Error bag handed to the VOD/SaaS failure callback. */
  interface LoadDataError {
    requestId?: string;
    code?: string | number;
    message?: string;
    [key: string]: unknown;
  }

  /** `getStatus()` values — the lifecycle state machine. */
  type PlayerStatus =
    | 'init'
    | 'ready'
    | 'loading'
    | 'play'
    | 'pause'
    | 'playing'
    | 'waiting'
    | 'error'
    | 'ended';

  /** Lifecycle hook names a custom component may implement (`plugin/lifecycle`). */
  type LifecycleHook =
    | 'createEl'
    | 'created'
    | 'ready'
    | 'loading'
    | 'play'
    | 'pause'
    | 'playing'
    | 'waiting'
    | 'timeupdate'
    | 'error'
    | 'ended'
    | 'dispose'
    | 'markerDotOver'
    | 'markerDotOut';

  /**
   * Transport statistics.
   *
   * NOTE: the base player resolves `getStats()` with **`undefined`**; only the
   * RTS player (and injected splayer builds) populate these fields.
   */
  interface PlayerStats {
    bytesReceived?: number;
    framesDecoded?: number;
    packetsReceived?: number;
    packetsLost?: number;
    /** Round-trip time in ms. */
    rtt?: number;
    /** Epoch ms of the snapshot. */
    timestamp?: number;
    totalDecodeTime?: number;
    audioUploadJitterBufferDelay?: number;
    audioDownloadJitterBufferDelay?: number;
    videoUploadJitterBufferDelay?: number;
    videoDownloadJitterBufferDelay?: number;
    [key: string]: unknown;
  }

  /** Per-interval stats derived by the heartbeat monitor. */
  interface StatsDelta {
    downloadSpeedPerSec?: number;
    decodedFramesPerSec?: number;
    packageLossRate?: number;
    rtt?: number;
    timeGap?: number;
  }

  /** `getMonitorInfo()` — the internal monitor's telemetry payload (`monitor.opt`). */
  interface MonitorInfo {
    /** Business id (`from`). */
    bi?: string;
    /** Region. */
    ri?: string;
    /** Session id (UUID). */
    uuid?: string;
    /** Request id (UUID). */
    requestId?: string;
    playId?: string;
    sessionId?: string;
    /** Video id. */
    vu?: string;
    vid?: string | number;
    /** App name. */
    app_n?: string;
    /** Player version. */
    av?: string;
    /** Render mode, e.g. `"h5"`. */
    dm?: string;
    /** Elapsed play time in seconds. */
    vt?: number;
    /** Total duration in seconds. */
    tvd?: number;
    /** Track type. */
    tt?: string;
    /** Player status. */
    sm?: string;
    /** Play definition. */
    dn?: string;
    /** OS name/version. */
    os?: string;
    osName?: string;
    osVersion?: string;
    /** Engine name/version. */
    et?: string;
    exName?: string;
    exVersion?: string;
    /** User agent. */
    uat?: string;
    /** Licence key. */
    li_ki?: string;
    /** Trace id. */
    ti?: string;
    /** Encoded query args (`vid`, `pauth`). */
    args?: string;
    /** Whether heartbeat logging is enabled. */
    trackLog?: boolean;
    /** Heartbeat status snapshot. */
    player_status?: Record<string, unknown>;
    [key: string]: unknown;
  }

  // ===========================================================================
  // 6. Services hung on the instance
  // ===========================================================================

  /** `player.fullscreenService` (created unconditionally). */
  interface FullscreenService {
    /** Enter fullscreen; `rotation` is the X5 orientation hint. */
    requestFullScreen(target?: HTMLElement, rotation?: number): void;
    cancelFullScreen(target?: HTMLElement): void;
    getIsFullScreen(): boolean;
    isFullWindow: boolean;
    isFullScreen: boolean;
    isFullScreenChanged: boolean;
    _player: Aliplayer;
    dispose(): void;
  }

  /**
   * `player.liveShiftSerivce`
   *
   * ⚠️ The property name is misspelled **`liveShiftSerivce`** in the shipped
   * bundle (module `service/liveshiftservice`), and is only created when
   * `isLive && liveStartTime && liveOverTime` (`playerutil.isLiveShift`).
   */
  interface LiveShiftFacade {
    /** Re-set the shift window boundaries. */
    setLiveTimeRange(start: string | number, end: string | number): void;
    /** Fetch the shift timeline from `liveTimeShiftUrl`. */
    queryLiveShift(
      url: string,
      onSuccess?: (data: { retCode: number; [key: string]: unknown }) => void,
      onError?: (error: unknown) => void,
    ): void;
    isLiveShiftPlaying(): boolean;
  }

  /** The full live-shift service behind the facade (`player._liveshiftService`). */
  interface LiveShiftService extends LiveShiftFacade {
    validate(): boolean;
    liveTimeRange?: {
      start: Date;
      end: Date;
      endDisplay: string;
      totalTime: number;
    };
    availableLiveShiftTime: number;
    seekTime: number;
    currentTimestamp?: number;
    currentTime?: Date;
    currentTimeDisplay?: string;
    timestampStart?: number;
    start(url: string): void;
    stop(time?: number): void;
    tickLocalLiveTime(): void;
    switchToLive(): void;
    getBaseTime(): number;
    getSourceUrl(time: number): string;
    getTimeline(): unknown;
    dispose(): void;
  }

  /** `player._ccService` — subtitle / closed-caption control. */
  interface SubtitleService {
    /**
     * Caption tracks, mirroring {@link Aliplayer.getTextTracks}: the internal
     * list-like when the VTT broker is enabled, otherwise the native
     * `video.textTracks`, otherwise an empty array.
     */
    getTextTracks(): readonly (AliplayerTextTrack | TextTrack)[] | TextTrackList | AliplayerTextTrackList;
    /** Disable all caption tracks (keeps the last shown for restore). */
    close(): void;
    /** Restore/enable the preferred track. Returns the newly-selected track. */
    open(): { label: string; language: string };
    /** Switch by language code; `"off"` disables. */
    switch(language: string): void;
    getCurrentSubtitle(): string;
    updateUI(lang?: string): void;
    tracks?: SubtitleTrackInfo[];
    dispose(): void;
  }

  /** `player._audioTrackService` — multi-音轨 selection. */
  interface AudioTrackService {
    /** Whether the platform exposes `video.audioTracks`. */
    support(): boolean;
    switch(id: string | number): void;
    dispose(): void;
  }

  /** `player._qualityService` — HLS level bookkeeping. */
  interface QualityService {
    levels: QualityLevel[];
    /** Play-info entries whose `encryptionType` is Widevine-FairPlay. */
    drmUrl: UrlItem[];
    /** Parse a master playlist and trigger `levelsLoaded`. */
    loadLevels(url: string): void;
    dispose(): void;
  }

  interface QualityLevel {
    Url: string;
    /** Height (falling back to width) used as the sort key. */
    desc?: number | string;
    bitrate?: number;
    /** Raw `RESOLUTION` attribute, e.g. `"1280x720"`. */
    resolution?: string;
    bandwidth?: number;
  }

  /** `player._progressMarkerService` */
  interface ProgressMarkerService {
    progressMarkers: ProgressMarker[];
    dispose(): void;
  }

  /** `player._thumbnailService` — VTT sprite previews. */
  interface ThumbnailService {
    cues: ThumbnailCue[];
    baseUrl: string;
    /** Load and parse a VTT thumbnail file. */
    get(url: string): void;
    /** Find the cue covering `time`, or `null`. */
    findAvailableCue(time: number): ThumbnailCue | null;
    /** Resolve a possibly-relative sprite URL against `baseUrl`. */
    makeUrl(src: string): string;
    dispose(): void;
  }

  interface ThumbnailCue {
    startTime: number;
    endTime: number;
    /** VTT cue text: sprite rectangle, usually `"x,y,w,h"`. */
    text?: string;
    [key: string]: unknown;
  }

  /** `player._lifeCycleManager` — custom component lifecycle dispatcher. */
  interface LifecycleManager {
    /** Look up a registered custom component instance by name. */
    getComponent(name: string): AliplayerComponent | null;
    components: Array<{ name: string; obj: AliplayerComponent }>;
  }

  /** Internal telemetry client (`player._monitor`). */
  interface Monitor {
    opt: MonitorInfo;
    player: Aliplayer;
    trackLog: boolean;
    /** Derived per-interval stats for the current heartbeat window. */
    heartBeatStatusData?: StatsDelta & Record<string, unknown>;
    replay(): void;
    updateVideoInfo(info: {
      video_id?: string | number;
      album_id?: string | number;
      source?: string;
      from?: string | number;
    }): void;
    updateSourceInfo(): void;
    updateTraceId(traceId: string): void;
    updateLightSaasVideoId(videoId: string | number): void;
    updateH265ProbeInfo(info: Record<string, unknown>): void;
    reportStartPlay(): void;
    reportCanplay(): void;
    reportPlayAbort(reason: string): void;
    resetVV(): void;
    removeEvent(): void;
    _onPlayerUnderload(): void;
    _log(event: string, data?: Record<string, unknown>): void;
    updateStats(callback?: (delta?: StatsDelta) => void): void;
    [key: string]: unknown;
  }

  // ===========================================================================
  // 7. The player instance
  // ===========================================================================

  /**
   * Everything `new Aliplayer(...)` gives you.
   *
   * The prototype chain is `Aliplayer → ui/component (Component) → lib/oo`.
   * Members inherited from `ui/component` are grouped under *Component API*
   * below; they exist on the player instance too, which is why the player can
   * be treated as a component.
   */
  interface Aliplayer extends ComponentCommon {
    // ---- playback transport ---------------------------------------------------

    /**
     * Start or resume playback. If the media already ended, replays from zero;
     * otherwise lazily loads the source and calls the native `video.play()`.
     * @param isManual truthy marks this as user-initiated (`_isManualPlay`).
     * @chainable
     */
    play(isManual?: boolean): this;
    /** Seek to 0 and play. @chainable */
    replay(): this;
    /**
     * Pause the media element.
     * @param isManual truthy records a user pause (`_isManualPause`).
     * @chainable
     */
    pause(isManual?: boolean): this;
    /**
     * Stop playback by clearing the `src` attribute
     * (`tag.setAttribute("src", null)`).
     * @chainable
     */
    stop(): this;
    /** Whether the media is paused. Returns `false` before the element exists. */
    paused(): boolean;
    /** Whether the media is muted (native `video.muted`). */
    muted(): boolean;
    /** Mute and remember the previous volume. @chainable */
    mute(): this;
    /** Restore the volume captured by {@link mute}. @chainable */
    unMute(): this;
    /**
     * Seek to an absolute position in seconds.
     * Floored to an integer and clamped to the duration; a `NaN` argument is
     * ignored entirely and returns `undefined`.
     * @chainable when the seek was accepted.
     */
    seek(time: number): this | undefined;
    /**
     * Set playback rate (`video.playbackRate`).
     * @param triggerEvent fire the internal `playbackRateChanged` event. Default `true`.
     */
    setSpeed(rate: number, triggerEvent?: boolean): void;

    /**
     * Set volume, clamped to `[0, 1]`. A non-zero value un-mutes, `0` mutes.
     * Side effect: shows the localised volume percentage toast (`info_show`).
     */
    setVolume(volume: number, triggerInfo?: unknown): void;
    /** Current volume in `[0, 1]`. */
    getVolume(): number;

    // ---- time & duration --------------------------------------------------------

    /** Playhead in seconds (`video.currentTime`), or `0` without an element. */
    getCurrentTime(): number;
    /**
     * Duration in seconds. In trial/preview mode this is the trimmed
     * `playConfig.PreviewTime` when shorter, and internal `_duration` takes
     * precedence when finite.
     */
    getDuration(): number;
    /** Duration as displayed in the UI (VOD-trimmed). */
    getDisplayDuration(): number;
    /** Buffered ranges of the media element. */
    getBuffered(): TimeRanges;
    /**
     * `readyState` of the media element (0 `HAVE_NOTHING` … 4 `HAVE_ENOUGH_DATA`).
     * Note this is a **method**, not the native `video.readyState` property.
     */
    readyState(): number;
    /**
     * The native `MediaError`. Returns `undefined` before any error has occurred
     * — the player reads `video.error`, which is `null` on some engines and
     * `undefined` on others — so treat it as nullable.
     */
    getError(): MediaError | null | undefined;
    /**
     * Program date-time (epoch ms) for DVR-capable live streams, and only on
     * iOS/Safari — `undefined` everywhere else, and `0` when the date is
     * unparseable.
     */
    getCurrentPDT(): number | undefined;
    /** Epoch ms at which the media first became ready (`readyTime`). */
    getReadyTime(): number;
    /**
     * Hook for source metadata (HLS `#EXT-X` / fMP4). The base implementation
     * returns `undefined`.
     */
    getMetaData(): unknown;

    // ---- source switching -------------------------------------------------------

    /**
     * Replace the current source with `url`.
     * @param time        seek target in seconds after the new source is ready
     * @param autoplay    start playing immediately
     * @param autoRetry   internal: skip the abort/VV reporting and recreation guard
     */
    loadByUrl(url: string, time?: number, autoplay?: boolean, autoRetry?: boolean): void;
    /** Reset the VOD state (`vid = 0`) and load a brand-new URL. */
    firstNewUrlloadByUrl(url: string, autoplay?: boolean): void;
    /**
     * Advance to the next URL in the multi-source list (`{HD:…, SD:…}` JSON
     * sources), wrapping to index 0 and counting retries. Persists the choice in
     * the `selectedStreamLevel` cookie.
     */
    switchUrl(): void;
    /** Cycle/apply quality for a SaaS/VOD source (loads `aliplayer-vod-p-min.js` on demand). */
    loadData(options?: Record<string, unknown>, callback?: (data: LoadDataResult) => void): void;
    /**
     * Re-authorize and replay the same `vid` with a new `playauth`.
     * @chainable implementations vary by injected subclass.
     */
    replayByVidAndPlayAuth(vid: string | number, playauth: string, accessSecret?: string): void;
    /** Update source URLs for the current `vid` without restarting playback. */
    updateSourcesByVidAndPlayAuth(vid: string | number, playauth: string): void;
    /** Alias of {@link Aliplayer.replayByVidAndPlayAuth}. */
    reloaduserPlayInfoAndVidRequestMts(vid: string | number, playauth: string): void;
    /** Load by vid for the legacy MTS flow. */
    loadByVidAndAuthInfo?(vid: string | number, authInfo: unknown): void;
    /** Load by vid for the light-SaaS (`mediaAuth`) flow. */
    loadByLightSaas?(): void;
    /** Re-authorize a light-SaaS player with a new `mediaAuth`. */
    replayByMediaAuth?(mediaAuth: string): void;
    /** Load by vid for the MTS signature flow. */
    loadByMts?(): void;
    /** Re-run the MTS request with updated credentials. */
    replayByVidAndAuthInfo?(vid: string | number, authInfo?: unknown): void;
    reloadNewVideoInfo?(vid: string | number): void;

    // ---- state & info -----------------------------------------------------------

    /** Current lifecycle status; `"init"` before the first state change. */
    getStatus(): PlayerStatus;
    /** The fully merged runtime options (defaults + user + injected). */
    getOptions(): AliplayerOptions;
    /** The owning player. For a player instance this is the instance itself. */
    player(): Aliplayer;
    /**
     * Back-reference used by child components. On the player this points at
     * itself (`player._player === player`), which is why internal code sometimes
     * calls `this._player.trigger(...)` from player methods.
     */
    _player: Aliplayer;
    /**
     * The component-inherited option accessor. On the player this reads/writes
     * the same object as {@link getOptions} (`_options`); passing a patch
     * **merges** it into `_options` rather than replacing it.
     */
    options(): AliplayerOptions;
    options(patch: Partial<AliplayerOptions>): AliplayerOptions;
    /** Whether the current platform can host MSE playback. */
    isSupportMSE(): boolean;
    /** Whether a media URL is valid; triggers a player `error` when offline. */
    checkOnline(): boolean;
    /** Current source URL (from `_options.source`), or `""`. */
    getSourceUrl(): string;
    /** Active quality descriptor, or `""` when there is no quality list. */
    getCurrentQuality(): CurrentQuality | '';
    /** Internal telemetry payload. */
    getMonitorInfo(): MonitorInfo;
    /**
     * Name of the most recent event dispatched through this component
     * (`_eventState`). Note the misspelling — `Occured` — from the bundle.
     */
    getRecentOccuredEvent(): string;
    /**
     * Resolve transport statistics.
     *
     * ⚠️ Returns the global (possibly poly-filled) `Promise` produced by the
     * bundle, so consumers get `PromiseLike`, not a native `Promise`. The base
     * player resolves with `undefined`; the RTS player resolves with real data.
     */
    getStats(): PromiseLike<PlayerStats | undefined>;
    /** Attach a trace id to subsequent telemetry/API calls. */
    setTraceId(traceId: string): void;

    // ---- VOD trial --------------------------------------------------------------

    /** Whether the source is being limited by `playConfig.PreviewTime`. */
    isPreview(): boolean;
    /** Whether `time` is past the trial boundary. */
    exceedPreviewTime(time: number): boolean;
    /** Set the trial length (seconds) at runtime. */
    setPreviewTime(seconds: number): void;
    /** Read the configured trial length (seconds; `undefined` when never set). */
    getPreviewTime(): number | undefined;

    // ---- geometry / transform --------------------------------------------------

    /** Rotate the video via CSS transform, in degrees. */
    setRotate(degrees: number): void;
    /**
     * Current rotation in degrees (`0` when unset).
     *
     * The runtime declares one parameter (`getRotate(e)`) but never reads it,
     * so calling it with or without an argument is equally safe; the argument is
     * ignored.
     */
    getRotate(ignored?: unknown): number;
    /** Current mirror mode — `"vertical"`, `"horizon"`, `""`, or `undefined` when never set. */
    getImage(): string | undefined;
    /** Mirror the video. `"vertical"` ⇒ `scaleY(-1)`, `"horizon"` ⇒ `scaleX(-1)`. */
    setImage(image: 'vertical' | 'horizon' | string): void;
    /** Remove any mirror transform. */
    cancelImage(): void;
    /** Resize the outer container (written straight to `style.width/height`). */
    setPlayerSize(width: string | number, height: string | number): void;

    // ---- poster ----------------------------------------------------------------

    /** Replace the cover image (`#<id> .prism-cover` background) and options value. */
    setCover(url: string): void;

    // ---- text / audio tracks ---------------------------------------------------

    /**
     * Replace subtitle tracks at runtime. De-duplicates by `srclang` and
     * disambiguates repeated labels before dispatching the internal
     * `textTrackFounded` / `ccReset` events.
     */
    setTextTracks(tracks: UserTextTrack[]): void;
    /**
     * Active caption tracks.
     *
     * ⚠️ The concrete object depends on which rendering path is active:
     * - with the internal VTT broker enabled, `lib/vtt/text-track.js` replaces
     *   this method with one returning the player's own `TextTrackList`
     *   (list-like: `length`, numeric indices, `addTrack()`, plus `_trackList`);
     * - otherwise it falls back to the **native** `video.textTracks`
     *   (`dom.TextTrackList`);
     * - when nothing is available it returns a plain empty `[]`.
     *
     * All three share `length` + numeric index access, which is why this union
     * is safe to loop over — but do **not** assume `.list`, `.item()` or array
     * methods are present.
     */
    getTextTracks(): readonly (AliplayerTextTrack | TextTrack)[] | TextTrackList | AliplayerTextTrackList;

    // ---- progress markers ------------------------------------------------------

    /** Replace the progress-bar markers (passing nothing clears them). */
    setProgressMarkers(markers?: ProgressMarker[]): void;
    /** Current markers, from `_progressMarkerService`. */
    getProgressMarkers(): ProgressMarker[];
    /** Mark the playhead as entering a marker dot. */
    enterProgressMarker(): void;
    /** Mark the playhead as leaving a marker dot. */
    exitProgressMarker(): void;
    /** Whether the playhead is currently inside a marker dot. */
    isInProgressMarker(): boolean;

    // ---- snapshot --------------------------------------------------------------

    /**
     * Configure snapshot dimensions/quality.
     * ⚠️ The name is misspelled `setSanpshotProperties` in the bundle.
     * @throws `Error("rate doesn't allow more than 1")` when `rate > 1`.
     */
    setSanpshotProperties(width: number, height: number, rate?: number): void;

    // ---- chrome control --------------------------------------------------------

    /** Re-apply control visibility from `options.useNativeControls` / `options.controls`. */
    setControls(): void;
    /**
     * Look up a custom component registered through the `components` option by
     * its `name`. Delegates to `_lifeCycleManager.getComponent`; returns `null`
     * when no component with that name was created.
     */
    getComponent(name: string): AliplayerComponent | null;
    /** Build a control bar component from an options object. */
    _initControlBar(options: UIComponentOptions): AliplayerComponent;
    /** Show the control bar. @chainable */
    showControlBar?(): this;
    /** Hide the progress bar overlay. */
    hideProgress(): void;
    /** Cancel a pending progress-bar hide. */
    cancelHideProgress(): void;
    /**
     * Attach tooltip behaviour to a control-bar element.
     * `text` may be a function recomputed on each hover.
     */
    registerControlBarTooltip(target: HTMLElement, text: string | ((self: this) => string)): void;

    // ---- lifecycle -------------------------------------------------------------

    /**
     * (Re)start playback for the configured source.
     * @param autoplay whether to autoplay after initialisation
     */
    initPlay(autoplay?: boolean): void;
    /**
     * Instantiate children from `skinLayout`, then fire the internal
     * `uiH5Ready` event that drives every component's `renderUI`/`syncUI`/`bindEvent`.
     */
    initChildren(): void;
    /**
     * Fully dismantle the player: stops the media, unbinds every video/player/
     * private listener, disposes services, clears timers, removes children and
     * empties the container. After this the instance must not be reused (see
     * {@link Aliplayer.reloadInstance}).
     */
    dispose(): void;
    /** Create (or adopt) the `<video>` element and its wrapper. */
    createEl(tag?: string, attributes?: Record<string, unknown>): HTMLElement;
    /** Apply `videoWidth`/`videoHeight`/`preload`/`autoplay`/X5 attributes to the media element. */
    setVideoAttrs(): void;

    // ---- telemetry helpers -----------------------------------------------------

    /** Emit an internal `traceLog` event, prefixed `"[source]message"`. */
    traceLog(source: string, message: string): void;
    /** Send one structured telemetry entry. */
    log(eventName: string, data?: Record<string, unknown>): void;
    /** Send an error telemetry entry (adds `vt` = current time automatically). */
    logError(error?: Record<string, unknown>, retry?: boolean): void;

    // ---- event API -------------------------------------------------------------

    /**
     * Subscribe to a **public** player event with a typed `paramData` payload.
     *
     * ⚠️ Despite mirroring `ui/component`, the player's `on` is intercepted by
     * `reloadInstanceUtil.storeUserEvents`, which **returns `undefined`** so it
     * can record the handler for replay after `reloadInstance`. Do not chain.
     */
    on<K extends PlayerEventName>(name: K, handler: PlayerEventListener<PlayerEventPayloadMap[K]>): void;
    /**
     * Subscribe to a raw event name (native media event, internal/private event,
     * or a custom name you trigger yourself). Payload is unknown.
     */
    on(name: string, handler: PlayerEventListener<unknown>): void;

    /** Subscribe to a list of events at once. */
    on<K extends PlayerEventName>(names: readonly K[], handler: PlayerEventListener<PlayerEventPayloadMap[K]>): void;
    on(names: readonly string[], handler: PlayerEventListener<unknown>): void;

    /**
     * Subscribe to a public event once. Unlike {@link Aliplayer.on}, `one` is not
     * intercepted and **is chainable**.
     */
    one<K extends PlayerEventName>(name: K, handler: PlayerEventListener<PlayerEventPayloadMap[K]>): this;
    one(name: string, handler: PlayerEventListener<unknown>): this;
    one<K extends PlayerEventName>(names: readonly K[], handler: PlayerEventListener<PlayerEventPayloadMap[K]>): this;
    one(names: readonly string[], handler: PlayerEventListener<unknown>): this;

    /** Remove a handler, or every handler for the event when omitted. @chainable */
    off<K extends PlayerEventName>(name: K, handler?: PlayerEventListener<PlayerEventPayloadMap[K]>): this;
    off(name: string, handler?: PlayerEventListener<unknown>): this;
    off<K extends PlayerEventName>(names: readonly K[], handler?: PlayerEventListener<PlayerEventPayloadMap[K]>): this;
    off(names: readonly string[], handler?: PlayerEventListener<unknown>): this;

    /**
     * Remove a handler previously attached to a specific element
     * (mirrors `lib/event.off`, used for custom tooltip/DOM wiring). @chainable
     */
    offListener(target: EventTarget, name: string, handler?: PlayerEventListener<unknown>): this;

    /**
     * Dispatch an event. With a `paramData`, the payload is stashed on the
     * element and surfaced as `event.paramData`; the event name is recorded in
     * `_eventState`. @chainable
     */
    trigger<K extends PlayerEventName>(name: K, paramData?: PlayerEventPayloadMap[K]): this;
    trigger(name: string, paramData?: unknown): this;
    trigger(event: Partial<AliplayerEvent<unknown>> & { type: string }, paramData?: unknown): this;

    // ---- observable instance state --------------------------------------------
    // These are genuine own-properties of the runtime object. Anything prefixed
    // with `_` is internal and may change between minor versions.

    /** The media element (`<video>`, or the container in native-tag mode). */
    tag: HTMLVideoElement;
    /** The root element the skin is rendered into. */
    _el: HTMLElement;
    /** Internal component id: `"<containerId>_component_<uuid>"`. */
    _id: string;
    /** The merged options object actually in use. */
    _options: AliplayerOptions;
    /** Direct child components. */
    _children: AliplayerComponent[];
    /** Child lookup by component id. */
    _childIndex: Record<string, AliplayerComponent | null>;
    /** Registry of built-in skin components available to `addChild(name)`. */
    UI: Record<string, ComponentClass>;
    /** Custom-component lifecycle dispatcher. */
    _lifeCycleManager: LifecycleManager;
    /** Internal telemetry client (present unless the monitor was disposed). */
    _monitor?: Monitor | null;
    /** Quality list for the current source. */
    _urls: UrlItem[];
    /** Index of the active entry in {@link _urls}. */
    _currentPlayIndex: number;
    /** Count of automatic quality fallbacks taken. */
    _retrySwitchUrlCount: number;
    /** Whether more than one quality level is available. */
    isMutiLevel: boolean;
    /** Whether the last failure left the player in an error state. */
    _isError: boolean;
    /** Whether the hls.js plugin path is in use. */
    _isHls: boolean;
    /** Whether a seek is in flight. */
    _seeking: boolean;
    /** Media duration tracked internally (`0` before metadata). */
    _duration: number;
    /** Live retry counter. */
    _liveRetryCount: number;
    /** VOD retry counter. */
    _vodRetryCount: number;
    /** Stall-nudge counter. */
    _nudgeCount: number;
    /** Pending VOD recovery reload time. */
    _waitingReloadTime: number;
    /** Consecutive waiting timeouts. */
    _waitingTimeoutCount: number;
    /** Server request id counter. */
    _serverRequestId: number;
    /** Buffered SEI payloads keyed by presentation timestamp (ms). */
    _seis: Record<string, unknown>;
    /** Initial PTS base used to normalise HLS SEI timestamps. */
    _initPTS: number;
    /** Time-shift seek start anchor. */
    _liveShiftSeekStartTime: number;
    /** Whether `enterProgressMarker()` is currently in effect. */
    _enteredProgressMarker: boolean;
    /** Name of the last dispatched event. */
    _eventState: string;
    /** Whether the media data has been loaded. */
    loaded: boolean;
    /** Whether playback has been requested. */
    played: boolean;
    /** Whether playback has ever successfully started. */
    oncePlayed: boolean;
    /** Whether the player is currently buffering. */
    waiting: boolean;
    /** Set by {@link dispose}. */
    __disposed: boolean;
    /** Whether the player was created (internal `created` lifecycle guard). */
    _created?: boolean;
    /** Last surfaced player status (`_status`). */
    _status?: PlayerStatus;
    /** Native video size, kept up to date during live resolution changes. */
    resolution: { width: number; height: number };
    /** Fullscreen service. */
    fullscreenService: FullscreenService;
    /**
     * Live-shift facade. **Note the misspelling** (`Serivce`) preserved from the
     * bundle; only present when live time-shift is configured.
     */
    liveShiftSerivce?: LiveShiftFacade;
    /** @see {@link LiveShiftService} */
    _liveshiftService?: LiveShiftService;
    /** Subtitle service. */
    _ccService?: SubtitleService;
    /** Audio-track service. */
    _audioTrackService?: AudioTrackService;
    /** Quality service. */
    _qualityService?: QualityService;
    /** Progress-marker service. */
    _progressMarkerService?: ProgressMarkerService;
    /** Thumbnail service. */
    _thumbnailService?: ThumbnailService;
    /** Anti-recording feature instance (created when `preventRecord`). */
    _antiRecord?: { dispose(): void; [key: string]: unknown } | null;
    /** Aspect-ratio adapter instance (created when `ratio`). */
    _ratioAdapter?: { dispose(): void; [key: string]: unknown } | null;
    /** VTT broker driving subtitle rendering. */
    _vttBroker?: {
      parser: unknown;
      activeRenderer: unknown;
      trackConfigs: Record<string, unknown>;
      enabled?: boolean;
      hasUserTracks?: boolean;
      vttText?: string;
      tickTimer?: number;
      [key: string]: unknown;
    };
    /** hls.js instance when the HLS plugin path is active. */
    _hls?: Record<string, any>;
    /** flv.js instance when the FLV plugin path is active. */
    _flv?: Record<string, any>;
    /** RTS (Aliyun RTS SDK) instance for `artc://` sources. */
    _rts?: Record<string, any>;
    /** splayer (H.265/H.266 WASM) instance. */
    _splayer?: Record<string, any> | null;
    /** DRM controller instance for DRM sources. */
    _drm?: Record<string, any>;
    /** Snapshot matrix set through {@link Aliplayer.setSanpshotProperties}. */
    _snapshotMatric?: { width?: number; height?: number; rate?: number };
    /** The wrapped native `video.play`, replaced by `_overrideNativePlay`. */
    _originalPlaybackRate?: number;
    /** Manual-play flag recorded by {@link Aliplayer.play}. */
    _isManualPlay?: boolean;
    /** Manual-pause flag recorded by {@link Aliplayer.pause}. */
    _isManualPause?: boolean;
    /** Codec probe information. */
    _probeInfo?: { codecTag?: string; [key: string]: unknown };
    /** Original source retained for retry logic. */
    _originalSource?: string;
    /** Epoch ms when playback was started by the user. */
    readyTime?: number;
    /**
     * Handler bag recorded by the patched {@link Aliplayer.on} so listeners can
     * survive `reloadInstance`. Keyed by event name.
     */
    __user_events__?: Record<string, PlayerEventListener<unknown>[]>;
  }

  // ===========================================================================
  // 8. Component base class surface
  // ===========================================================================

  /**
   * Members shared by the player and by every UI component, because
   * `base/player.js` extends `ui/component.js`.
   *
   * `options()`, `player()` and `on()` are deliberately **absent** here: their
   * signatures genuinely differ between the player and a plain component
   * (see {@link AliplayerComponent} and {@link Aliplayer}).
   */
  interface ComponentCommon {
    /** Render the component's DOM (called after `uiH5Ready`). */
    renderUI(): void;
    /** Synchronise the DOM with current player state. */
    syncUI(): void;
    /** Attach event listeners. */
    bindEvent(): void;
    /** Create the root element; defaults to a `<div>`. */
    createEl(tag?: string, attributes?: Record<string, unknown>): HTMLElement;
    /** The component's root element. */
    el(): HTMLElement;
    /** Where children are appended (`_contentEl` falling back to `el()`). */
    contentEl(): HTMLElement;
    /** Component id (for the player this is `el().id`). */
    id(): string;
    /** Internal id string (`_id`). */
    getId(): string;
    /** Add a child by registered name, or adopt an existing component instance. */
    addChild(child: BuiltinComponentName | string | AliplayerComponent, options?: UIComponentOptions): AliplayerComponent | undefined;
    removeChild(child: AliplayerComponent): void;
    /** Instantiate `options.children`. */
    initChildren(): void;
    one(name: string, handler: PlayerEventListener<unknown>): this;
    off(name: string, handler?: PlayerEventListener<unknown>): this;
    offListener(target: EventTarget, name: string, handler?: PlayerEventListener<unknown>): this;
    trigger(name: string, paramData?: unknown): this;
    addClass(className: string): this;
    removeClass(className: string): this;
    /** `style.display = "block"`. @chainable */
    show(): this;
    /** `style.display = "none"`. @chainable */
    hide(): this;
    /** Tear the component down, recursing into children. */
    destroy(): void;
    /** Register hover tooltip content for a control-bar element. */
    registerControlBarTooltip(target: HTMLElement, text: string | (() => string)): void;
    /** Optional: release DOM/CSS created by {@link renderUI}. */
    disposeUI?(): void;
  }

  /**
   * Public surface of `ui/component.js`, which `base/player.js` extends.
   * Custom components receive these through {@link ComponentInstance}.
   */
  interface AliplayerComponent extends ComponentCommon {
    /** Read (getter form) or merge-update (setter form) the component options. */
    options(): UIComponentOptions;
    options(patch: Partial<UIComponentOptions>): UIComponentOptions;
    /** The owning player. */
    player(): Aliplayer;
    /** Subscribe; the plain component form is chainable. @chainable */
    on(name: string, handler: PlayerEventListener<unknown>): this;
  }

  /** Options carried by every skin/child component. */
  interface UIComponentOptions {
    name?: string;
    align?: SkinAlign;
    x?: number | string;
    y?: number | string;
    className?: string;
    children?: SkinLayoutItem[] | false;
    [key: string]: unknown;
  }

  /** A constructor produced by {@link Aliplayer.Component} (or an internal class). */
  interface ComponentClass<Instance = AliplayerComponent> {
    prototype: Instance;
    new (player: Aliplayer, options?: UIComponentOptions): Instance;
    /** Subclass further, the same way `Aliplayer.Component` does. */
    extend<Spec extends Record<string, unknown>>(spec?: Spec): ComponentClass<ComponentInstance<Spec>>;
    /** `oo.create`: instantiate without invoking the constructor. */
    create(...args: unknown[]): Instance;
  }

  /**
   * The `this` type inside a {@link Aliplayer.Component} spec object:
   * the component base surface plus everything the spec itself declares.
   */
  type ComponentInstance<Spec> = AliplayerComponent & Omit<Spec, 'init'>;

  /**
   * The methods a component spec may declare. Declared loosely because
   * `Aliplayer.Component` copies every own key of the spec onto the prototype,
   * and lifecycle hooks are named by {@link LifecycleHook}.
   */
  interface UIComponentMethods {
    init?(player: Aliplayer, options: UIComponentOptions): void;
    renderUI?(): void;
    syncUI?(): void;
    bindEvent?(): void;
    createEl?(tag?: string, attributes?: Record<string, unknown>): HTMLElement;
    el?(): HTMLElement;
    contentEl?(): HTMLElement;
    id?(): string;
    getId?(): string;
    options?(patch?: Partial<UIComponentOptions>): UIComponentOptions;
    player?(): Aliplayer;
    addChild?(child: string | AliplayerComponent, options?: UIComponentOptions): AliplayerComponent | undefined;
    removeChild?(child: AliplayerComponent): void;
    initChildren?(): void;
    on?(name: string, handler: PlayerEventListener<unknown>): any;
    one?(name: string, handler: PlayerEventListener<unknown>): any;
    off?(name: string, handler?: PlayerEventListener<unknown>): any;
    trigger?(name: string, paramData?: unknown): any;
    addClass?(className: string): any;
    removeClass?(className: string): any;
    show?(): any;
    hide?(): any;
    destroy?(): void;
    disposeUI?(): void;
    registerControlBarTooltip?(target: HTMLElement, text: string | (() => string)): void;
    /** Custom-component lifecycle hooks (see `plugin/lifecycle`). */
    created?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    ready?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    loading?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    play?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    pause?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    playing?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    waiting?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    timeupdate?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    error?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    ended?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    dispose?(player?: Aliplayer): void;
    markerDotOver?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    markerDotOut?(player: Aliplayer, event: AliplayerEvent<unknown>): void;
    [key: string]: unknown;
  }

  // ===========================================================================
  // 9. `Aliplayer.util`
  // ===========================================================================

  /**
   * What `lib/componentutil.register` actually hangs on the constructor:
   * a single `stopPropagation` helper. The rest of `lib/*` (dom, event, url,
   * object, ua, io …) is **not** exposed.
   */
  interface AliplayerUtil {
    /** Cancel bubbling cross-browser (`window.event.cancelBubble` or `stopPropagation`). */
    stopPropagation(event: Event | AliplayerEvent<unknown>): void;
  }
}

// =============================================================================
// Ambient global — the UMD wrapper assigns the factory to `window.Aliplayer`
// (falling back to `global`/`self`/`this` in non-browser contexts).
// =============================================================================

declare global {
  interface Window {
    /** UMD global assigned by `aliplayer-min.js`. */
    Aliplayer: Aliplayer;
  }
  interface HTMLVideoElement {
    /**
     * The player back-reference the bundle sets on the media element
     * (`videoElement.player = this` inside `base/player.createEl`).
     */
    player?: Aliplayer.Aliplayer;
  }
}
