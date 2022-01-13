import Phaser from "phaser";
import Game from "./scenes/game"; 
import SceneMainMenu from "./scenes/menu"; 

const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;

const BASE_ASSET_PATH = "src/assets/";

const phaserConfig = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: WINDOW_WIDTH,
	height: WINDOW_HEIGHT,
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

const infoTextConfig = {
	color: '#d0c600',
	fontFamily: 'sans-serif',
	fontSize: '30px',
	lineHeight: 1.3,
	align: 'center',
}

const infoPotionTextConfig = {
	color: '#ffffff',
	fontFamily: 'sans-serif',
	fontSize: '10px',
	lineHeight: 1,
	align: 'center',
}

export {
	phaserConfig,
	infoTextConfig,
	infoPotionTextConfig,
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	SPRITE_WIDTH,
	SPRITE_HEIGHT,
	BASE_ASSET_PATH,
};