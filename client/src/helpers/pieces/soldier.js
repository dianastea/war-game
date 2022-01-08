import Piece from "../piece"; 

export default class Soldier extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Pawn', color, healthbar); 

        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 
        // move = [row_move, col_move, type, victim_coor (if attack)]
        this.moves.push([row_dir, 0, 'normal'])
        this.moves = this.moves.concat(this.attackMoves())
    }

}