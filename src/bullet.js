class Bullet extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, 'bullet');
        this.entity = config.scene.add.existing(this).setDisplaySize(16, 8);

        this.entity.speed = 1;
        this.entity.born = 0;
        this.entity.direction = 0;
        this.entity.xSpeed = 0;
        this.entity.ySpeed = 0;
        this.entity.setSize(12, 12, true);
    }

    fire(shooter, target) {
        this.entity.setPosition(shooter.getEntity().x, shooter.getEntity().y); // Initial position
        this.entity.direction = Math.atan((target.getEntity().x - this.entity.x) / (target.getEntity().y - this.entity.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.getEntity().y >= this.entity.y) {
            this.entity.xSpeed = this.entity.speed * Math.sin(this.entity.direction);
            this.entity.ySpeed = this.entity.speed * Math.cos(this.entity.direction);
        }
        else {
            this.entity.xSpeed = -this.entity.speed * Math.sin(this.entity.direction);
            this.entity.ySpeed = -this.entity.speed * Math.cos(this.entity.direction);
        }

        this.entity.rotation = shooter.getEntity().rotation; // angle bullet with shooters rotation
        this.entity.born = 0; // Time since new bullet spawned
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
        this.entity.x += this.entity.xSpeed * delta;
        this.entity.y += this.entity.ySpeed * delta;
        this.entity.born += delta;
        if (this.entity.born > 1800) {
            this.entity.setActive(false);
            this.entity.setVisible(false);
        }
    }
    getEntity() {
        return this.entity;
    }
}