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
                       var numOfResults = result.length;
                       var itineraries = result[0].itineraries;
                       var finalResult = ""
                        console.log(result);
                       for (var i = 0; i < numOfResults; i++){
                               var itinerary = itineraries[0];
                               console.log(itinerary);
                               var outbound = itinerary.outbound.flights;
                               var outBoundString = "";
                               var inbound = itinerary.inbound.flights;
                               var inBoundString = "";
                               var numOfOutBound = outbound.length;
                               console.log(outbound);
                               var numOfInBound = inbound.length;
                               for(var j = 0; j < numOfOutBound; j++){
                                       var flight = outbound[j];
                                       var result = "departs " + flight.origin.airport + "at " + flight.departs_at + "and arrives" + flight.destination.airport + "at " + flight.arrives_at;
                                       outBoundString += result;
                               }
                               for(var j = 0; j < numOfInBound; j++){
                                       var flight = inbound[j];
                                       var result = "departs " + flight.origin.airport + "at " + flight.departs_at + "and arrives" + flight.destination.airport + "at " + flight.arrives_at;
                                       inBoundString += result;
                               }
                               finalResult += "outBound: "+ outBoundString;
                               finalResult += "inBound: "+ inBoundString;
                       }
                       res.send(finalResult);
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
