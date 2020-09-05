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
var test_enemy;
var current_stage;
var enemies = [];

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
	
	this.load.image('terrain', 'assets/terrain.png');
	this.load.image('tilemap', 'assets/tilemap.png');
}

function spawnEnemy(scene) {
    test_enemy = new Enemy(scene, 200, 300, player.getEntity(), current_stage.wall_layer);
	
	scene.physics.add.collider(test_enemy.getEntity(), current_stage.wall_layer);
    return test_enemy
}

function loadStage(stage_name, scene) {
	current_stage = new Stage(scene, stage_name);
	player = new Player(scene, 'dude', current_stage.spawn_point.x, current_stage.spawn_point.y);
	
	current_stage.enemies.forEach((position) => {
		enemies.push(new Enemy(scene, position.x, position.y, player.entity, current_stage.wall_layer));
	});
}

function create() {
	loadStage('stage1', this)

    player.pickupWeapon(new Weapon(this))
	sight = new Sight(this)

	var camera = this.cameras.main;
    camera.startFollow(player.getEntity())
    
	test_enemy = spawnEnemy(this)
	
	this.physics.add.collider(player.getEntity(), current_stage.wall_layer);
	
    game.canvas.addEventListener('mousedown', function () {
		game.input.mouse.requestPointerLock();
    });
	
    this.input.on('pointermove', function (e) {
		
		if (this.input.mouse.locked)
        {
			sight.getEntity().x += e.movementX;
            sight.getEntity().y += e.movementY;
        }
	}, this);
	
    this.input.on('pointerdown', function (pointer, time, lastFired) {
        if (player.getEntity().active === false)
            return;
        var bullet = null;
        if(player.getWeapon()) {
            bullet = player.shoot(player, sight)
        }
			
        if (bullet)
        {
            bullet.fire(player, sight);
            this.physics.add.collider(test_enemy.getEntity(), bullet, () => test_enemy.getHit(test_enemy.getEntity()));
        }
    }, this);

}

function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

function constrainsight(sight)
{
    var distX = sight.getEntity().x-player.getEntity().x;
    var distY = sight.getEntity().y-player.getEntity().y;

    if (distX > 800)
        sight.getEntity().x = player.getEntity().x+800;
    else if (distX < -800)
        sight.getEntity().x = player.getEntity().x-800;

    if (distY > 600)
        sight.getEntity().y = player.getEntity().y+600;
    else if (distY < -600)
        sight.getEntity().y = player.getEntity().y-600;
}

function update() {
    player.setRotation(Phaser.Math.Angle.Between(player.getEntity().x, player.getEntity().y, sight.getEntity().x, sight.getEntity().y));
    player.update()

    sight.setVelocityX(player.getEntity().body.velocity.x)
    sight.setVelocityY(player.getEntity().body.velocity.y)
    if(test_enemy.isAlive()) {
        test_enemy.update();
    } else {
        test_enemy = spawnEnemy(this)
    }
}