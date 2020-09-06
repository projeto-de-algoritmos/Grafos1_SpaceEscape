var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
	loaderAsync: false
};

var game = new Phaser.Game(config);
var current_stage;
var enemies = [];
var camera;

function preload() {
	this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('spr_target', 'assets/spr_target.png');
    this.load.image('bullet', 'assets/bullet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('dude', 'assets/dude.png');
    this.load.image('sight', 'assets/sight.png');
	
	//Dynamic loading is async and is pending a solution.
	this.load.tilemapTiledJSON('test_stage', 'src/stages/test_stage.json');
	this.load.json('test_stage_info', `src/stages/test_stage_info.json`);
	this.load.tilemapTiledJSON('stage1', 'src/stages/stage1.json');
	this.load.json('stage1_info', `src/stages/stage1_info.json`);
	this.load.tilemapTiledJSON('stage2', 'src/stages/stage2.json');
	this.load.json('stage2_info', `src/stages/stage2_info.json`);
	this.load.tilemapTiledJSON('stage3', 'src/stages/stage3.json');
	this.load.json('stage3_info', `src/stages/stage3_info.json`);
	
	this.load.image('terrain', 'assets/terrain.png');
	this.load.image('tilemap', 'assets/tilemap.png');
}

function loadStage(stage_name, scene) {
	current_stage = new Stage(scene, stage_name);
	player = new Player(scene, 'dude', current_stage.spawn_point.x, current_stage.spawn_point.y);
	
	current_stage.enemies.forEach((position) => {
		enemies.push(new Enemy(scene, position.x, position.y, player.entity, current_stage.wall_layer));
	});
}

function create() {
	loadStage('stage3', this)

    player.pickupWeapon(new Weapon(this))
	sight = new Sight(this)

	camera = this.cameras.main;
    camera.startFollow(player.entity)
    
	this.physics.add.collider(player.entity, current_stage.wall_layer);
	
    game.canvas.addEventListener('mousedown', function () {
		game.input.mouse.requestPointerLock();
    });
	
    this.input.on('pointermove', function (e) {
		
		if (this.input.mouse.locked)
        {
			sight.entity.x += e.movementX;
            sight.entity.y += e.movementY;
        }
	}, this);
	
    this.input.on('pointerdown', function (pointer, time, lastFired) {
        if (player.entity.active === false)
            return;
        var bullet = null;
        if(player.getWeapon()) {
            bullet = player.shoot(player, sight)
        }
			
        if (bullet)
        {
            bullet.fire(player, sight);
			enemies.forEach((enemy) => {
				this.physics.add.collider(enemy.entity, bullet, () => enemy.getHit(enemy.entity));
			});
        }
    }, this);

}

function update() {
    player.setRotation(Phaser.Math.Angle.Between(player.entity.x, player.entity.y, sight.entity.x, sight.entity.y));
    player.update()

	sight.entity.x += player.entity.body.deltaXFinal();
	sight.entity.Y += player.entity.body.deltaYFinal();
    
	enemies.forEach((enemy, index) => {
		if(!enemy.isAlive())
			enemies.splice(index, 1);
		else
			enemy.update(player, current_stage);
	});
}