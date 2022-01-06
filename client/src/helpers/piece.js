import Phaser from 'phaser'; 

export default class Piece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type, color) {
        super(scene, x, y, key)
        this.scene = scene 
        this.scene.add.existing(this)
        this.setData({'type': type, 'color': color, 'row': 0, 'col': 0})
        
        let texture = type 
        this.setTexture(texture)
    }

    updatePosition(row, col) {
        this.setData('row', row)
        this.setData('col', col)
        this.x = 50+col*100
        this.y = 50+row*100
    }

    attackMove() {
        // later should add restriction for who can only attack forward and who can attack back 
        let moves = [] 
        let row_dir = this.getData('color') == 'white' ? 1 : -1 
        moves.push([row_dir*2, -2, 'attack', [row_dir*1, -1]])
        moves.push([row_dir*2, 2, 'attack', [row_dir*1, 1]])
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
                } else if (boardSquare == 0 && move[2] == 'attack') {
                    
                    // find victim coordinates 
                    // check if victim in bounds, then this.scene.board[victim_coor] --> push victim_coor 
                    let [victim_r, victim_c] = [row+move[3][0], col+move[3][1]]
                    let victim = this.scene.board[victim_r][victim_c]
                    if (flag)
                        console.log('victim', victim, victim_r, victim_c)
                    // console.log('move', move)
                    if (this.inBounds(victim_r, victim_c) && victim != 0 && victim.getData('color') != this.getData('color')) {
                        pm.push([...ifMoved, victim_r, victim_c, victim])
                    }
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