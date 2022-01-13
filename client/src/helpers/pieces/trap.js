import Piece from "../piece";

export default class Trap extends Piece {

	constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Trap', color, healthbar); 
		this.setScale(1,1);
		this.moves = [];

		if (this.scene.color != (color != 'black')) {
			this.healthbar.bar.setVisible(false)
			this.setVisible(false)
		}
	}

	show() {
		this.healthbar.bar.setVisible(true);
		this.setVisible(true);
	}
} 