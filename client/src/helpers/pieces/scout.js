import Piece from "../piece"; 

export default class Scout extends Piece {
    
    constructor(scene, x, y, color, key) {
        super(scene, x, y, key, color + 'Rook', color); 

        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 
        for (let i = 1; i < 4; i++) {
            this.moves.push([row_dir*i, 0, 'normal'])
        }
        this.moves.push([row_dir*2, -2, 'attack', [row_dir*1, -1]])
        this.moves.push([row_dir*2, 2, 'attack', [row_dir*1, 1]])
    }

}