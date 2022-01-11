'use strict';
let perlin = {
    rand_vect: function(){
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    },
    dot_prod_grid: function(x, y, vx, vy){
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.rand_vect();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    },
    smootherstep: function(x){
        return 6*x**5 - 15*x**4 + 10*x**3;
    },
    interp: function(x, a, b){
        return a + this.smootherstep(x) * (b-a);
    },
    seed: function(){
        this.gradients = {};
        this.memory = {};
    },
    get: function(x, y) {
        if (this.memory.hasOwnProperty([x,y]))
            return this.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dot_prod_grid(x, y, xf,   yf);
        let tr = this.dot_prod_grid(x, y, xf+1, yf);
        let bl = this.dot_prod_grid(x, y, xf,   yf+1);
        let br = this.dot_prod_grid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}
perlin.seed();

function getType(i, j, type, board) {
    let neighbors = getNeighbors(board, i, j)
    let locations = []
    console.log(i,j, neighbors)
    for(const [key, value] of Object.entries(neighbors)) {
        if(value.includes(type)) {
            locations.push(key)
        }
    }

    //Midmountain
    console.log(locations)
    let a = locations;
    let b = ['left', 'right', 'up', 'down']
    if(Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])) {
        return "mid" + type
    }
    else {
        
        var list1 = ["left", "right", "up", "down"], list2 = locations, dict2 = {};
        list2.forEach(function(item) {
            dict2[item] = true;
        });

        var result = list1.reduce(function(prev, current) {
            if (dict2.hasOwnProperty(current) === false) {
                prev.push(current);
            }
            return prev;
        }, [])

        return result.join('') + type
    }

}

function getNeighbors(myArray, i, j) {
    console.log(myArray)
    
    let up = myArray[i-1] === undefined ? undefined: myArray[i-1][j]
    let down = myArray[i+1] === undefined ? undefined: myArray[i+1][j]
    let neighborList = {"left": myArray[i][j-1], "right": myArray[i][j + 1] , "up": up, "down": down}
    let returnList = {}
    
    for (const [key, value] of Object.entries(neighborList)) {
        if(value !== undefined) {
            returnList[key] = value
        }
        else{
            returnList[key] = myArray[i][j]
        }
    }
    return returnList;
  }
export default class Board {

    constructor(height, width) {
        this.board = [...Array(16)].map(e => Array(16));

        for (let i = 0; i < 16; i += 1) {
            for (let j = 0; j < 16; j+= 1) {
                let perlinValue = perlin.get(i / 8, j / 8) * 10;
                
                if (perlinValue <= -2.7) {
                    this.board[i][j] = "mountain"
                }
                else if (perlinValue < 1.5 && perlinValue > -2.7) {
                    this.board[i][j] = "ground";
                }
                else if (perlinValue >= 1.5 && perlinValue < 2.5) {
                    this.board[i][j] = "ground";
                }
                else if (perlinValue > 2.5) {
                    this.board[i][j] = "water";
                }
                if (i <= 2 || i >= 13) {
                    this.board[i][j] = "ground";
                }
                if (j == 6) {
                    this.board[i][j] = "ground";
                }
            }
        }

        //Do specific location processing
        for (let i = 0; i < 16; i += 1) {
            for (let j = 0; j < 16; j+= 1) {
                if(this.board[i][j] === "mountain") {
                    this.board[i][j] = getType(i,j, "mountain", this.board)
                }

                else if(this.board[i][j] === "water") {
                    this.board[i][j] = getType(i,j, "water", this.board)
                }

                else if(this.board[i][j] === "ground") {
                    this.board[i][j] = getType(i,j, "ground", this.board)
                }
            }
        }
        
        console.log(this.board)
    }
    

    getBoard() {
        return this.board
    }
}
