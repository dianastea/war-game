import Phaser from 'phaser'; 

export default class NewPiece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type, color) {
        super(scene, x, y, key)
        this.scene = scene 
        this.scene.add.existing(this)
        this.setData({'type': type, 'color': color, 'row': 0, 'col': 0})
        
        let texture = color == 'black' ? 'blackPawn' : 'whitePawn'
        this.setTexture(texture)
    }

    updatePosition(row, col) {
        this.setData('row', row)
        this.setData('col', col)
        this.x = 50+col*100
        this.y = 50+row*100
    }

    possibleMoves() {
        let pm = [] 
        // BE CAREFUL, NOTHING BELOW WILL WORK BECAUSE it's using h, v not row, col
        let row = this.getData('row') 
        let col = this.getData('col')

        let apm = this.moves // NEED TO CREATE 
        console.log('apm',apm)
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
                    console.log('victim', victim)
                    console.log('bounds check and 0 check', this.inBounds(victim_r, victim_c) && victim != 0, 'color check', this.getData('color'))
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