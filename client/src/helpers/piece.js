import Phaser from 'phaser'; 

export default class Piece extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key)
        this.scene = scene 
        this.scene.add.existing(this)
        this.setData('type', type)
    }
    // up (v-1, h)
    // diag (v-2, h-2) or (v-2, h+2)

    possibleMoves(flag) {
        let pm = [] 
        // apm in order of v, h
        if (this.getData('type') == 'BlackPiece') {
            var apm = [[0, -1, 'n'], [-2, -2, 'a'], [2, -2, 'a']]
        }
        else {
            var apm = [[0, 1, 'n'], [-2, 2, 'a'], [2, 2, 'a']]
        }

        let h = this.getData('boardH')
        let v = this.getData('boardV')
        if (flag) {
            console.log('h,v', h, v)
        }

        for (let i = 0; i < apm.length; i ++ ) {
            let curr = apm[i]
            let coor = [h+curr[0], v+curr[1], curr[2] == 'a'] 
            if (flag) {
                console.log('curr', curr, 'coor', coor)
            }
            if (coor[0] >= 0 && coor[0] < this.scene.board[0].length && coor[1] >= 0 && coor[1] < this.scene.board.length) {
                let potential = this.scene.board[coor[1]][coor[0]]
                console.log(potential)
                if (potential == 0 && curr[2] == 'n') {
                    pm.push(coor)
                } else if (potential == 0 && curr[2] == 'a') {
                    // attacking spot, check if there's a pawn to attack 
                    let a = apm[i][0] == -2 ? -1 : 1 
                    let b = this.getData('type') == 'BlackPiece' ? -1 : 1
                    console.log('a, b', a, b)
                    if (h+a > 0 && v+b > 0 && h+a < this.scene.board[0].length && v+b < this.scene.board.length) {
                        let victim = this.scene.board[v+b][h+a]
                        console.log('victim', victim)
                        if (victim != 0) {
                            console.log('victim Type', victim.getData('type'))
                        }
                        console.log('this type', this.getData('type'))
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