import Phaser from 'phaser';
import io from 'socket.io-client';
import Board from '../helpers/board';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  create() {
    // eslint-disable-next-line no-undef
    this.color = false; // this.color ? player is white : player is black 
    this.gameRequested = false; // refers to whether a player has requested to start the game 

    // SETS START GAME TEXT
    this.startGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.2,
      'Start a new game', {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );
    this.startGame.setInteractive();

    this.socket = io('http://localhost:3000'); 
    let self = this // because after the "this.socket.on" methods, "this" starts to refer to the *socket* 

    this.socket.on('connect', function () {
        console.log('Connected!');
    });    

    this.startGame.on('pointerup', () => {
      if (!this.gameRequested) {
        // This is the first player to request the game 
        this.socket.emit('startingGame')
      } else {
        // This is the second player requesting a game 
        let perlinBoard = new Board(16, 16).getBoard(); 
        console.log('the board', perlinBoard)
        this.socket.emit('playerJoined', perlinBoard)
      }
      
    });
    
    // response to a player requesting to start the game 
    this.socket.on('starting', function (id) { 
      self.gameRequested = true 
      if (self.socket.id == id) { // for the player who requested to start. . . 
        self.color = true // sets this player to be Player 1 (White)
        
        // add new text to show "Waiting for Opponent"
        self.startGame.destroy() 
        self.startGame = self.add.text(
          self.game.config.width * 0.2,
          self.game.config.height * 0.2,
          'Waiting for opponent', {
            color: '#d0c600',
            fontFamily: 'sans-serif',
            fontSize: '30px',
            lineHeight: 1.3,
            align: 'center',
          },
        );
      }
      
      
    })

    // officially starts the game for both players 
    this.socket.on('startGame', function (perlinBoard) {
      console.log('board', perlinBoard)
      self.scene.start('SceneGame', { socket: self.socket, color: self.color, perlinBoard: perlinBoard });
    })


  }
}

export default SceneMainMenu;
