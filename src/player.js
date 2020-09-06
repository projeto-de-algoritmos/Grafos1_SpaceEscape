class Player {
    weapon = null
    constructor(game, image, x=0, y=0) {
        this.game = game
        this.entity = this.game.physics.add.sprite(x, y, image);
        this.entity.setOrigin(0.5, 0.5).setDisplaySize(48, 48).setCollideWorldBounds(true).setDrag(500, 500);
		this.velocity = 200;

        this.moveKeys = this.game.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    shoot(player, sight) {
        if(this.weapon) {
            return this.weapon.fire(player, sight)
        }
    }

    getWeapon() {
        return this.weapon;
    }

    pickupWeapon(weapon) {
        this.weapon = weapon;
    }

    update() {
		let velocityX = 0;
		let velocityY = 0;
		
		if(this.moveKeys['right'].isDown)
			velocityX += this.velocity;
		
		if(this.moveKeys['left'].isDown)
			velocityX -= this.velocity;
		
		if(this.moveKeys['down'].isDown)
			velocityY += this.velocity;
		
		if(this.moveKeys['up'].isDown)
			velocityY -= this.velocity;
		
		this.entity.setVelocityY(velocityY);
		this.entity.setVelocityX(velocityX);
	}

    setRotation(rotation) {
        this.entity.rotation = rotation;
    }
}