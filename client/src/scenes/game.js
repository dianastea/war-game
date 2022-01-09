import Soldier from '../helpers/pieces/soldier';
import King from '../helpers/pieces/king';
import Queen from '../helpers/pieces/queen';
import Sniper from '../helpers/pieces/sniper';
import Spy from '../helpers/pieces/spy';
import Cannon from '../helpers/pieces/cannon';
import HealthBar from '../helpers/healthbar'
import { infoTextConfig, BASE_ASSET_PATH, SPRITE_WIDTH, SPRITE_HEIGHT } from "../config";

// need to add color functionality 
export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'SceneGame'
        });
        this.whiteSoldiers = [];
        this.blackSoldiers = [];
    }

    init(data) {
        this.socket = data.socket;
        this.color = data.color; // true = player1 (white)
        this.turn = data.color // starts off as true (because player1 starts) -- represents whether it's user's turn
    }

    

    /**
     * @description Loads sprite from spritesheet given asset path 
     * @param {Phaser.Scene} scene Phaser Game Scene
     * @param {string} name Name of sprite being loaded 
     * @param {string} filename String representing spritesheet filename 
     * @param {width} width Pixel width of single sprite frame
     * @param {height} height Pixel height of single sprite frame
     */
    loadSprite(name,filename,width,height) {
        const spriteWidth = width === undefined ? SPRITE_WIDTH : width;
        const spriteHeight = height === undefined ? SPRITE_HEIGHT : height;
        this.load.spritesheet(name, BASE_ASSET_PATH + filename, {frameWidth: spriteWidth, frameHeight: spriteHeight});
    }

    preload() {
        this.loadSprite('whitePawn', 'soldier-sheet.png');
        this.loadSprite('blackPawn', 'soldier-sheet.png');
        this.loadSprite('whiteKing', 'king-sheet.png');
        this.loadSprite('blackKing', 'king-sheet.png');
        this.loadSprite('whiteQueen', 'queen-sheet.png');
        this.loadSprite('blackQueen', 'queen-sheet.png');
        this.loadSprite('blackSniper', 'sniper-sheet.png');
        this.loadSprite('whiteSpy', 'spy-sheet.png');
        this.loadSprite('blackSpy', 'spy-sheet.png');
        this.loadSprite('whiteCannon', 'cannon-sheet.png');
        this.loadSprite('blackCannon', 'cannon-sheet.png');
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

        // Might need a more robust way of setting this up
        this.anims.create({
            key: 'idleWhitePawn',
            frames: this.anims.generateFrameNames('whitePawn', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idleBlackPawn',
            frames: this.anims.generateFrameNames('blackPawn', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.whiteSoldiers.forEach((soldier) => {
            soldier.anims.play('idleWhitePawn', true);
        });

        this.blackSoldiers.forEach((soldier) => {
            soldier.anims.play('idleBlackPawn', true);
        });
        
        let self = this; 
        
        // response to changing turns 
        this.socket.on('change', function (color, vh, nvh) {
            if (color != self.color) {
                // console.log('changing turns!', vh[0], vh[1], nvh[0], nvh[1])
                self.opponentMove(vh, nvh)
                self.turn = true; 
                self.setInteractiveness(); 
            }
            
        })

        this.socket.on('destroy', function (color, v, h) {
            if (color != self.color) {
                console.log('self destroy')
                self.selfDestroy(v, h)
            }
        })

        this.socket.on('damage', function (color, v, h, dmg) {
            if (color != self.color) {
                self.selfDamage(v, h, dmg)
            }
        })

        this.socket.on('setVisible', function (row, col) {
            let piece = self.board[row][col]
            piece.setVisible(true)
            piece.healthbar.bar.setVisible(true)
        })

    }

    update() {
    }

    attackPiece(move, piece) {
        let coor = [piece.getData('row'), piece.getData('col')]
        piece.attack(move)
        // this.destroyGhosts(); 
        // this.printBoard(); 
        // this.disableInteractiveness(); 
        // this.turn = false; 

        // this.socket.emit('change', this.color, [r, c], [r, c])
        console.log('finishing turn')
        this.finishTurn(coor, coor)
    }

    movePiece(move, piece) {
        console.log(move, piece)
        
        let [n_row, n_col, type] = move.slice(0,3)
        
        let [row, col] = [piece.getData('row'), piece.getData('col')]
        this.board[row][col] = 0
        this.board[n_row][n_col] = piece
        console.log('EDITED BOARD AFTER MOVE') 
        piece.updatePosition(n_row, n_col)
        piece.getData('healthbar').setX(n_col*50)
        piece.getData('healthbar').setY(45 +n_row*50)
        console.log(n_col +" " +  n_row)
        piece.getData('healthbar').draw()
        this.finishTurn([row, col], [n_row, n_col])
        // this.destroyGhosts(); 
        // this.printBoard(); 
        // this.disableInteractiveness(); 
        // this.turn = false; 
        // this.socket.emit('change', this.color, [row, col], [n_row, n_col])

    }

    finishTurn(old_coor, new_coor) {
        console.log(this, old_coor, new_coor)
        this.destroyGhosts(); 
        this.printBoard(); 
        this.disableInteractiveness(); 
        this.turn = false; 
        this.socket.emit('change', this.color, old_coor, new_coor)

    }

    selfDestroy(v, h) {
        console.log('in the self destroy', this.board[v][h])
        let piece = this.board[v][h]
        piece.getData('healthbar').bar.destroy()
        piece.destroy() 
        if (this.whitePieces.children.size == 0 || this.blackPieces.children.size == 0) {
            console.log('game over')
        }
        
        this.board[v][h] = 0 
    }

    selfDamage(v, h, dmg) {
        let piece = this.board[v][h]
        // piece.health -= 1 
        // console.log(piece.getData('type'), 'health', piece.health)
        // console.log('health', piece.health)
        console.log('selfdamage', v, h)
        piece.health -= 1
        piece.getData('healthbar').decrease(dmg*50)
        
    }

    opponentMove(vh, nvh) {
        console.log('opponent move', this, vh, nvh)
        let self = this; 
        // board[v][h] 
        let v = vh[0]
        let h = vh[1]
        let nv = nvh[0]
        let nh = nvh[1]

        const piece = self.board[v][h]
        this.board[v][h] = 0
        this.board[nv][nh] = piece 
        if (piece != 0) {
            piece.updatePosition(nv, nh)
            piece.getData('healthbar').setX(nh*50)
            piece.getData('healthbar').setY(45 + nv * 50)
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

        for (let i = 0; i < 16; i += 1) {
            this.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }

        let colors = [0xFFFFFF, 0xB75555]
        for (let i = 0; i < 16; i ++) {
            let index = i % 2
            let row = [] 
            for (let j = 0; j < 16; j++) {
            let color = colors[index]
            
            row.push(this.add.rectangle(25+i*50, 25+j*50, 50, 50, color))
            index = Math.abs(index - 1)
            }
    }
    // TO FILL IN - add Pieces 
    for (let i = 0; i < 8; i += 1) {
        // board[h][v]
        this.board[0][i] = this.createPiece(0, i, true, Soldier);
        this.board[1][i] = this.createPiece(1, i, true, King);
        this.board[14][i] = this.createPiece(14, i, false, King);
        this.board[15][i] = this.createPiece(15, i, false, Soldier);

        this.whiteSoldiers.push(this.board[0][i]);
        this.blackSoldiers.push(this.board[15][i]);
    }
    this.board[13][0] = this.createPiece(13, 0, false, Queen);
    this.board[13][1] = this.createPiece(13, 1, false, Sniper);
    this.board[13][2] = this.createPiece(13, 2, false, Spy);
    this.board[8][2] = this.createPiece(8, 2, true, Cannon);
    this.cannons.push(this.board[8][2]) 

    let p1 = this.color ? ' (You)' : ''
    let p2 = this.color ? '' : ' (You)'
    this.textPlayer1 = this.add.text(
        850,
        200,
        'Player 1 - White' + p1,
        infoTextConfig,
    );

    this.textPlayer2 = this.add.text(
        850, 
        600, 
        'Player 2 - Black' + p2, 
        infoTextConfig,
    ) 

        this.textTurn = this.add.text(850, 400, 'GAME STARTING', infoTextConfig)

        console.log(this.whitePieces, this.blackPieces)
        return this.board; 
    }

    createPiece(row, col, white, type) {
        let color = white ? 'white' : 'black'
        let healthbar = new HealthBar(this, 25+col*50, 20 + row*50)
        this.piece = new type(this, 25+col*50, 25+row*50, color, color, healthbar)
        this.piece.updatePosition(row, col)
        white ? this.whitePieces.add(this.piece) : this.blackPieces.add(this.piece)
        return this.piece; 
    }

    setTurnText(turn) {
        console.log('setting Turn Text', turn)
        let text = turn ? 'YOUR TURN' : "OPPONENT'S TURN"
        if (this.textTurn) {
            this.textTurn.destroy() 

        }
        this.textTurn = this.add.text(850, 400, text, infoTextConfig);
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
