class Enemy {
	constructor(game, x = 0, y = 0, player = null) {
		this.entity = game.physics.add.sprite(x, y, 'spr_enemy');
		this.entity.setCollideWorldBounds(true);
		this.target = player;
		this.game = game;
	}
	
	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.game.physics.velocityFromRotation(this.entity.rotation, 200, this.entity.body.velocity);
	}
	
	update() {
		followTarget();
	}
}