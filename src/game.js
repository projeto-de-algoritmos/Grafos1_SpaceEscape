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
var layer2;
var layer3;

function preload() {
	this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('spr_target', 'assets/spr_target.png');
	
	this.load.image('terrain', 'assets/terrain.png');
	this.load.tilemapTiledJSON('map', 'assets/test_tile_map.json');
}

function create() {
	var map = this.make.tilemap({ key: 'map' });
	var tileset = map.addTilesetImage('terrain');
	var layer = map.createStaticLayer('Background', tileset, 0, 0);
	layer2 = map.createStaticLayer('Borders', tileset, 0, 0);
	layer3 = map.createStaticLayer('Plataforms', tileset, 0, 0);
	layer3.setCollisionBetween(0, 999);
	layer2.setCollisionBetween(0,999);
	
	dummy_target = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'spr_target');
	test_enemy = new Enemy(this, 200, 300, dummy_target, layer3);
	
	this.physics.add.collider(test_enemy.entity, layer3);
	this.physics.add.collider(test_enemy.entity, layer2);
	
	this.input.on('pointermove', (e) => {
		dummy_target.x = e.position.x;
		dummy_target.y = e.position.y;
	});
}

function update() {
	//console.log(game.physics)
	test_enemy.update();
}