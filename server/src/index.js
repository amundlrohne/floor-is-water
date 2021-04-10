const app = require("express")();
const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);

io.on("connection", socket => { /* ... */ });

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});


httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});;