import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(express.static(`${__dirname}/public/`));
app.use(`/assets`, express.static(`${__dirname}/assets/`));

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    // process the message
    console.log(`> ${msg}`);
    setTimeout(() => {
      socket.emit('msg', 'Cool!');
    }, 500);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
