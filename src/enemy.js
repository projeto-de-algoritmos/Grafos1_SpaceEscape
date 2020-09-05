class Enemy {
	constructor(game, x = 0, y = 0, player = null, collision_layer = null) {
		this.entity = game.physics.add.sprite(x, y, 'spr_enemy');
		this.entity.setCollideWorldBounds(true);
		this.target = player;
		this.game = game;
		this.collision_layer = collision_layer;
		this.health = 5
	}
	
	getHit(entity) {
		this.health -= 1;
		console.log('alive', this.health)
		if(this.health <= 0 ) {
			console.log('dead')
			entity.destroy()
		}
	}
	
	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.game.physics.velocityFromRotation(this.entity.rotation, 200, this.entity.body.velocity);
	}
	
	followPath(player, stage){
		// var thisVertex = stage.floor_graph.getVertex(thisTile.x + (thisTile.y * stage.floor_layer.layer.width))
		// var playerVertex = stage.floor_graph.getVertex(playerTile.x + (playerTile.y * stage.floor_layer.layer.width))
		// console.log(playerTile.x + (playerTile.y * stage.floor_layer.layer.width))
		// console.log(thisNode, playerNode, stage.floor_graph.BFSShortestPath(thisNode, playerNode))
		this.entity.body.setVelocityX(0);
		this.entity.body.setVelocityY(0);
	}
	
	getInput() {
		if(!cast_ray_into_tilemap(this.entity.x, this.entity.y, this.target.x, this.target.y, this.collision_layer).length)
		return 2;
		else if(1)
		return 1;
		return 0;
	}
	
	update(player, stage) {
		var thisTile = stage.map.getTileAtWorldXY(this.entity.x, this.entity.y)
		var playerTile = stage.map.getTileAtWorldXY(player.entity.x, player.entity.y)
		var thisNode = thisTile.x + (thisTile.y * stage.floor_layer.layer.width)
		var playerNode = playerTile.x + (playerTile.y * stage.floor_layer.layer.width)
		stage.floor_graph.BFSShortestPath(thisNode, playerNode)
		switch(this.getInput()) {
			case 0:
				break;
			case 1:
				this.followPath(player, stage);
				break;
			case 2:
				this.followTarget();
				break;
		}
	}

	isAlive() {
		if(this.health > 0) {
			return true
		}
		return false
	}
}