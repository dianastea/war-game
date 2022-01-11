import Piece from "../piece"; 
import Cannon from "./cannon"; 

export default class Spy extends Piece {
    
    constructor(scene, x, y, color, key, healthbar) {
        super(scene, x, y, key, color + 'Spy', color, healthbar); 
        this.moves = [] 
        this.setScale(1, 1);
        this.attack_radius = 1 
        if (this.scene.color != (color != 'black')) {
            this.healthbar.bar.setVisible(false)
            this.setVisible(false)
        }
    }

    attack(move) {
        let victim = move[3]
        victim.setVisible(true)
        victim.healthbar.bar.setVisible(true)
        if (!victim.getData('type').includes('Cannon'))
        this.scene.socket.emit('setVisible', this.getData('row'), this.getData('col'))
    }

    attackMoves() {
        console.log('spy attacking')
        let moves = []  
        let [r,c] = [this.getData('row'), this.getData('col')]
        for (let i = r - this.attack_radius; i <= r + this.attack_radius; i++) {
            for (let j = c - this.attack_radius; j <= c + this.attack_radius; j++) {
                if (this.inBounds(i, j)) {
                    let victim = this.scene.board[i][j]
                    console.log(victim)
                    if (victim != 0 && victim.getData('color') != this.getData('color') && victim.getData('type').includes('Cannon')) {
                        moves.push(['attack', i, j, this.scene.board[i][j]])
                    }
                }
            }
        }
        return moves
    }

}