class Enemy {
	constructor(game, x = 0, y = 0, player = null) {
		this.entity = game.physics.add.sprite(x, y, 'spr_enemy');
		this.entity.setCollideWorldBounds(true);
		this.target = player;
	}
}