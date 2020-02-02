const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require('http');
const cors = require('cors');
const { setupWebSocket } = require('./websocket');


const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://marcomendanha:marcoamanda@cluster0-fa1vs.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);