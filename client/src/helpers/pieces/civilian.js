import Piece from "../piece"; 

export default class Civilian extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Civilian', color, healthbar); 
        this.moves = [] 
        this.attack_radius = 0 
        this.strength = 0 

    }

    createPotion() {
        this.scene.color ? this.scene.whitePotionBar.increase(10) : this.scene.blackPotionBar.increase(10)
    }


}