import Piece from "../piece"; 

export default class Queen extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Queen', color, healthbar); 
        this.setScale(0.10, 0.10)
        // this.attack_radius = 1

        this.moves = [] 

    }


}