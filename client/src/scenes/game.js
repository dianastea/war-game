import Soldier from '../helpers/pieces/soldier';
import Scout from '../helpers/pieces/scout';


// need to add color functionality 
export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'SceneGame'
        });
    }

    init(data) {
        this.socket = data.socket;
        this.color = data.color; // true = player1 (white)
        this.turn = data.color // starts off as true (because player1 starts) -- represents whether it's user's turn
    }

    preload() {
        this.load.image('whitePawn', 'src/assets/whitePawn.png');
        this.load.image('blackPawn', 'src/assets/blackPawn.png');
        this.load.image('whiteRook', 'src/assets/whiteRook.png');
        this.load.image('blackRook', 'src/assets/blackRook.png');
    }


    create() {
        this.whitePieces = this.add.group();
        this.blackPieces = this.add.group(); 
        this.board = this.createBoard(); 
        this.ghosts = [] // refers to the ghost pieces that appear when user clicks on piece to see possible movement options
        
        console.log(this.board) 

        if (this.turn) {
            this.setInteractiveness(); 
        } else {
            this.disableInteractiveness(); 
        }

        let self = this; 
        
        // response to changing turns 
        this.socket.on('change', function (color, vh, nvh) {
            if (color != self.color) {
                // console.log('changing turns!', vh[0], vh[1], nvh[0], nvh[1])
                self.opponentMove(vh, nvh)
                this.turn = true; 
                self.setInteractiveness(); 
            }
            
        })

        this.socket.on('destroy', function (color, v, h) {
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
           this.board[0][i] = this.createPiece(0, i, true, Soldier)
           this.board[1][i] = this.createPiece(1, i, true, Scout)
           this.board[6][i] = this.createPiece(6, i, false, Scout)
           this.board[7][i] = this.createPiece(7, i, false, Soldier)
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

    setTurnText(turn) {
        // if white (player1)
        console.log('setting Turn Text', turn)
        let text = turn ? 'YOUR TURN' : "OPPONENT'S TURN"
        if (this.textTurn) {
            this.textTurn.destroy() 

        }
        this.textTurn = this.add.text(850, 400, text, this.textConfig)
    }

    movePiece(move, piece) {
        console.log(move, piece)
        
        let [n_row, n_col, type] = move.slice(0,3)
        
        let [row, col] = [piece.getData('row'), piece.getData('col')]
        this.board[row][col] = 0
        this.board[n_row][n_col] = piece
        console.log('EDITED BOARD AFTER MOVE', this.board)
        piece.updatePosition(n_row, n_col)
        
        this.ghosts.forEach((ghost) => {
            ghost.destroy()
        })
        this.ghosts = [] 

        if (type == 'attack') {
            let [victim_r, victim_c, victim] = move.slice(3, 6)
            victim.destroy()
            this.socket.emit('destroy', this.color, victim_r, victim_c)
        }

        this.disableInteractiveness() 
        this.turn = false 
        this.socket.emit('change', this.color, [row, col], [n_row, n_col])

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

    createPiece(row, col, white, type) {
        let color = white ? 'white' : 'black'
        this.piece = new type(this, 50+col*100, 50+row*100, color, color)
        this.piece.setScale(0.15)
        this.piece.updatePosition(row, col)

        white ? this.whitePieces.add(this.piece) : this.blackPieces.add(this.piece)
        return this.piece; 
    }

    disableInteractiveness() {
        this.setTurnText(false)
        this.group = this.color ? this.whitePieces : this.blackPieces 
        this.group.getChildren().forEach((piece) => {
            piece.disableInteractive(); 
        })
    }

    setInteractiveness() {
        this.setTurnText(true)

        this.group = this.color ? this.whitePieces : this.blackPieces  
        this.ghostColor = this.color ? 'whitePawn' : 'blackPawn' 
        this.group.getChildren().forEach((piece) => {

            if (piece.possibleMoves().length > 0) {
                piece.setInteractive(); 

                piece.on('pointerover', () => {
                    piece.setScale(0.17);
                });
          
                piece.on('pointerout', () => {
                    piece.setScale(0.15);
                })

                piece.on('pointerup', () => {
                    console.log('pointerup')
                    let pm = piece.possibleMoves() 
                    console.log('pm', pm)
                    // deleteGhosts thing
                    for (let i = 0; i < pm.length; i += 1) {
                        const ghost = this.add.image(50+pm[i][1]*100, 50+pm[i][0]*100, piece.getData('type')).setScale(0.15).setAlpha(0.5)
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
