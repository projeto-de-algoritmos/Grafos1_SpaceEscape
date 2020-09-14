class Weapon {
    constructor(game, weaponName) {
        this.game = game
        this.bullets = game.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.name = weaponName;
        this.ready = true;
        game.weapons.push(this);
        this.counter = 10;
        switch(weaponName) {
            case 'mp5':
                this.sound = '9mmSound';
                this.automatic = true;
				this.damage = 5;
                this.fireLag = 5;
                this.counter = 10;
                this.penetration = 0;
                this.calliber = '9mm'
                break;
            case '12':
                this.sound = '12Sound';
				this.damage = 20;
                this.fireLag = 50;
                this.counter = 10;
                this.penetration = 0;
                this.calliber = '9mm'
                break;
			case 'mouser':
                this.sound = '9mmSound';
				this.damage = 20;
                this.fireLag = 10;
                this.counter = 10;
                this.penetration = 0;
                this.calliber = '9mm'
				break;
			case 'ak47':
                this.sound = '762Sound';
                this.automatic = true;
				this.damage = 50;
				this.fireLag = 6;
				this.counter = 5;
                this.penetration = 5;
                this.calliber = 'bullet'
				break;
        }
    }

    fire(shooter, target) {
        if(this.ready) {
            var gunshot = this.game.sound.add(this.sound)
            gunshot.play()
            if(this.name != '12') {
                var bullet = new Bullet(this.game, this.damage, this.penetration, this.calliber)
                this.bullets.add(bullet.entity)
        
                if (bullet.entity) {
                    bullet.fire(shooter, target);
                    
                    this.ready = false;
                    this.counter = 0;
                    return [bullet]
                }
            } else {
                var rotationBias = -0.15;
                var bullets = [];
                for(var i=0; i<5; i++) {
                    var bullet = new Bullet(this.game, this.damage, this.penetration, this.calliber)
                    this.bullets.add(bullet.entity)
                    bullets.push(bullet)
                    if (bullet.entity) {
                        bullet.fire(shooter, target, rotationBias += 0.05);   
                    }
                    
                }
                this.ready = false;
                this.counter = 0;
                    return bullets;
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