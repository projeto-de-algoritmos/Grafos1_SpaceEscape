class Bullet extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, 'bullet');
        config.scene.add.existing(this).setDisplaySize(16, 8);

        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    }

    fire(shooter, target) {
        this.setPosition(shooter.getEntity().x, shooter.getEntity().y); // Initial position
        this.direction = Math.atan((target.getEntity().x - this.x) / (target.getEntity().y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.getEntity().y >= this.y) {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        this.rotation = shooter.getEntity().rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    enemyHitCallback(enemyHit, bulletHit) {
        console.log(enemyHit, bulletHit)
        // Reduce health of enemy
        console.log('asdo')
        // if (bulletHit.active === true && enemyHit.active === true) {
        //     // enemyHit.health = enemyHit.health - 1;
        //     // console.log("Enemy hp: ", enemyHit.health);

        //     // Kill enemy if health <= 0
        //     // if (enemyHit.health <= 0) {
        //     //     enemyHit.setActive(false).setVisible(false);
        //     // }

        //     // Destroy bullet
        //     bulletHit.setActive(false).setVisible(false);
        // }
    }

    update(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}