import Piece from "../piece"; 

export default class Queen extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Queen', color, healthbar); 
        this.setScale(1, 1)
        this.temp_moves = [[1, 0], [-1, 0], [0, 1], [0, -1]] 
        this.move_radius = 1
    }


}