import Soldier from '../helpers/pieces/soldier';
import King from '../helpers/pieces/king';
import Queen from '../helpers/pieces/queen';
import Sniper from '../helpers/pieces/sniper';
import Spy from '../helpers/pieces/spy';
import Cannon from '../helpers/pieces/cannon';
import HealthBar from '../helpers/healthbar'
import Board from '../helpers/board';

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
        this.perlinBoard = data.perlinBoard
    }

    preload() {
        this.load.image('whitePawn', 'src/assets/whitePawn.png');
        this.load.image('blackPawn', 'src/assets/blackPawn.png');
        this.load.image('whiteKing', 'src/assets/whiteRook.png');
        this.load.image('blackKing', 'src/assets/blackRook.png');
        this.load.image('whiteQueen', 'src/assets/whiteQueen.png');
        this.load.image('blackQueen', 'src/assets/blackQueen.png');
        this.load.image('blackSniper', 'src/assets/blackSniper.png');
        this.load.image('whiteSpy', 'src/assets/whiteSpy.png');
        this.load.image('blackSpy', 'src/assets/blackSpy.png');
        this.load.image('blackSpy', 'src/assets/blackSpy.png');
        this.load.image('whiteCannon', 'src/assets/whiteCannon.png');
        this.load.image('blackCannon', 'src/assets/blackCannon.png');
        this.load.image('mountain', 'src/assets/mountain.png');
        this.load.image('water', 'src/assets/water.png');
        this.load.image('ground', 'src/assets/ground.png');

    }

    create() {
        this.whitePieces = this.add.group();
        this.blackPieces = this.add.group();
        this.cannons = []  
        this.board = this.createBoard(); 
        this.ghosts = [] // refers to the ghost pieces that appear when user clicks on piece to see possible movement options
        
        if (this.turn) {
            this.setInteractiveness(); 
        } else {
            this.disableInteractiveness(); 
        }

        // let self = this; 
        
        // response to changing turns 
        this.socket.on('change', (color, vh, nvh) => {
            if (color != this.color) {
                // console.log('changing turns!', vh[0], vh[1], nvh[0], nvh[1])
                this.opponentMove(vh, nvh)
                this.turn = true; 
                this.setInteractiveness(); 
            }
            
        })

        /**
        * Destroys character from player's own team (after being killed on the opponent's turn)
        * @param {boolean} color - represents color of the killer's team (false for black, true for white)
        */
        this.socket.on('destroy', (color, v, h) => {
            if (color != this.color) {
                console.log('self destroy')
                this.selfDestroy(v, h)
            }
        })

        this.socket.on('damage', (color, v, h, dmg) => {
            if (color != this.color) {
                this.selfDamage(v, h, dmg)
            }
        })

        /** 
         * Sets player visible after opponent revealed them. 
         * @param row/col - dimensions of the revealed player 
        */
        
        this.socket.on('setVisible', (row, col) => {
            let piece = this.board[row][col]
            piece.setVisible(true)
            piece.healthbar.bar.setVisible(true)
        })

    }

    update() {

    }
    /**
     * HOW MOVING PIECES WORKS 
     * @setInteractiveness - potential movements for the current player are calculated. 
     *      when player clicks on a piece, they see the potential mvmts of that piece
     *      when player clicks on a potential move, attackPiece() is triggered if it is 
     *      an attacking move, and movePiece() is triggered otherwise. 
     * @attackPiece -> piece.attack(move) in piece.js -> @finishTurn 
     *     @attack in piece.js -> calculates/implements damage -> (victim.destroyed -> emit('destroy')) or emit('damage')
     * @movePiece -> if player chooses to make a normal move -> moves the piece -> @finishTurn 
     * @finishTurn -> destroys ghosts / disables interactiveness --> emit('change')
    */ 



    /**
     * Attacks enemy player (initiated in @setInteractiveness 
     *  when current player chooses an attack mvmt)
     * @param {Array} move - ['attack', victim_row, victim_col, victim (object)]
     * @param {Object} piece - the attacking piece 
     */
    attackPiece(move, piece) {
        let coor = [piece.getData('row'), piece.getData('col')]
        piece.attack(move)
        this.finishTurn(coor, coor)
    }

    /**
     * moves piece for current player after they choose their movement option 
     * @param {Array} move - [new_row, new_col, 'normal']
     * @param {*} piece - piece being moved 
     */
    movePiece(move, piece) {
        console.log(move, piece)
        
        let [n_row, n_col, type] = move.slice(0,3)
        
        let [row, col] = [piece.getData('row'), piece.getData('col')]
        this.board[row][col] = 0
        this.board[n_row][n_col] = piece
        piece.updatePosition(n_row, n_col)
        // fix health bar
        piece.getData('healthbar').setX(n_col*50)
        piece.getData('healthbar').setY(45 +n_row*50)
        // console.log(n_col + " " +  n_row)
        piece.getData('healthbar').draw()

        this.finishTurn([row, col], [n_row, n_col])
    }

    /**
     * Finishes current player turn by removing ghost images, printing the new board, disabling interactiveness
     * @param {Array} old_coor — [old_row, old_col] for the current player's piece that moved
     * @param {Array} new_coor — [new_row, new_col]
     */
    finishTurn(old_coor, new_coor) {
        console.log(this, old_coor, new_coor)
        this.destroyGhosts(); 
        this.printBoard(); 
        this.disableInteractiveness(); 
        this.turn = false; 
        this.socket.emit('change', this.color, old_coor, new_coor)

    }

    /**
     * Player of the current team was destroyed in the previous turn. (Initiated immediately after a turn switch)
     * @param {int} row — dimensions of the destroyed player
     * @param {int} col 
     */
    selfDestroy(row, col) {
        let piece = this.board[row][col]
        piece.getData('healthbar').bar.destroy()
        piece.destroy() 
        if (this.whitePieces.children.size == 0 || this.blackPieces.children.size == 0) {
            // REPLACE WITH REAL GAME OVER 
            console.log('game over')
        }
        
        this.board[row][col] = 0 
    }

    selfDamage(v, h, dmg) {
        let piece = this.board[v][h]
        console.log('selfdamage', v, h)
        piece.health -= 1
        piece.getData('healthbar').decrease(dmg*50)
        
    }

    /**
     * Changes opponent player's position on the board immediately after a turn switch. 
     * @param {Array} old_coor - the moved piece's old vertical/horizontal coordinates 
     * @param {Array} new_coor - piece's new coordinates after their turn 
     */
    opponentMove(old_coor, new_coor) {
        console.log('opponent move', this, old_coor, new_coor)
        let self = this; 
        // board[v][h] 
        let [row, col] = old_coor
        let [n_row, n_col] = new_coor 

        const piece = self.board[row][col]
        this.board[row][col] = 0
        this.board[n_row][n_col] = piece 
        if (piece != 0) {
            piece.updatePosition(n_row, n_col)
            piece.getData('healthbar').setX(n_col*50)
            piece.getData('healthbar').setY(45 + n_row * 50)
            piece.getData('healthbar').draw()
            console.log(piece)
        }
        

    }

    setInteractiveness() {
        this.printBoard() 
        this.setTurnText(true)

        this.group = this.color ? this.whitePieces : this.blackPieces
        
        this.cannonsFire()
        this.group.getChildren().forEach((piece) => {

            if (piece.possibleMoves(false).length > 0) {
                piece.setInteractive(); 

                let old_scale = piece.scale 
                piece.on('pointerover', () => {
                    piece.setScale(piece.scale * 1.1);
                });
          
                piece.on('pointerout', () => {
                    piece.setScale(old_scale);
                })


                piece.on('pointerdown', () => {
                    let pm = piece.possibleMoves(true)
                    let am = piece.attackMoves() 
                    console.log('pm', pm, 'am', am)
                    console.log('attack r', piece.attack_radius)
                    this.destroyGhosts()
                    for (let i = 0; i < pm.length; i += 1) {
                        const ghost = this.add.image(25+pm[i][1]*50, 25+pm[i][0]*50, piece.getData('type')).setScale(old_scale).setAlpha(0.5)
                        ghost.setInteractive(); 

                        ghost.on('pointerup', () => {
                            this.movePiece(pm[i], piece)
                        })
                        this.ghosts.push(ghost)
                    }

                    for (let i = 0; i < am.length; i += 1) {
                        const ghost = this.add.rectangle(25+am[i][2]*50, 25+am[i][1]*50, 50, 50, 0xCC0000).setAlpha(0.25)
                        ghost.setInteractive(); 
                        ghost.on('pointerup', () => {
                            console.log('attacking')
                            this.attackPiece(am[i], piece)
                        })
                        this.ghosts.push(ghost)
                    }
                })


            }
        })
        
    }
    
    disableInteractiveness() {
        this.setTurnText(false)
        this.group = this.color ? this.whitePieces : this.blackPieces 
        this.group.getChildren().forEach((piece) => {
            piece.disableInteractive(); 
        })
    }

    /**
     * For each player, when it is *their turn*, this function is initiated automatically 
     * in @setInteractiveness -- fires cannons for the current player
     *  piece.fire() is in cannon.js 
     */
    cannonsFire() {
        this.group = this.color ? this.whitePieces : this.blackPieces
        this.group.getChildren().forEach((piece) => {
            if (piece.getData('type').includes('Cannon')) {
                piece.fire(); 
            }
        })
    }

