import Piece from "../piece"; 

export default class Queen extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Queen', color, healthbar); 
        
        // this.health = 
        // this.strength =
        this.moves = [] 

        // this.moves = this.moves.concat(this.attackMove())


    }


}