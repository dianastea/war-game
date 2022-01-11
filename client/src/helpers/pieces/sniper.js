import Piece from "../piece"; 

export default class Sniper extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Sniper', color, healthbar); 
        this.moves = [] 
        this.setScale(1, 1)
        this.attack_radius = 5 
    }


}