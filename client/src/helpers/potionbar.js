import { infoPotionTextConfig } from "../config";

export default class PotionBar {

    constructor (scene, x, y, color)
    {
        this.x = x
        this.y = y 
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.value = 0;
        this.p = 36 / 100;
        this.scene = scene

        this.draw();

        scene.add.existing(this.bar);
        this.potionText = scene.add.text(x+5, y-20, 'Potion: ' + this.value, infoPotionTextConfig)
        
    }

    increase (amount)
    { 
        this.value += amount

        if (this.value > 100) {
            this.value = 100 
        }

        this.potionText.destroy()
        this.potionText = this.scene.add.text(this.x+5, this.y-20, 'Potion: ' + this.value, infoPotionTextConfig)
        this.draw()

    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();
        this.potionText.destroy()
        this.potionText = this.scene.add.text(this.x+5, this.y-20, 'Potion: ' + this.value, infoPotionTextConfig)

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x + 5, this.y - 5, 40, 10);

        //  Potion
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 7, this.y - 3, 36, 6);

        this.bar.fillStyle(0x8B2CCA);
        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 7, this.y - 3, d, 6);
    }

    setX(x) {
        this.x = x
    }

    setY(y) {
        this.y = y
    }
}