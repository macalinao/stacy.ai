var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

          

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/marie', function(req,res){
request('http://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=IST&destination=BOS&departure_date=2015-10-15&return_date=2015-10-21&number_of_results=3&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO', 
       function(error,response,body){
               if (!error && response.statusCode == 200) {
                       var result = JSON.parse(body).results;
                       var itineraries = result[0].itineraries[0];
                       var outbound = itineraries.outbound;
                       var outbound_flight_1 = outbound.flights[0];
                       var outbound_flight_2 = outbound.flights[1];
                       
                       var inbound = itineraries.inbound; 
                       res.send(outbound_flight_2);
               }
       });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', "user_name: "+msg);
    
    console.log('message'+ msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
