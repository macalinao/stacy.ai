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

