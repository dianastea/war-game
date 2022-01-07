import Piece from "../piece"; 

export default class Queen extends Piece {
    
    
    constructor(scene, x, y, color, key) {
        super(scene, x, y, key, color + 'Queen', color); 
        
        // this.health = 
        // this.strength =
        this.moves = [] 
        for (let i = -3; i < 4; i ++) {
            for (let j = -3; j < 4; j++) {
               if (!(i == 0 && j == 0)) 
                this.moves.push([i, j, 'normal'])
                
            }
        }
        // this.moves = this.moves.concat(this.attackMove())


    }


}