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
    }
};

var game = new Phaser.Game(config);
var test_enemy;
var dummy_target;
var test_stage;

function preload() {
	this.load.tilemapTiledJSON('map', 'assets/test_tile_map.json');
	this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('spr_target', 'assets/spr_target.png');
	this.load.image('terrain', 'assets/terrain.png');
    this.load.image('bullet', 'assets/bullet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('dude', 'assets/dude.png');
    this.load.image('sight', 'assets/sight.png');
}

function spawnEnemy(scene) {
    test_enemy = new Enemy(scene, 200, 300, player.getEntity(), test_stage.wall_layer);
	
	scene.physics.add.collider(test_enemy.getEntity(), test_stage.wall_layer);
    return test_enemy
}

function create() {
	test_stage = new Stage(this, 'map');	
    player = new Player(this, 'dude')
    player.pickupWeapon(new Weapon(this))
	sight = new Sight(this)

	var camera = this.cameras.main;
    camera.startFollow(player.getEntity())
    
	test_enemy = spawnEnemy(this)
	
	this.physics.add.collider(player.getEntity(), test_stage.wall_layer);
	
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