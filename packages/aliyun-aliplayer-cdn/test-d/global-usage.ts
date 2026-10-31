// ============================================================================
// Script-mode (no import) consumption — this file must contain no import or
// export statement so the UMD global is legal to reference directly, which is
// exactly how a CDN `<script>`-loaded page uses the library.
// Checked with tsconfig.global.json (module: none).
// ============================================================================

/* eslint-disable no-var */

var player = new Aliplayer({
  id: 'player',
  source: 'https://example.com/a.m3u8',
  isLive: true,
  width: '100%',
  height: '100%',
});

player.on(Aliplayer.EventType.Ready, function () {
  player.play();
});

player.on('error', function (event) {
  var code: number = event.paramData.error_code;
  if (code === 4016) {
    player.pause();
  }
});

// window.Aliplayer is the same static shape.
var viaWindow = window.Aliplayer;
var version: string = viaWindow.getVersion();
void version;

// util / Component / players / reloadInstance are all reachable globally.
viaWindow.util.stopPropagation(new MouseEvent('click'));
var registry: Record<string, Aliplayer.Aliplayer> = viaWindow.players;
void registry;

var Divider = Aliplayer.Component<{ name: string }>({ name: 'divider' });
var div = new Divider(player, { name: 'divider' });
var dividerName: string = div.name;
void dividerName;

void player;
