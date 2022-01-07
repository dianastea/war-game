import Phaser from 'phaser'; 

export default class Piece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type, color) {
        super(scene, x, y, key)
        this.scene = scene 
        this.strength = 2
        this.health = 2
        this.attack_radius = 1 

        this.scene.add.existing(this)
        this.setData({'type': type, 'color': color, 'row': 0, 'col': 0})
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
        if (victim.health == 0) {
            this.scene.board[vr][vc] = 0 
            victim.destroy(); 
            this.scene.socket.emit('destroy', this.scene.color, vr, vc)
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
        let pm = [] 
        // BE CAREFUL, NOTHING BELOW WILL WORK BECAUSE it's using h, v not row, col
        let row = this.getData('row') 
        let col = this.getData('col')

        let apm = this.moves // NEED TO CREATE 
        if (flag) console.log('apm',apm)
        for (let i = 0; i < apm.length; i ++ ) {
            let move = apm[i]  
            let ifMoved = [row+move[0], col+move[1], move[2]] // coordinates if piece moved 
            
            // checks that the move is in bounds 
            if (this.inBounds(ifMoved[0], ifMoved[1])) {
                // conduct move 
                let boardSquare = this.scene.board[ifMoved[0]][ifMoved[1]]
                if (boardSquare == 0 && move[2] == 'normal') {
                    pm.push(ifMoved)
                } 
            }
            
        }

        return pm 
    }

    // should be moved to board.js 
    inBounds(row, col) {
        return row >= 0 && col >= 0 && row < this.scene.board.length && col < this.scene.board[0].length 
    }

    
}