import Phaser from 'phaser'; 
export default class Piece extends Phaser.GameObjects.Sprite {  
    constructor(scene, x, y, key, type, color, healthbar) {
        super(scene, x, y, key)
        this.scene = scene 
        this.strength = 2
        this.health = 2
        this.healthbar = healthbar
        this.attack_radius = 1
        this.position_set = false 

        this.scene.add.existing(this)
        this.setData({'type': type, 'color': color, 'row': 0, 'col': 0, 'healthbar' : healthbar})
        let texture = type 
        this.setTexture(texture)
    }

    updatePosition(row, col) {
        this.setData('row', row)
        this.setData('col', col)
        this.x = 25+col*50
        this.y = 25+row*50
    }

    attack(move) {
        let [vr, vc, victim] = move.slice(1, 4)
        console.log('victim health', victim.health, victim.getData('type'))
        victim.health -= 1
        let dmg = 1
        console.log('victim health', victim.health)
        if (victim.health <= 0) {
            console.log(victim, 'true - destroyed!')
            console.log(vr, vc, this.scene.board[vr][vc])
            this.scene.board[vr][vc] = 0

            let [socket, color] = [this.scene.socket, this.scene.color]
            victim.destroyed();
        
            socket.emit('destroy', color, vr, vc)

        }
        else {
            victim.healthbar.decrease(dmg*50);
            this.scene.socket.emit('damage', this.scene.color, vr, vc, dmg)
        }
        
    }
    
    destroyed() {
        this.healthbar.bar.destroy()
        this.destroy()
    }

    attackMoves() {
        let moves = []  
        let [r,c] = [this.getData('row'), this.getData('col')]
        console.log('in attack moves - r, c:', r, c, this.attack_radius)
        for (let i = r - this.attack_radius; i <= r + this.attack_radius; i++) {
            for (let j = c - this.attack_radius; j <= c + this.attack_radius; j++) {
                if (this.inBounds(i, j)) {
                    let victim = this.scene.board[i][j]
                    if (victim != 0 && victim.getData('color') != this.getData('color') && !this.getData('type').includes('Spy') && !victim.getData('type').includes('Trap')) {
                        console.log('victim', victim, i, j);
                        moves.push(['attack', i, j, this.scene.board[i][j]])
                    }
                }
            }
        }
        return moves
    }

    possibleMoves(flag) {
        return this.doApm();
    }

    // should be moved to board.js 
    inBounds(row, col) {
        return row >= 0 && col >= 0 && row < this.scene.board.length && col < this.scene.board[0].length-1
    }
    
    /**
     * Sets this.moves to all possible moves in a single direction.
     * @param {Array} dir - Pair represented the change in row and change in column 
     * @param {integer} steps - max amount of distance the piece can travel
     */

    getApm(dir, steps) {
        let row = this.getData('row') 
        let col = this.getData('col')
        
        let visited = [[row, col, 'normal']];
        let stack = [];
        stack.push([row, col, 'normal']);

        while (stack.length != 0) {
            if (visited.length > steps) {
                return
            }
            let s = stack.pop()
            let boardSquare = 1
            if (!this.inBounds(s[0] + dir[0], s[1] + dir[1])) 
                return
            boardSquare = this.scene.board[s[0] + dir[0]][s[1] + dir[1]]

            if(boardSquare != 0 && boardSquare.data.list) {
            }

            if(boardSquare != 0 && !boardSquare.data.list.type.includes("Trap")) {
                return 
            }

            if (boardSquare.data && boardSquare.data.list.type.includes("Trap") && this.scene.terrain[s[0] + dir[0]][s[1] + dir[1]].includes("ground")) {
                visited.push(s)
                this.moves.push([s[0] + dir[0], s[1] + dir[1], 'normal'])
                stack.push([s[0] + dir[0], s[1] + dir[1], 'normal']) 
            } else if ((boardSquare == 0 || s == visited[0]) && this.scene.terrain[s[0] + dir[0]][s[1] + dir[1]].includes("ground")) {
                visited.push(s)
                this.moves.push([s[0] + dir[0], s[1] + dir[1], 'normal'])
                stack.push([s[0] + dir[0], s[1] + dir[1], 'normal']) 
            }
            
        }

        if (visited.length == 0)
            return
        
        //visited.forEach(element => this.moves.push(element));
    }


    /**
     * Checks if a move is viable via same logic as @getApm
     * @returns if the move is (1) in bounds (2) either itself or an empty square AND (3) on ground terrain 
     */
    checkMoveViability(row, col, n_row, n_col) {
        if(!this.inBounds(n_row, n_col)) {
            console.log('OUT OF BOUNDS', n_row, n_col)
            return false 
        }
        let boardSquare = this.scene.board[n_row][n_col]
        return ((boardSquare == 0 || (row == n_row && col == n_col)) && this.scene.terrain[n_row][n_col].includes('ground')) 
    }

    /**
     * Calculates all possible moves of piece
     * @returns nested array containing moves [[x1, y1, 'normal']....]
     */
    doApm() {
        this.moves = [];
        this.temp_moves && this.temp_moves.forEach((move) => {
            this.getApm(move, this.move_radius)
        })
        // if (this.getData('type').includes("King")) {
        //     //[possibleX, possibleY], max_travel_distance
        //     this.getApm([1,0], 3);
        //     this.getApm([-1,0], 3);
        //     this.getApm([0,1], 3);
        //     this.getApm([0,-1], 3);
        //     this.getApm([-1,1], 3);
        //     this.getApm([1,1], 3);
        //     this.getApm([1,-1], 3);
        //     this.getApm([-1,-1], 3);
        //     // console.log(row, col)
        //     // console.log(this.moves);
        // } else if (this.getData('type').includes("Soldier")) {
        //     //[possibleX, possibleY], max_travel_distance
        //     this.getApm([1,0], 1);
        //     this.getApm([-1,0], 1);
        //     this.getApm([0,1], 1);
        //     this.getApm([0,-1], 1);
        //     // console.log(row, col)
        //     // console.log(this.moves);
        // } else if (this.getData('type').includes("Queen")) {
        //     //[possibleX, possibleY], max_travel_distance
        //     this.getApm([1,0], 1);
        //     this.getApm([-1,0], 1);
        //     this.getApm([0,1], 1);
        //     this.getApm([0,-1], 1);
        //     // console.log(row, col)
        //     // console.log(this.moves);    
        // } else if (this.getData('type').includes("Sniper")) {
        //     [1, -1].forEach((x) => {
        //         [1, -1].forEach((y) => {
        //             this.getApm([x, y], 1)
        //         })
        //     })
        // } else if (this.getData('type').includes("Spy")) {
        //     this.getApm([1,0], 2);
        //     this.getApm([-1,0], 2);
        //     this.getApm([0,1], 2);
        //     this.getApm([0,-1], 2);
        // }

        return this.moves
    }
}