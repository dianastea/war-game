import Phaser from 'phaser'; 

export default class Piece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key)
        this.scene = scene 
        this.scene.add.existing(this)
        this.setData('type', type)
    }

    updatePosition(v, h) {
        this.setData('boardV', v)
        this.setData('boardH', h)
        this.x = 50+h*100
        this.y = 50+v*100
    }

    possibleMoves() {
        let pm = [] 
        let h = this.getData('boardH')
        let v = this.getData('boardV')

        // apm (all possible moves) in order of v, h, "n for normal move, a for attacking move"
        if (this.getData('type') == 'BlackPiece') {
            var apm = [[0, -1, 'n'], [-2, -2, 'a'], [2, -2, 'a']]
        }
        else {
            var apm = [[0, 1, 'n'], [-2, 2, 'a'], [2, 2, 'a']]
        }

        for (let i = 0; i < apm.length; i ++ ) {
            let curr = apm[i] // movement 
            let coor = [h+curr[0], v+curr[1], curr[2] == 'a'] // coordinates if piece moved 
            
            // checks that the move is in bounds 
            if (coor[0] >= 0 && coor[0] < this.scene.board[0].length && coor[1] >= 0 && coor[1] < this.scene.board.length) {
                
                let potential = this.scene.board[coor[1]][coor[0]] // note the switch in coordinates because the board array is reverse of the actual coordinates
                if (potential == 0 && curr[2] == 'n') {
                    pm.push(coor)
                } else if (potential == 0 && curr[2] == 'a') {
                    // attacking spot, check if there's a pawn to attack 
                    let a = apm[i][0] == -2 ? -1 : 1 
                    let b = this.getData('type') == 'BlackPiece' ? -1 : 1
                    if (h+a > 0 && v+b > 0 && h+a < this.scene.board[0].length && v+b < this.scene.board.length) {
                        let victim = this.scene.board[v+b][h+a]
                        
                        if (victim != 0 && victim.getData('type') != this.getData('type')) {
                            pm.push(coor) 
                        }
                    }
                    

                }
            }
            
        }
        return pm 
    }

    
}