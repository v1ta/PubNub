// Depecencies
var express = require('express'),
    bodyparser = require('body-parser'),
    path = require('path');

// Global
var app = express();
var streamData = require('./src/twitter.js');

// Pubnub setup
var pubnub = require("pubnub")({
    ssl           : false,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-a8de46c1-8872-451a-b4d0-1a80a875f37b",
    subscribe_key : "sub-c-ae145106-fc3e-11e5-b552-02ee2ddab7fe"
});

// Get trends & publish channels
streamData().then(loadPage, console.error);

// Serve static content & start server
function loadPage(data) {
    console.log('channels avail: ',data);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // Middleware
    app.use(express.static(path.join(__dirname, 'views')));
    app.use(bodyparser.urlencoded({
        extended: true
    }));
    app.get('/', (req, res) => {
        res.render("index")
    })

    var io = require('socket.io').listen(app.listen(3000, () => {
        console.log('Starting pubnub streaming');
    }));

    io.sockets.on('connection', (socket) => {
        socket.emit('message', data);
        socket.on('send', (data) => {
            io.sockets.emits('message', data);
        });
    });
}
