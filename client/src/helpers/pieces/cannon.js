import Piece from "../piece"; 

export default class Cannon extends Piece {
    
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Cannon', color, healthbar); 
        this.moves = [] 
        this.setScale(1, 1);
        this.attack_radius = 1 
        this.turns_to_shoot = 1

        if (this.scene.color != (color != 'black')) {
            this.healthbar.bar.setVisible(false)
            this.setVisible(false)
        }

    }
    
    fire() {
        if (this.turns_to_shoot == 0) {
            console.log("fire!")
            this.attackMoves().forEach((move) => {
                this.attack(move);
            })
            this.turns_to_shoot = 2
        } else {
            console.log("fire: waiting")
            this.turns_to_shoot -= 1
        }
    }

}