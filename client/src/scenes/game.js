import Soldier from '../helpers/pieces/soldier';
import King from '../helpers/pieces/king';
import Queen from '../helpers/pieces/queen';
import Sniper from '../helpers/pieces/sniper';
import Spy from '../helpers/pieces/spy';
import Civilian from '../helpers/pieces/civilian';
import Cannon from '../helpers/pieces/cannon';
import HealthBar from '../helpers/healthbar'
import PotionBar from '../helpers/potionbar'
import Board from '../helpers/board';
import Gem from '../helpers/pieces/gem';
import { infoTextConfig, BASE_ASSET_PATH, SPRITE_WIDTH, SPRITE_HEIGHT } from "../config";

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

    // temporarily changed spy sprites to civilian (in preload and createBoard where the spies were placed)
    // CHANGED PAWN TO SOLDIER IN SPRITES, DOAPM, AND SOLDIER.JS CONSTRUCTOR
    preload() {
        this.loadSprite('whiteGem', 'gem-sheet.png', 32, 32);
        this.loadSprite('blackGem', 'gem-sheet.png', 32, 32);
        this.loadSprite('whiteSoldier', 'soldier-white-sheet.png');
        this.loadSprite('blackSoldier', 'soldier-black-sheet.png');
        this.loadSprite('whiteKing', 'king-white-sheet.png');
        this.loadSprite('blackKing', 'king-black-sheet.png');
        this.loadSprite('whiteQueen', 'queen-white-sheet.png');
        this.loadSprite('blackQueen', 'queen-black-sheet.png');
        this.loadSprite('blackSniper', 'sniper-black-sheet.png');
        this.loadSprite('whiteCivilian', 'spy-white-sheet.png');
        this.loadSprite('blackCivilian', 'spy-black-sheet.png');
        this.loadSprite('whiteCannon', 'cannon-white-sheet.png');
        this.loadSprite('blackCannon', 'cannon-black-sheet.png');
        this.load.image('mountain', 'src/assets/mountain.png');
        this.load.image('water', 'src/assets/water.png');
        this.load.image('downmountain', 'src/assets/floor_377.png');
        this.load.image('upmountain', 'src/assets/floor_376.png');
        this.load.image('rightmountain', 'src/assets/floor_378.png');
        this.load.image('leftmountain', 'src/assets/floor_379.png');
        this.load.image('leftupmountain', 'src/assets/floor_360.png');
        this.load.image('rightupmountain', 'src/assets/floor_361.png');
        this.load.image('leftdownmountain', 'src/assets/floor_363.png');
        this.load.image('rightdownmountain', 'src/assets/floor_362.png');
        this.load.image('leftrightupmountain', 'src/assets/floor_330.png');
        this.load.image('leftrightdownmountain', 'src/assets/floor_330.png');
        this.load.image('leftrightupdownmountain', 'src/assets/floor_330.png');
        this.load.image('leftupdownmountain', 'src/assets/floor_330.png');
        this.load.image('rightupdownmountain', 'src/assets/floor_330.png');
        this.load.image('updownmountain', 'src/assets/floor_330.png');
        this.load.image('leftrightmountain', 'src/assets/floor_330.png');
        this.load.image('midmountain', 'src/assets/floor_318.png');
        this.load.image('midground', 'src/assets/sprite_000.png');
        this.load.image('midwater', 'src/assets/floor_222.png');
        this.load.image('downwater', 'src/assets/floor_238.png');
        this.load.image('upwater', 'src/assets/floor_206.png');
        this.load.image('rightwater', 'src/assets/floor_223.png');
        this.load.image('leftwater', 'src/assets/floor_221.png');
        this.load.image('leftupwater', 'src/assets/floor_205.png');
        this.load.image('rightupwater', 'src/assets/floor_207.png');
        this.load.image('leftdownwater', 'src/assets/floor_237.png');
        this.load.image('rightdownwater', 'src/assets/floor_239.png');
        this.load.image('leftrightupdownwater', 'src/assets/floor_200.png');
        this.load.image('leftrightupwater', 'src/assets/floor_204.png');
        this.load.image('leftrightdownwater', 'src/assets/floor_236.png');
        this.load.image('leftupdownwater', 'src/assets/floor_201.png');
        this.load.image('rightupdownwater', 'src/assets/floor_203.png');
        this.load.image('updownwater', 'src/assets/floor_202.png');
        this.load.image('leftrightwater', 'src/assets/floor_220.png');
        this.load.image('downground', 'src/assets/sprite_000.png');
        this.load.image('upground', 'src/assets/sprite_000.png');
        this.load.image('rightground', 'src/assets/sprite_000.png');
        this.load.image('leftground', 'src/assets/sprite_000.png');
        this.load.image('leftupground', 'src/assets/sprite_000.png');
        this.load.image('rightupground', 'src/assets/sprite_000.png');
        this.load.image('leftdownground', 'src/assets/sprite_000.png');
        this.load.image('rightdownground', 'src/assets/sprite_000.png');
        this.load.image('leftrightupground', 'src/assets/sprite_000.png');
        this.load.image('leftrightdownground', 'src/assets/sprite_000.png');
        this.load.image('leftrightupdownground', 'src/assets/sprite_000.png');
        this.load.image('leftupdownground', 'src/assets/sprite_000.png');
        this.load.image('rightupdownground', 'src/assets/sprite_000.png');
        this.load.image('updownground', 'src/assets/sprite_000.png');
        this.load.image('leftrightground', 'src/assets/sprite_000.png');
        this.load.image('object1', 'src/assets/floor_374.png');
        this.load.image('tent', 'src/assets/sprite_072.png');
        this.load.image('ground', 'src/assets/ground.png');
    }   

    /**
     * @description Creates an idle animation for given sprite using spritesheet 
     * @param {string} key Animation key 
     * @param {string} type Sprite type 
     * @param {number} startFrame Frame to start animating from in spritesheet 
     * @param {number} endFrame Frame to start end animation from in spritesheet
     */
    createIdleAnimation(key, type, startFrame, endFrame, frameRate) {
        this.anims.create({
            key: key,
            frames: this.anims.generateFrameNumbers(type, {start: startFrame, end: endFrame}),
            frameRate: frameRate ? frameRate : 10,
            repeat: -1
        });
    }

    create() {
        this.whiteCivilians = this.add.group(); 
        this.blackCivilians = this.add.group(); 

        this.whiteSoldiers = this.add.group();
        this.blackSoldiers = this.add.group();

        this.whiteSpys = this.add.group();
        this.blackSpys = this.add.group();
        this.whiteKings = this.add.group();
        this.blackKings = this.add.group();

        this.whitePieces = this.add.group();
        this.blackPieces = this.add.group();
        this.gems = this.add.group();

        this.cannons = this.add.group(); 
        this.board = this.createBoard(); 
        this.pickupZone = this.createPickupZone(); 
        this.ghosts = [] // refers to the ghost pieces that appear when user clicks on piece to see possible movement options
        
        this.potionIncrease = 0 
        
        if (this.turn) {
            this.setInteractiveness(); 
        } else {
            this.disableInteractiveness(); 
        }

        // Create Animations
        this.createIdleAnimation('idleWhiteSoldier', 'whiteSoldier', 0, 3);        
        this.createIdleAnimation('idleBlackSoldier', 'blackSoldier', 0, 3);
        this.createIdleAnimation('idleWhiteKing', 'whiteKing', 0, 3);
        this.createIdleAnimation('idleBlackKing', 'blackKing', 0, 3);
        this.createIdleAnimation('idleWhiteCannon', 'whiteCannon',0, 3);
        this.createIdleAnimation('idleGem', 'whiteGem', 0, 6);

        // Start Animations
        this.whiteSoldiers.playAnimation('idleWhiteSoldier');
        this.blackSoldiers.playAnimation('idleBlackSoldier');
        this.whiteKings.playAnimation('idleWhiteKing');
        this.blackKings.playAnimation('idleBlackKing');
        this.cannons.playAnimation('idleWhiteCannon');
        this.gems.playAnimation('idleGem');
        
        let self = this; 
        
        // response to changing turns 
        this.socket.on('change', (color, vh, nvh, dropped) => {
            if (color != self.color) {
                console.log('dropped', dropped)
                // self.color ? this.blackPotionBar.increase(potionIncrease) : this.whitePotionBar.increase(potionIncrease)
                this.opponentMove(vh, nvh, dropped)
                this.turn = true; 
                this.setInteractiveness(); 
            }
        })

        this.socket.on('potionIncrease', (color, potionIncrease) => {
            if (color != self.color) {
                self.color ? this.blackPotionBar.increase(potionIncrease) : this.whitePotionBar.increase(potionIncrease)
            }
        })

        /**
        * Destroys character from player's own team (after being killed on the opponent's turn)
        * @param {boolean} color - represents color of the killer's team (false for black, true for white)
        */
        this.socket.on('destroy', (color, v, h) => {
            if (color != this.color) {
                //console.log('self destroy')
                this.selfDestroy(v, h)
            }
        })

        this.socket.on('damage', (color, v, h, dmg) => {
            if (color != self.color) {
                self.selfDamage(v, h, dmg)
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
        });

        this.socket.on('win', (color) => {
            //console.log("Win Condition Met!");
            const endGameText = self.color === color ? 'Winner!!' : 'Better luck next time';
            self.add.text(450,400,endGameText,infoTextConfig);
            self.board = [];

            // End Game Logic Here
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            let [row, col] = [(dragY - 25) / 50, (dragX - 25) / 50]
            gameObject.getData('healthbar').setX(col*50)
            gameObject.getData('healthbar').setY(45 + row * 50)
            gameObject.getData('healthbar').draw()
        })

        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
            console.log('DRAG START')
        })

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            
            let [row, col] = [(gameObject.input.dragStartY - 25) / 50, (gameObject.input.dragStartX - 25) / 50]
            
            let n_row = Math.round((gameObject.y - 25 ) / 50)
            let n_col = Math.round((gameObject.x - 25) / 50)

            if (!gameObject.checkMoveViability(row, col, n_row, n_col)) {
                gameObject.x = gameObject.input.dragStartX; 
                gameObject.y = gameObject.input.dragStartY; 
                gameObject.getData('healthbar').setX(col*50); 
                gameObject.getData('healthbar').setY(45+row*50); 
                gameObject.getData('healthbar').draw() 
                return;
            }  
            gameObject.x = n_col*50 + 25 
            gameObject.y = n_row*50 + 25
            gameObject.updatePosition(n_row, n_col)

            gameObject.getData('healthbar').setX(n_col*50)
            gameObject.getData('healthbar').setY(45 + n_row * 50)
            gameObject.getData('healthbar').draw()
            
            this.input.setDraggable(gameObject, false)
            gameObject.position_set = true
            this.finishTurn([row, col], [n_row, n_col], true)
                                
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
        const victim = move[3];
        const isVictimAGem = victim instanceof Gem;

        if(isVictimAGem) {
            victim.show(); // We know move[3] is a gem so we use the gem specific method
        }
        piece.attack(move);

        if(isVictimAGem && victim.health <= 0) {
            this.socket.emit('win', this.color);
        }

        //console.log('finishing turn')
        this.finishTurn(coor, coor, false)
    }

    /**
     * moves piece for current player after they choose their movement option 
     * @param {Array} move - [new_row, new_col, 'normal']
     * @param {*} piece - piece being moved 
     */
    movePiece(move, piece) {
        //console.log(move, piece)
        
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

        this.finishTurn([row, col], [n_row, n_col], false)
    }

    /**
     * Finishes current player turn by removing ghost images, printing the new board, disabling interactiveness
     * @param {Array} old_coor — [old_row, old_col] for the current player's piece that moved
     * @param {Array} new_coor — [new_row, new_col]
     */
    finishTurn(old_coor, new_coor, dropped) {
        //console.log(this, old_coor, new_coor)
        this.destroyGhosts(); 
        this.printBoard(); 
        this.disableInteractiveness(); 
        this.turn = false; 
        this.socket.emit('change', this.color, old_coor, new_coor, dropped)

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
            //console.log('game over')
        }
        
        this.board[row][col] = 0 
    }

    selfDamage(v, h, dmg) {
        let piece = this.board[v][h]
        //console.log('selfdamage', v, h)
        piece.health -= 1
        piece.getData('healthbar').decrease(dmg*50)
        
    }

    /**
     * Changes opponent player's position on the board immediately after a turn switch. 
     * @param {Array} old_coor - the moved piece's old vertical/horizontal coordinates 
     * @param {Array} new_coor - piece's new coordinates after their turn 
     */
    opponentMove(old_coor, new_coor, dropped) {
        //console.log('opponent move', this, old_coor, new_coor)
        let self = this; 
        // board[v][h] 
        let [row, col] = old_coor
        let [n_row, n_col] = new_coor 

        // UPDATE THIS LATER 
        let o_row = row > 0 ? 1 : 0  
        let o_col = col-16 
        console.log('help', o_row, row, o_col, col, self.pickupZone)
        const piece = dropped ? self.pickupZone[o_row][o_col] : self.board[row][col]
        if (!dropped) this.board[row][col] = 0
        this.board[n_row][n_col] = piece 
        if (piece != 0) {
            piece.updatePosition(n_row, n_col)
            piece.getData('healthbar').setX(n_col*50)
            piece.getData('healthbar').setY(45 + n_row * 50)
            piece.getData('healthbar').draw()
        }
        

    }

    setInteractiveness() {
        this.printBoard() 
        this.setTurnText(true)
        this.potionIncrease = 0 

        this.group = this.color ? this.whitePieces : this.blackPieces
        
        this.cannonsFire()
        this.potionMaking() 
        this.group.getChildren().forEach((piece) => {
            if (piece.getData('type').includes('Civilian') && !piece.position_set) {
                piece.setInteractive() 
                this.input.setDraggable(piece)
            }
            else if (piece.possibleMoves(false).length > 0) {
                piece.setInteractive(); 

                const OLD_SCALE = 1
                const NEW_SCALE = 1.3

                console.log(piece.scale)
                piece.on('pointerover', () => {
                    piece.setScale(NEW_SCALE);
                });
          
                piece.on('pointerout', () => {
                    piece.setScale(OLD_SCALE);
                })

                piece.on('pointerdown', () => {
                    let pm = piece.possibleMoves(true)
                    let am = piece.attackMoves() 
                    //console.log('pm', pm, 'am', am)
                    //console.log('attack r', piece.attack_radius)
                    this.destroyGhosts()
                    for (let i = 0; i < pm.length; i += 1) {
                        const ghost = this.add.image(25+pm[i][1]*50, 25+pm[i][0]*50, piece.getData('type')).setScale(OLD_SCALE).setAlpha(0.5)
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
     * WHY THIS.GROUP? i think i put this need to change 
     */
    cannonsFire() {
        let curr_group = this.color ? this.whitePieces : this.blackPieces
        curr_group.getChildren().forEach((piece) => {
            if (piece.getData('type').includes('Cannon')) {
                piece.fire(); 
            }
        })
    }

    potionMaking() {
        let civilians = this.color ? this.whiteCivilians : this.blackCivilians 
        civilians.getChildren().forEach((civilian) => {
            if (civilian.position_set) {
                civilian.createPotion()
                this.potionIncrease += 10 
            }
        })
        this.socket.emit('potionIncrease', this.color, this.potionIncrease)
    }

    // CREATING BOARD / PIECES 
    createBoard() {
        this.board = []; 
        this.createPotion()
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
            let tile = this.perlinBoard[j][i]
            let sprite = this.add.image(25+i*50, 25+j*50, "midground")
            sprite.setScale(1.04166667);
            let sprite1 = this.add.image(25+i*50, 25+j*50, tile)
            sprite1.setScale(1.04166667);
            if(tile.includes("ground")) {
                if (Math.random() > 0.9) {
                    let sprite2 = this.add.image(25+i*50, 25+j*50, "object1")
                    sprite2.setScale(.5);
                }

                else if (Math.random() > 0.8) {
                    let sprite2 = this.add.image(25+i*50, 25+j*50, "mountain")
                    sprite2.setScale(.5);
                }

                else if (Math.random() > 0.98) {
                    let sprite2 = this.add.image(25+i*50, 25+j*50, "tent")
                }
                
            }
            
            sprite1.setScale(1.04166667);
            row.push(sprite1)
            
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

        this.whiteSoldiers.add(this.board[0][i]);
        this.blackSoldiers.add(this.board[15][i]);
        this.whiteKings.add(this.board[1][i]);
        this.blackKings.add(this.board[14][i]);
    }
    this.board[13][0] = this.createPiece(13, 0, false, Queen);
    this.board[13][1] = this.createPiece(13, 1, false, Sniper);
    
    this.board[8][2] = this.createPiece(8, 2, true, Cannon);
    this.board[9][4] = this.createPiece(9, 4, true, Gem);
    this.board[8][3] = this.createPiece(8, 3, false, Gem);

    this.gems.add(this.board[9][4]);
    this.gems.add(this.board[8][3]);

    this.cannons.add(this.board[8][2]); 

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

    createPickupZone() {
        let pickupZone = [] 
        for (let i = 0; i < 2; i++) {
            let row = [] 
            for (let j = 0; j < 10; j ++) {
                row = row.concat([0])
            }
            pickupZone.push(row)
         }
         console.log(pickupZone)
        

        for (let i = 0; i < 10; i += 1) {
            let whiteCivilian = this.createPiece(0, 16+i, true, Civilian)
            pickupZone[0][i] = whiteCivilian 
            this.whiteCivilians.add(whiteCivilian)
            this.whitePieces.add(whiteCivilian)
    
            let blackCivilian = this.createPiece(15, 16+i, false, Civilian)
            pickupZone[1][i] = blackCivilian
            this.blackCivilians.add(blackCivilian)
            this.blackPieces.add(blackCivilian)
        }
        return pickupZone
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
        this.piece.updatePosition(row, col)
        white ? this.whitePieces.add(this.piece) : this.blackPieces.add(this.piece)
        return this.piece; 
    }

    createPotion() {
        this.whitePotionBar = new PotionBar(this, 800, 75, 'white')
        this.blackPotionBar = new PotionBar(this, 800, 750, 'black')
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
        const translation = {'whiteSoldier': 'wS', 'blackSoldier': 'bS', 'whiteKing': 'wK', 'blackKing': 'bK', 'blackQueen': 'bQ'}

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
