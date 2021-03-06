const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
let boards = [] 

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    console.log('players', players)
    players.push(socket.id);

    /* CHANGING TURNS 
    * Current player emits signal to server -> opponent accepts signal and starts it's turn 
    */
    socket.on('change', (color, vh, nvh, dropped) => {
        io.emit('change', color, vh, nvh, dropped);
    });

    socket.on('potionIncrease', (color, potionIncrease) => {
        io.emit('potionIncrease', color, potionIncrease); 
    });

    /* OPPONENT PIECE IS KILLED 
        * Request emitted from current player -> server -> back to both sockets
        * enemy socket takes request and removes the destroyed piece from the board */
    socket.on('damage', (color, v, h, dmg) => {
        io.emit('damage', color, v, h, dmg)
    });

    socket.on('destroy', (color, v, h) => {
        io.emit('destroy', color, v, h)
    });
    
    socket.on('setVisible', (row, col) => {
        io.emit('setVisible', row, col)
    });

    socket.on('win', (color) => {
        console.log("Winning Condition Met");
        io.emit('win', color);
    });

    /* PLAYER DISCONNECTS (refreshing or closing tab) */
    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });

    /* FIRST PLAYER HITS 'START GAME' */
    socket.on('startingGame', () => {
        console.log('starting game')
        io.emit('starting', socket.id)
    });

    /* SECOND PLAYER HITS 'START GAME' */
    socket.on('playerJoined', function (perlinBoard) {
        console.log('player joined')
        io.emit('startGame', perlinBoard)
    });
});

http.listen(3000, () => {
    console.log('Server started!');
});
