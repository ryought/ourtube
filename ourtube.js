/*
 * データの送受信をできるか？のテスト
 */
var webrtc = new SimpleWebRTC({
  localVideoEl: '',
  remoteVideosEl: '',
  autoRequestMedia: false,
  receiveMedia: {
    offerToReceiveAudio: false,
    offerToReceiveVideo: false
  }
});

// div
var create = document.getElementById('create')
var roomUrl = document.getElementById('roomUrl')
var send = document.getElementById('send')

// 接続開始時
webrtc.on('createdPeer', function (peer) {
  console.log('created peer', peer, webrtc.getDomId(peer), peer.id);

  if (peer && peer.pc) {
    peer.pc.on('iceConnectionStateChange', function (event) {
      console.log('state changed: ', peer.id, peer.pc.iceConnectionState);
    })
  }

  // 送信処理
  // https://stackoverflow.com/questions/37891029/usage-example-of-senddirectlytoall-of-simplewebrtc
  send.addEventListener('click', function () {
    webrtc.sendDirectlyToAll('chat', 'message', {'seek': '873'})
  })
})

// メッセージ受信処理
webrtc.on('channelMessage', function (peer, label, data) {
  console.log('received', peer, label, data)
  if (label === 'chat') {
    console.log('seek to', data.payload.seek)
  }
})

// エラーハンドル
webrtc.on('iceFailed', (peer) => {
  console.log('local fail', peer)
})

webrtc.on('connectivityError', (peer) => {
  console.log('connect error', peer)
})


// 最初の初期化処理
function init () {
  // roomはurlから取得
  // room idはリンクにくっついてる
  var room = location.search && location.search.split('?')[1]

  if (room) {
    // 既存のroomに入る
    webrtc.joinRoom(room, function (err, res) {
      console.log('joined', room, err, res)
      var player = loadYoutube('M7lc1UVf-VE')
    });
  } else {
    // 新規room作成
    var val = '';  // 名前で指定があればこれを使える
    create.addEventListener('click', function () {
      webrtc.createRoom(val, function (err, name) {
        if (!err) {
          // 履歴を残さずに新しいurlに飛ぶ
          var newUrl = location.pathname + '?' + name
          history.replaceState(null, null, newUrl)
          console.log('created', name, 'share', location.href)
        }
      })
    }, false);
  }
}

init()

// loadYoutube()
