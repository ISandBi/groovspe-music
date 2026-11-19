import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useApp } from '../store';

// Reproductor de YouTube compartido (audio + video). Vive en la raíz de la app para no cortarse al navegar.
// Si el modo es "video" y el reproductor está abierto, se coloca sobre la carátula; si no, queda oculto sonando.
const HTML = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}#p{width:100%;height:100%}</style></head>
<body><div id="p"></div><script>
var player,ready=false,pending=null;
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
var tag=document.createElement('script');tag.src='https://www.youtube.com/iframe_api';document.head.appendChild(tag);
function onYouTubeIframeAPIReady(){
  player=new YT.Player('p',{width:'100%',height:'100%',playerVars:{playsinline:1,controls:0,rel:0,modestbranding:1,fs:0,disablekb:1,iv_load_policy:3},
    events:{
      onReady:function(){ready=true;post({t:'ready'});if(pending){player.loadVideoById(pending);pending=null}},
      onStateChange:function(e){post({t:'state',s:e.data})},
      onError:function(e){post({t:'error',c:e.data})}
    }});
}
window.load=function(id){if(ready){player.loadVideoById(id)}else{pending=id}};
window.cmd=function(c,v){if(!ready)return;if(c==='play')player.playVideo();if(c==='pause')player.pauseVideo();if(c==='seek')player.seekTo(v,true)};
setInterval(function(){if(ready&&player.getCurrentTime){post({t:'time',c:player.getCurrentTime(),d:player.getDuration()})}},500);
</script></body></html>`;

export default function YouTubeEngine() {
  const { ytRef, ytId, onYtMessage, videoRect, videoMode } = useApp();

  // Cargar el video cuando cambia la canción (el HTML encola si el API aún no está listo).
  useEffect(() => {
    if (ytId && ytRef.current) ytRef.current.injectJavaScript(`window.load(${JSON.stringify(ytId)});true;`);
  }, [ytId]); // eslint-disable-line

  const visible = videoMode && !!videoRect;
  const box = useMemo(() => (visible
    ? { left: videoRect.x, top: videoRect.y, width: videoRect.w, height: videoRect.h, borderRadius: 14, opacity: 1 }
    : { left: 0, bottom: 0, width: 4, height: 4, opacity: 0.01 }), [visible, videoRect]);

  return (
    <View pointerEvents={visible ? 'none' : 'none'} style={[s.box, box]}>
      <WebView
        ref={ytRef}
        source={{ html: HTML, baseUrl: 'https://www.youtube.com' }}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onMessage={onYtMessage}
        style={{ backgroundColor: '#000' }}
        scrollEnabled={false}
      />
    </View>
  );
}
const s = StyleSheet.create({ box: { position: 'absolute', overflow: 'hidden', backgroundColor: '#000', zIndex: 40 } });
