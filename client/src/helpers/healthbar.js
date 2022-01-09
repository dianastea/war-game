export default class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        // super(scene, x-25, y+25, x + ' ' + y)
        this.x = x-25;
        this.y = y+25;
        this.value = 100;
        this.p = 36 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x + 5, this.y - 5, 40, 10);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 7, this.y - 3, 36, 6);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else if (this.value < 70) {
            this.bar.fillStyle(0xffff00);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

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