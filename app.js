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



//get uber product
app.get('/uber', function(req,res){
request('https://api.uber.com/v1/products?latitude=37.7759792&longitude=-122.41823&server_token=YliT_3eRG-sh1mttNF97FGbqWnEXu4HuyCIWiQnB', 
       function(error,response,body){
               if (!error && response.statusCode == 200) {
                       var result = JSON.parse(body).products;
                       var product_id=result[0].product_id;
                       res.send(product_id);
               }
       });
});

// ian     help me 
// //get request id
// app.get('/uberRequestId', function(req,res){
// request.post('https://api.uber.com/v1/requests/start_latitude=37.334381&start_longitude=-121.89432&end_latitude=37.77703&end_longitude=-122.419571&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&server_token=YliT_3eRG-sh1mttNF97FGbqWnEXu4HuyCIWiQnB', 
//        function(error,response,body){
//                if (!error && response.statusCode == 200) {
//                       console.log(response);
//                        // var result = JSON.parse(body).products;
//                        res.send(response);
//                }
//        });
// });

//request uber 
// app.get('/requestUber', function(req,res){
// request('https://api.uber.com/v1/requests/852b8fdd-4369-4659-9628-e122662ad257&server_token=YliT_3eRG-sh1mttNF97FGbqWnEXu4HuyCIWiQnB', 
//        function(error,response,body){
//                if (!error && response.statusCode == 200) {
//                       //console.log(response);
//                        // var result = JSON.parse(body).products;
//                        res.send(response);
//                }
//        });
// });



