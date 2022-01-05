import Phaser from 'phaser';
import io from 'socket.io-client';


class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  create() {
    // eslint-disable-next-line no-undef
    this.color = false; // FOR LATER 
    let self = this 
    this.socket = io('http://localhost:3000');
    this.initialized = false; 

    this.socket.on('connect', function () {
        console.log('Connected!');
    });    
    

    // this.socket.on('isPlayerA', function () {
    //   self.color = true;
    //   console.log('isPlayerA', self)
    // })

    
    this.socket.on('starting', function (id) {
      self.initialized = true
      if (self.socket.id == id) {
        self.color = true 
        console.log(self)
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

    this.socket.on('startGame', () => {
      this.scene.start('SceneGame', { socket: this.socket, color: this.color });
    })

    // this.socket.on('newplayer', (sckt) => {
    //   console.log(sckt);
    // });

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
    this.startGame.on('pointerup', () => {
      if (!this.initialized) {
        console.log('starting game')
        this.socket.emit('startingGame')
      } else {
        this.socket.emit('playerJoined')
      }
      
      
    });

  }
}

export default SceneMainMenu;
