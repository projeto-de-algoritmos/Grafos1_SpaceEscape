class Weapon {
    constructor(game, weaponName) {
        this.game = game
        this.bullets = game.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.name = weaponName;
        this.ready = true;
        game.weapons.push(this);
        this.counter = 10;
        switch(weaponName) {
            case 'pistol':
                console.log(weaponName)
                this.damage = 5;
                this.fireLag = 20;
                this.counter = 10;
            break;
        }
    }

    fire(shooter, target) {
        if(this.ready) {
            var gunshot = this.game.sound.add('gunshot')
            gunshot.play()
            var bullet = new Bullet(this.game, this.damage)
            this.bullets.add(bullet.entity)
            this.ready = false;
            this.counter = 0;
            
            if (bullet.entity) {
                bullet.fire(shooter, target);
                
                return bullet
            }
        }
    }

    update() {
        this.counter += 1;
        if(this.counter >= this.fireLag) {
            this.ready = true;
        }
    }
}