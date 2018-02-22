/*
 * youtubeを読み込み、(1)現在位置取得、(2)指定の位置まで飛ぶ 機能の確認
 * iphone, macで動作確認済み
 */
var onYouTubeIframeAPIReady = null;

function loadYoutube(videoId) {
  console.log('loading youtube', videoId)
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  onYouTubeIframeAPIReady = function () {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    console.log(event, player.getCurrentTime())
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;

      setInterval(function() {
        player.seekTo(1, true);
      }, 2000);
    }
  }
  function stopVideo() {
    player.stopVideo();
  }

  return player
}
