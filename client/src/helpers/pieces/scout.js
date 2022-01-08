import Piece from "../piece"; 

export default class Scout extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Rook', color, healthbar); 

        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 

        

        // this.moves = this.moves.concat(this.attackMove())

    }
}