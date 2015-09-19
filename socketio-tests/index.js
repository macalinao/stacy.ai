var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/marie', function(req,res){
    res.send('marie');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', "abhy: "+msg);
    console.log('message'+ msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
