import Piece from "../piece"; 

export default class Soldier extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Pawn', color, healthbar); 
        this.setScale(0.08, 0.08)
        this.attack_radius = 5 
        this.moves = [] 
        // this.attack_radius = 1
        let row_dir = color == 'black' ? -1 : 1 
        // move = [row_move, col_move, type, victim_coor (if attack)]
        this.moves.push([row_dir, 0, 'normal'])
    }

}