import Piece from "./piece"; 

export default class BlackPiece extends Piece {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'BlackPiece'); 
        this.setData('boardV', 0)
        this.setData('boardH', 0)
        this.setTexture('blackPawn')

    }

}