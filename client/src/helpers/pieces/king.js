import Piece from "../piece"; 

export default class King extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'King', color, healthbar); 
        this.setScale(0.08, 0.08)
        this.strength = 5
        this.moves = [] 

    }
    
    destroyed() {
        console.log('destroyed function', this.attackMoves())
        this.attackMoves().forEach((move) => {
            this.attack(move)
        })
        this.healthbar.bar.destroy()
        this.destroy()
        
    }

}