import NewPiece from "../newPiece"; 

export default class Soldier extends NewPiece {
    constructor(scene, x, y, color, key) {
        super(scene, x, y, key, 'Soldier', color); 

        this.moves = [] 
        let row_dir = color == 'black' ? -1 : 1 
        // move = [row_move, col_move, type, victim_coor (if attack)]
        this.moves.push([row_dir, 0, 'normal'])
        this.moves.push([row_dir*2, -2, 'attack', [row_dir*1, -1]])
        this.moves.push([row_dir*2, 2, 'attack', [row_dir*1, 1]])
    }

}