<html>
<head>
<link rel="stylesheet" href="libs/jquery-ui.css">
<link rel="stylesheet" href="libs/font-awesome.css">
<style>
body {
  margin: 20px;
}

button {
  padding: 10px;
}

textarea {
  width: 500px;
  height: 150px;
}
</style>
<script src="libs/jquery-3.1.1.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="ws.widget.js"></script>
<script src="padlock.widget.js"></script>
<script>
$(function() {
  /// instance of websocket widget
  var ws = $.o2.websocket({
    // pass url of websocket server
    url: 'wss://pcald03.cern.ch',
    // token, cernid, name and username are provided by CERN SSO
    token: '{{token}}',
    id: {{personid}},
    name: '{{name}}',
    username: '{{username}}'
  }, $('#ws') );

  var padlock = $.o2.padlock({
    temp: 'dupa'
  }, $('#padlock') );

  $('#ws').bind('websocketlock-get', function(evt, data) { if (data.success) padlock.lock() });
  $('#ws').bind('websocketlock-release', function(evt, data) { if (data.success) padlock.unlock() });
 
  /// button listener - sends commands to server
  $('button').on('click', function() {
    ws.send({command : this.id, value: Math.random()*100});
  });

  $('#ws').bind('websocketopen', function() {
    ws.send({command: 'lock-check'});
  });
  $('#ws').bind('websocketclose', function() {
    console.log('connection closed');
  });
});
</script>
</head>
<body>
<h3>Commands</h3>
<button id="lock-get" class="ui-button ui-corner-all ui-widget">Lock</button>
<button id="lock-release" class="ui-button ui-corner-all ui-widget">Unlock</button>
<button id="lock-check" class="ui-button ui-corner-all ui-widget">Check lock</button>
<button id="test-zeromq" class="ui-button ui-corner-all ui-widget">Send random value</button>
<br><br>
<h3>Lock icon</h3>
<span id="padlock" class="fa fa-2x"></span>
<br><br>
<h3>Messages arrived</h3>
<textarea id="messages" class="ui-widget ui-state-default ui-corner-all"></textarea>
<br><br>
<h3>Console log</h3>
<textarea id="console" class="ui-widget ui-state-default ui-corner-all"></textarea>
<div id="ws"></div>
</body>
</html>

