import Piece from "../piece"; 

export default class Sniper extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Sniper', color, healthbar); 
        this.setScale(1, 1)
        this.attack_radius = 5 
        this.move_radius = 1

        this.temp_moves = [] 

        for (let i = -1; i < 2; i++) {
            for (let j=-1; j < 2; j++) {
                this.temp_moves.push([i, j])
            }
        }
    }


}