// CREATING BOARD / PIECES 
    createBoard() {
        this.board = []; 
        // let perlinBoard = new Board(16, 16).getBoard();
        this.terrain = this.perlinBoard
        for (let i = 0; i < 16; i += 1) {
            this.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        console.log(this.perlinBoard)

        let colors = [0xFFFFFF, 0xB75555]
        for (let i = 0; i < 16; i ++) {
            let index = i % 2
            let row = [] 
            for (let j = 0; j < 16; j++) {
            let color = colors[index]
            let tile = this.perlinBoard[i][j]
            
            if (tile === "mountain") {
                let sprite = this.add.image(25+i*50, 25+j*50, "ground")
                sprite.setScale(1.04166667);
            }
            let sprite1 = this.add.image(25+i*50, 25+j*50, tile)
            sprite1.setScale(1.04166667);
            row.push(sprite1)
            
            index = Math.abs(index - 1)
            }
    }
        // TO FILL IN - add Pieces 
    for (let i = 0; i < 8; i += 1) {
        // board[h][v]
        this.board[0][i] = this.createPiece(0, i, true, Soldier)
        this.board[1][i] = this.createPiece(1, i, true, King)
        this.board[14][i] = this.createPiece(14, i, false, King)
        this.board[15][i] = this.createPiece(15, i, false, Soldier)
    }
    this.board[13][0] = this.createPiece(13, 0, false, Queen)
    this.board[13][1] = this.createPiece(13, 1, false, Sniper)
    this.board[13][2] = this.createPiece(13, 2, false, Spy)
    this.board[8][2] = this.createPiece(8, 2, true, Cannon)
    this.cannons.push(this.board[8][2]) 

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

    /**
     * Creates a new piece on the board w/ health_bar, dimensions, etc. 
     * @param {Object} type - the actual class type (Soldier, King, etc.)
     * @returns the new piece 
     */
    createPiece(row, col, white, type) {
        let color = white ? 'white' : 'black'
        let healthbar = new HealthBar(this, 25+col*50, 20 + row*50)
        this.piece = new type(this, 25+col*50, 25+row*50, color, color, healthbar)
        console.log(this.piece)
        this.piece.updatePosition(row, col)

        white ? this.whitePieces.add(this.piece) : this.blackPieces.add(this.piece)
        return this.piece; 
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

    printBoard() {
        const translation = {'whitePawn': 'wP', 'blackPawn': 'bP', 'whiteKing': 'wK', 'blackKing': 'bK', 'blackQueen': 'bQ'}

        for (let row = 0; row < 16; row ++) {
            let str = ''
            for (let col = 0; col < 16; col ++) {
                str += this.board[row][col] == 0 ? 0 : translation[this.board[row][col].getData('type')]
                str += ' '
            }
            console.log(str)
        }
    }

    destroyGhosts() {
        this.ghosts.forEach((ghost) => {
            ghost.destroy()
        })
        this.ghosts = [] 
    }

    

    
}
