var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/asd', function(req, res){
  res.sendFile(__dirname + '/spr.PNG');
});

var users = {}; 
io.on('connection', function(client){
	/*socket.on('button clicked', function(val){
		//io.emit('button clicked', val);
	});*/
	client.emit('users base', users);
	client.emit('user connected', client.id);
	client.on('user done', function(coordx, coordy){
		users[client.id] = {
			x: coordx,
			y: coordy
		}
		client.broadcast.emit('user done', coordx, coordy, client.id)
	});

	client.emit('moving', client.id);
	client.on('moving done', function(coordx, coordy){
		users[client.id] = {
			x: coordx,
			y: coordy
		}
		client.broadcast.emit('user done', coordx, coordy, client.id)
	});
	
	client.on('disconnect', function(){
		client.broadcast.emit('user disconnected', client.id);
		delete users[client.id];
	});

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});