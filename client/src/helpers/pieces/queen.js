import Piece from "../piece"; 

export default class Queen extends Piece {
    
    constructor(scene, x, y, color, key) {
        super(scene, x, y, key, color + 'Queen', color); 

        this.moves = [] 
        let row_dir = [0, -3, 3]
        let col_dir = [0, -3, 3]
        for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j++) {
               if (!(row_dir[i] == 0 && col_dir[j] == 0)) 
                this.moves.push([row_dir[i], col_dir[j], 'normal'])
                
            }
        }
        this.moves = this.moves.concat(this.attackMove())



    }

}