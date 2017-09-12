var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var log4js = require('log4js');
var logger = log4js.getLogger();

var port = 3000;

logger.debug('Script has been started...');

server.listen(port);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.on('ifDrag', function(flag){
        socket.broadcast.emit('eventDrag', flag);
    });

    socket.on('message', function(message){
        io.sockets.emit('messageToClients', message.left, message.top);
    });
});
