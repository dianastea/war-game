import Piece from "../piece"; 

export default class Soldier extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Pawn', color, healthbar); 
        this.setScale(1, 1)
        this.attack_radius = 5 
        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 
        this.moves.push([row_dir, 0, 'normal'])
    }

}