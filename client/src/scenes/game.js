import io from 'socket.io-client';
import WhitePiece from "../helpers/whitePiece"
import BlackPiece from "../helpers/blackPiece"



// need to add color functionality 
export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'SceneGame'
        });
    }

    init(data) {
        this.socket = data.socket;
        this.color = data.color; // true = isPlayerA
        this.turn = data.color 
    }

    preload() {
        this.load.image('whitePawn', 'src/assets/whitePawn.png');
        this.load.image('blackPawn', 'src/assets/blackPawn.png');
    }


    create() {
        this.whitePieces = this.add.group();
        this.blackPieces = this.add.group(); 
        this.board = this.createBoard(); 
        this.ghosts = [] 
        console.log(this.board)
        // this.movePiece(4, 3, this.board[7][1])
        if (this.turn) {
            this.setInteractiveness(); 
        } else {
            this.disableInteractiveness(); 
        }

        let self = this; 
        
        this.socket.on('change', function (color, vh, nvh) {
            if (color != self.color) {
                console.log('changing turns!', vh[0], vh[1], nvh[0], nvh[1])
                self.opponentMove(vh, nvh)
                this.turn = true; 
                self.setInteractiveness(); 
            }
            
        })

        this.socket.on('destroy', function (color, v, h) {
            console.log('DESTROY!')
            if (color != self.color) {
                self.selfDestroy(v, h)
            }
        })

    }

    update() {

    }

    createBoard() {
        this.board = []; 

        for (let i = 0; i < 8; i += 1) {
            this.board.push([0, 0, 0, 0, 0, 0, 0, 0]);
        }

        let colors = [0xFFFFFF, 0xB75555]
        for (let i = 0; i < 8; i ++) {
            let index = i % 2
            let row = [] 
            for (let j = 0; j < 8; j++) {
               let color = colors[index]
               
               row.push(this.add.rectangle(50+i*100, 50+j*100, 100, 100, color))
               index = Math.abs(index - 1)
            }
       }
        // TO FILL IN - add Pieces 
       for (let i = 0; i < 8; i += 1) {
           // board[h][v]
           this.board[0][i] = this.createPiece(0, i, true)
           this.board[7][i] = this.createPiece(7, i, false)
       }

       this.textConfig = {
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '25px',
        lineHeight: 1.3,
        align: 'center',
      };

      let p1 = this.color ? ' (You)' : ''
      let p2 = this.color ? '' : ' (You)'
      this.textPlayer1 = this.add.text(
        850,
        200,
        'Player 1 - White' + p1,
        this.textConfig,
      );

      this.textPlayer2 = this.add.text(
          850, 
          600, 
          'Player 2 - Black' + p2, 
          this.textConfig
      ) 

        this.textTurn = this.add.text(850, 400, 'GAME STARTING', this.textConfig)

        console.log(this.whitePieces, this.blackPieces)
        return this.board; 
    }

    setTurnText(color) {
        // if white (player1)
        console.log('setting Turn Text', color)
        let text = color ? 'YOUR TURN' : "OPPONENT'S TURN"
        if (this.textTurn) {
            this.textTurn.destroy() 

        }
        this.textTurn = this.add.text(850, 400, text, this.textConfig)
    }

    movePiece(move, piece) {
        let nh = move[0]
        let nv = move[1]
        let attack = move[2]

        let v = piece.getData('boardV')
        const h = piece.getData('boardH')
        this.board[v][h] = 0; 
        this.board[nv][nh] = piece

        console.log('edited, piece moving:',this.board)

        piece.updatePosition(nv, nh)

        this.ghosts.forEach((ghost) => {
            ghost.destroy()
        })
        this.ghosts = [] 

        if (attack) {
            let av = nv - v > 0 ? nv - v - 1 : nv - v + 1
            let ah = nh - h > 0 ? nh - h - 1 : nh - h + 1
            console.log('v', v, 'nv', nv, 'h', h, 'nh', nh, 'av, ah', av, ah)
            let victim = this.board[av+v][ah+h]
            victim.destroy() 
            if (this.whitePieces.children.size == 0 || this.blackPieces.children.size == 0) {
                console.log('game over')
            }
            this.socket.emit('destroy', this.color, av+v, ah+h)
        } 
        this.disableInteractiveness() 
        this.turn = false 
        this.socket.emit('change', this.color, [v, h], [nv, nh])


    }

    selfDestroy(v, h) {
        console.log('in the self destroy', this.board[v][h])
        let piece = this.board[v][h]
        piece.destroy() 

        if (this.whitePieces.children.size == 0 || this.blackPieces.children.size == 0) {
            console.log('game over')
        }
        
        this.board[v][h] = 0 
    }

    opponentMove(vh, nvh) {
        // board[v][h] 
        let v = vh[0]
        let h = vh[1]
        let nv = nvh[0]
        let nh = nvh[1]
        const piece = this.board[v][h]
        this.board[v][h] = 0
        this.board[nv][nh] = piece 
        piece.updatePosition(nv, nh)

        console.log(piece)

    }


    createPiece(v, h, color) {
        if (color) {
            this.piece = new WhitePiece(
                this, 
                50+h*100, 
                50+v*100, 
                'whitePiece'
            )
        } else {
            this.piece = new BlackPiece(
                this, 
                50+h*100, 
                50+v*100, 
                'blackPiece'
            )
        }
        this.piece.setScale(0.15)
        this.piece.updatePosition(v, h)

        color ? this.whitePieces.add(this.piece) : this.blackPieces.add(this.piece)
        return this.piece; 
    }

    disableInteractiveness() {
        console.log('disabling Interactiveness')
        this.setTurnText(false)
        this.group = this.color ? this.whitePieces : this.blackPieces 
        this.group.getChildren().forEach((piece) => {
            piece.disableInteractive(); 
        })
    }

    setInteractiveness() {
        console.log('setting Interactiveness')
        this.group = this.color ? this.whitePieces : this.blackPieces // CHANGE LATER 
        this.setTurnText(true)
        this.ghostColor = this.color ? 'whitePawn' : 'blackPawn' // CHANGE LATER 
        this.group.getChildren().forEach((piece) => {
            console.log(piece.possibleMoves(false))
            if (piece.possibleMoves(false).length > 0) {
                piece.setInteractive(); 

                piece.on('pointerover', () => {
                    piece.setScale(0.17);
                });
          
                piece.on('pointerout', () => {
                    piece.setScale(0.15);
                })

                piece.on('pointerup', () => {
                    console.log('pointerup')
                    let pm = piece.possibleMoves(true) 
                    console.log('pm', pm)
                    // deleteGhosts thing
                    for (let i = 0; i < pm.length; i += 1) {
                        const ghost = this.add.image(50+pm[i][0]*100, 50+pm[i][1]*100, this.ghostColor).setScale(0.15).setAlpha(0.5)
                        ghost.setInteractive(); 

                        ghost.on('pointerup', () => {
                            this.movePiece(pm[i], piece)
                        })
                        this.ghosts.push(ghost)
                    }
                })


            }
        })
        
    }
}
