import Piece from "../piece"; 

export default class Cannon extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Cannon', color, healthbar); 
        this.moves = [] 
        this.setScale(0.10, 0.10)
        this.attack_radius = 3 
        if (this.scene.color != (color != 'black')) {
            this.healthbar.bar.setVisible(false)
            this.setVisible(false)
        }

    }

}