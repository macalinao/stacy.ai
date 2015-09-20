import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import request from 'request';

import ai from './lib/ai';

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(express.static(`${__dirname}/public/`));
app.use(`/assets`, express.static(`${__dirname}/assets/`));

io.on('connection', (socket) => {
  socket.on('msg', async (msg) => {
    // process the message
    console.log(`[MSG] ${msg}`);
    socket.emit('msg', await ai(msg));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



//getting info out of json stuff -by marie
//didnt know where to put but here it is.
app.get('/marie', function(req,res){
request('http://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?origin=IST&destination=BOS&departure_date=2015-10-15&return_date=2015-10-21&number_of_results=3&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO', 
       function(error,response,body){
               if (!error && response.statusCode == 200) {
                       var result = JSON.parse(body).results;
                       var numOfResults = result.length;
                       var itineraries = result[0].itineraries;
                       var finalResult = ""
                       for (var i = 0; i < numOfResults; i++){
                               var itinerary = itineraries[0];
                               var outbound = itinerary.outbound.flights;
                               var outBoundString = "";
                               var inbound = itinerary.inbound.flights;
                               var inBoundString = "";
                               var numOfOutBound = outbound.length;
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

//get lat long
app.get('/google', function(req,res){
request('http://maps.googleapis.com/maps/api/geocode/json?address=Bangalore&sensor=false',
       function(error,response,body){
               if (!error && response.statusCode == 200) {
                       var result = JSON.parse(body).results;
                       var address=result[0].geometry.location;
                       res.send(address);
               }
       });
});


// //get airport code
// app.get('/airport', function(req,res){
// request('http://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?latitude=54.9501&longitude=-7.7373&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO', 
//        function(error,response,body){
//                if (!error && response.statusCode == 200) {
//                        var result = JSON.parse(body).results;
         
//                        res.send(result);
//                }
//        });
// });

