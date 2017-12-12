var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.username = "unknown";

    socket.on('join', function (username) {
        console.log(socket.username + ': now known as [' + username + ']');

        socket.username = username;

        socket.broadcast.emit('join', username);
    })

    .on('message', function(message) {
        const username = socket.username;

        console.log(username + ': said ' + message);
        
        socket.broadcast.emit('message', {username: username, message: message});
    })

    .on('disconnect', function() {
        console.log(socket.username + ': left the chat');
        
        socket.broadcast.emit('left', socket.username);
    })
})

server.listen(8080);
