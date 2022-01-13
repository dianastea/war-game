import Piece from "../piece"; 

export default class Soldier extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Soldier', color, healthbar); 
        this.setScale(1, 1)
        this.attack_radius = 5 
        this.move_radius = 1
        this.temp_moves = [[1, 0], [-1, 0], [0, 1], [0, -1]] 
        let row_dir = color == 'black' ? -1 : 1 
        // this.moves.push([row_dir, 0, 'normal'])
    }

}