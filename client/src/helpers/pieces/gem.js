import Piece from "../piece";

export default class Gem extends Piece {

	constructor(scene, x, y, color, key, healthbar) {
		super(scene, x, y, key, color + 'Gem', color, healthbar);
		this.setScale(1, 1);
		this.moves = [];
		
		if (this.scene.color != (color != 'black')) {
			console.log('make invisible!')
			this.healthbar.bar.setVisible(false)
			this.setVisible(false)
		}
	}

	show() {
		this.healthbar.bar.setVisible(true);
		this.setVisible(true);
	}

}