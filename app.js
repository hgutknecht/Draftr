'use strict';

var http = require('http')
  , sockjs = require('sockjs')
  , express = require('express')
  , app = express()
  , _ = require('underscore');

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
	res.render('index',
	  { title : 'Draftr!' }
	)
});

var echo = sockjs.createServer();

var clients = {}

echo.on('connection', function(conn) {
  clients[conn.id] = conn

  conn.on('data', function(message) {
    var msg = JSON.parse(message)
    send(msg, conn)
  });

  conn.on('close', function() {
    delete clients[conn.id]
  });
});

function send(msg, conn) {
  var str = JSON.stringify(msg)
  
  for (var id in clients) {
    // if (conn && id === conn.id) {
    //   continue
    // }
    clients[id].write(str)
  }
}

var server = http.createServer(app);

echo.installHandlers(server, {prefix: '/echo'})

server.listen(3000, '0.0.0.0');

console.log('Express server started.');
