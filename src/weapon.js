class Weapon {
    constructor(game, weaponName) {
        this.game = game
        this.bullets = game.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.name = weaponName;
        this.ready = true;
        game.weapons.push(this);
        switch(weaponName) {
            case 'mp5':
                this.sound = '9mmSound';
                this.automatic = true;
				this.damage = 20;
                this.fireLag = 100;
                this.penetration = 0;
                this.calliber = '9mm'
                break;
            case '12':
                this.sound = '12Sound';
				this.damage = 20;
                this.fireLag = 500;
                this.penetration = 0;
                this.calliber = '9mm'
                break;
			case 'mouser':
                this.sound = '9mmSound';
				this.damage = 20;
                this.fireLag = 100;
                this.penetration = 0;
                this.calliber = '9mm'
				break;
			case 'ak47':
                this.sound = '762Sound';
                this.automatic = true;
				this.damage = 50;
				this.fireLag = 200;
                this.penetration = 2;
                this.calliber = 'bullet'
				break;
        }
        this.lastFired = Date.now() - this.fireLag - 1
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
                    this.lastFired = Date.now()
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
                this.lastFired = Date.now()
                    return bullets;
            }
        }
    }

    update() {
        if(Date.now() - this.lastFired >= this.fireLag) {
            this.ready = true;
        }
    }
}