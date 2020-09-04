class Weapon {
    constructor(game) {
        this.game = game
        this.bullets = game.physics.add.group({ classType: Bullet, runChildUpdate: true });
    }

    fire(shooter, target) {
        var bullet = new Bullet({scene: this.game})
        // var bullets = this.game.physics.add.group({ classType: Bullet, runChildUpdate: true });
		this.bullets.add(bullet.getEntity())

        if (bullet.getEntity())
        {
            bullet.fire(shooter, target);

            return bullet.getEntity()
            // this.game.physics.add.collider(test_enemy.getEntity(), bullet.getEntity(), () => test_enemy.getHit(test_enemy.getEntity()));
        }
    }
}