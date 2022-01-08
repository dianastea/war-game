import Phaser from 'phaser'; 

export default class Piece extends Phaser.GameObjects.Sprite {  
    constructor(scene, x, y, key, type, color, healthbar) {
        super(scene, x, y, key)
        this.scene = scene 
        this.strength = 2
        this.health = 2
        this.attack_radius = 1
        this.healthbar = healthbar

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
        victim.health -= 1
        let dmg = 1
        
        if (victim.health == 0) {
            this.scene.board[vr][vc] = 0
            victim.healthbar.bar.destroy();
            victim.destroy();
           
            this.scene.socket.emit('destroy', this.scene.color, vr, vc)
        }
        else {
            victim.healthbar.decrease(dmg*50);
            this.scene.socket.emit('damage', this.scene.color, vr, vc, dmg)
            
        }
        
    }


    attackMoves() {
        let moves = [] 
        let [r, c] = [this.getData('row'), this.getData('col')]
        for (let r_dir = -1; r_dir < 2; r_dir++) {
            for (let c_dir = -1; c_dir < 2; c_dir ++) {
                if (this.inBounds(r+r_dir, c+c_dir)) {
                    let victim = this.scene.board[r + r_dir][c + c_dir]
                    if (victim != 0 && victim.getData('color') != this.getData('color')) {
                        moves.push(['attack', r+r_dir, c+c_dir, victim])
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
        return row >= 0 && col >= 0 && row < this.scene.board.length && col < this.scene.board[0].length 
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
            console.log(s)
            let boardSquare = 1
            if (!this.inBounds(s[0] + dir[0], s[1] + dir[1])) 
                return
            boardSquare = this.scene.board[s[0] + dir[0]][s[1] + dir[1]]
            if(boardSquare != 0) {
                return 
            }
            if (boardSquare == 0 || s == visited[0]) {
                
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
     * Calculates all possible moves of piece
     * @returns nested array containing moves [[x1, y1, 'normal']....]
     */

    doApm() {
        if (this.getData('type').includes("Rook")) {
            this.moves = [];
            //[possibleX, possibleY], max_travel_distance
            this.getApm([1,0], 3);
            this.getApm([-1,0], 3);
            this.getApm([0,1], 3);
            this.getApm([0,-1], 3);
            this.getApm([-1,1], 3);
            this.getApm([1,1], 3);
            this.getApm([1,-1], 3);
            this.getApm([-1,-1], 3);
            // console.log(row, col)
            // console.log(this.moves);
        } else if (this.getData('type').includes("Pawn")) {
            this.moves = [];
            //[possibleX, possibleY], max_travel_distance
            this.getApm([1,0], 1);
            this.getApm([-1,0], 1);
            this.getApm([0,1], 1);
            this.getApm([0,-1], 1);
            // console.log(row, col)
            // console.log(this.moves);
        } else if (this.getData('type').includes("Queen") || true) {
            this.moves = [];
            //[possibleX, possibleY], max_travel_distance
            this.getApm([1,0], 1);
            this.getApm([-1,0], 1);
            this.getApm([0,1], 1);
            this.getApm([0,-1], 1);
            // console.log(row, col)
            // console.log(this.moves);    
        }

        return this.moves
    }
}