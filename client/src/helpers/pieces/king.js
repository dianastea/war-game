import Piece from "../piece"; 

export default class King extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'King', color, healthbar); 
        this.setScale(1, 1);
        this.strength = 5
        this.move_radius = 3
        this.temp_moves = [[1, 0], [-1, 0], [0, 1], [0, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]] 

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