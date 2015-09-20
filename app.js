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
    let aiExec = ai(session, msg);
    if (aiExec.prefix) socket.emit('msg', {
      msg: aiExec.prefix
    });
    const res = await aiExec.executor;
    socket.emit('msg', res);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// app.get('/capitalOne', function(req,res){
// request('http://api.reimaginebanking.com/customers/55e94a6af8d8770528e60dcb/accounts?key=b59522ad17e95f44a3c01c23112951b3
// ',
//        function(error,response,body){
//                if (!error && response.statusCode == 200) {
//                        //var result = JSON.parse(body).results;
//                        //var address=result[0].geometry.location;
//                        res.send(response);
//                }
//        });
// });