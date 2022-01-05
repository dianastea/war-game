const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
let boards = [] 

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);
    console.log('players', players)
    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    }; 

    if (players.length === 2) {
        io.emit('isPlayerB'); 
    }

    socket.on('change', function (color, vh, nvh) {
        io.emit('change', color, vh, nvh);
    });

    socket.on('destroy', function (color, v, h) {
        io.emit('destroy', color, v, h)
    })

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });

    socket.on('startingGame', function() {
        console.log('starting game')
        io.emit('starting', socket.id)
    })

    socket.on('playerJoined', () => {
        console.log('player joined')
        io.emit('startGame')
    })
    

});

http.listen(3000, function () {
    console.log('Server started!');
});