import Piece from "./piece"; 

export default class WhitePiece extends Piece {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'WhitePiece'); 
        this.setData('boardV', 0)
        this.setData('boardH', 0)
        this.setTexture('whitePawn')
    }

    
    // movePossibility 
    updatePosition(v, h) {
        this.setData('boardV', v)
        this.setData('boardH', h)
        this.x = 50+h*100
        this.y = 50+v*100
    }

}