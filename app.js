'use strict';

var http = require('http')
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

app.listen(3000);

console.log('Express server started.');
