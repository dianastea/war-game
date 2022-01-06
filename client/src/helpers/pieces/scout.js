import Piece from "../piece"; 

export default class Scout extends Piece {
    
    constructor(scene, x, y, color, key) {
        super(scene, x, y, key, color + 'Rook', color); 

        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 
        for (let i = 1; i < 4; i++) {
            this.moves.push([row_dir*i, 0, 'normal'])
        }
        this.moves = this.moves.concat(this.attackMove())

    }

}