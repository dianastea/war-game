# phaser-pawn-game

##### Chess, but only played with pawns. 
##### Developed with Phaser3 and Node.js. 
##### This game is based on the following source code: 
  
  ##### https://github.com/phalado/Checkers-Online/ 
  ##### https://github.com/sominator/multiplayer-card-project 

Huge thanks to @phalado and @sominator for these great introductions to using Phaser! 

# How to use 
#### git clone https://github.com/dianastea/phaser-pawn-game
#### cd phaser-pawn-game 
#### npm i
#### npm start

#### cd client
#### npm i 
#### npm start

### Folders/Files of interest 
1. server.js 
In client/src . . .
2. scenes/game.js ***
3. scenes/menu.js <-- game starts here, then moves to game.js 
4. helpers/piece.js, blackPiece.js, and whitePiece.js 

#### Other Notes 
1. SceneMainMenu appears first because of the order of Scenes in index.js 
2. I have not yet used any of the physics part of index.js 

![chess-y-y (1)](https://user-images.githubusercontent.com/46017623/148305817-ff75da16-c2d4-4328-b8f1-e93fa3bd8e09.gif)
