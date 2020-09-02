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

function preload() {
	this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('spr_target', 'assets/spr_target.png');
}

function create() {
	dummy_target = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'spr_target');
	test_enemy = new Enemy(this, 200, 300, dummy_target);
	
	this.input.on('pointermove', (e) => {
		dummy_target.x = e.position.x;
		dummy_target.y = e.position.y;
	});
}

function update() {
	//console.log(game.physics)
	test_enemy.update();
}