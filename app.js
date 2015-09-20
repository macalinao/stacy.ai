import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import request from 'request';
import ai from './lib/ai';

const app = express();
const server = http.Server(app);
const io = socketIo(server);
const redisStore = connectRedis(express);
const sessionStore = new redisStore();
const cookieParser = express.cookieParser('ian');

app.use(express.static(`${__dirname}/public/`));
app.use(`/assets`, express.static(`${__dirname}/assets/`));

io.on('connection', (socket) => {
  let session = {};
  socket.on('msg', async (msg) => {
    // process the message
    console.log(`[MSG] ${msg}`);
    socket.emit('msg', await ai(session, msg));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//get lat long
app.get('/google', function(req,res){
request('http://maps.googleapis.com/maps/api/geocode/json?address=Bangalore&sensor=false',
       function(error,response,body){
               if (!error && response.statusCode == 200) {
                       var result = JSON.parse(body).results;
                       var address=result[0].geometry.location;//this is an object with lat, lng
                       res.send(address);
               }
       });
});

//hotel code//
function hotelNameAndPrice(checkin, checkout, langtitude, longtitude){//date must be in form yyyy-mm-dd
    var url = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude="+langtitude+"&longitude="+longtitude+"&radius=50&check_in="+checkin+"&check_out="+checkout+"&chain=RT¤cy=EUR&number_of_results=50&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO";
    request(url, function(error,response,body){
            if(!error && response.statusCode == 200) {
                    var results = JSON>parse(body).results[0];
                    var property_name = results.property_name; //name of hotel;
                    var lat = results.location.latitude; //lat
                    var lng = results.location.longitude; //lng
                    var price = results.total_price.amount;
                    return {name: property_name, lat: lat, lng: lng, price: price};
             }
    }
}






//get airport code
app.get('/airport', function(req,res){
request('http://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO&latitude=46.6734&longitude=-71.7412', 
       function(error,response,body){
               if (!error && response.statusCode == 200) {
               		   console.log(response);
                       var result = JSON.parse(body)[0].airport;
         
                       res.send(result);
               }
       });
});

