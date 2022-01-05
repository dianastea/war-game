import Phaser from "phaser";
import Game from "./scenes/game"; 
import SceneMainMenu from "./scenes/menu"; 

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
        },
    },
    scene: [
        SceneMainMenu, 
        Game
    ], 
    pixelArt: true,
    roundPixels: true,
};

const game = new Phaser.Game(config);