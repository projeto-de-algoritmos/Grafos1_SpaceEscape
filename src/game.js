var Main_Menu = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage1() {
		Phaser.Scene.call(this, {key: 'main_menu'});
	},
	
	preload: function() {
		this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('spr_target', 'assets/spr_target.png');
		this.load.image('bullet', 'assets/bullet.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('dude', 'assets/dude.png');
		this.load.image('sight', 'assets/sight.png');
			
		this.load.image('terrain', 'assets/terrain.png');
		this.load.image('tilemap', 'assets/tilemap.png');
		this.load.image('main_menu_bg', 'assets/menu_background.png');
		
		this.load.audio('focus_move', 'assets/focus_move.mp3');
		this.load.audio('confirm', 'assets/confirm.mp3');
	},
	
	create: function() {
		bg = this.add.image(0, 0, 'main_menu_bg',).setOrigin(0);
		start_game = this.add.text(640, 510, 'START GAME', {fontFamily: '"Impact"', fontSize: 50, color: "#361717"}).setOrigin(0.5);
		dont_start = this.add.text(640, 585, "DON'T START", {fontFamily: '"Impact"', fontSize: 50, color: "#361717"}).setOrigin(0.5);
		conf = this.sound.add('confirm');
		focus_move = this.sound.add('focus_move');
		
		start_game.setInteractive();
		dont_start.setInteractive();
		
		start_game.on("pointerover", () => {
			start_game.setColor("#b1a9af");
			focus_move.play();
		});
		
		start_game.on("pointerout", () => {
			start_game.setColor("#361717");
		});
		
		start_game.on("pointerup", () => {
			conf.play();
			this.scene.start('st_1');
			this.scene.stop('main_menu');
		});
		
		dont_start.on("pointerover", () => {
			dont_start.setColor("#b1a9af");
			focus_move.play();
		});
		
		dont_start.on("pointerout", () => {
			dont_start.setColor("#361717");
		});
		
		dont_start.on("pointerup", () => {
			conf.play();
		});
	}
});

var Stage1 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage1() {
		Phaser.Scene.call(this, {key: 'st_1'});
	},
	
	preload: function() {		
		this.load.tilemapTiledJSON('stage1', 'src/stages/stage1.json');
		this.load.json('stage1_info', `src/stages/stage1_info.json`);
	},
	
	create: function() {		
		loadStage('stage1', this);
		create(this);
	},
	
	update: function() {update(this)}
});

var Stage2 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage1() {
		Phaser.Scene.call(this, {key: 'st_2'});
	},
	
	preload: function() {
		this.load.tilemapTiledJSON('stage2', 'src/stages/stage2.json');
		this.load.json('stage2_info', `src/stages/stage2_info.json`);
	},
	
	create: function() {
		loadStage('stage2', this);
		create(this);
	},
	
	update: function() {update(this)}
});

var Stage3 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage1() {
		Phaser.Scene.call(this, {key: 'st_3'});
	},
	
	preload: function() {
		this.load.tilemapTiledJSON('stage3', 'src/stages/stage3.json');
		this.load.json('stage3_info', `src/stages/stage3_info.json`);
	},
	
	create: function() {
		loadStage('stage3', this);
		create(this);
	},
	
	update: function() {update(this)}
});

function loadStage(stage_name, scene) {
	scene.stage = new Stage(scene, stage_name);
	scene.player = new Player(scene, 'dude', scene.stage.spawn_point.x, scene.stage.spawn_point.y);
	scene.enemies = [];
	
	scene.stage.enemies.forEach((position) => {
		scene.enemies.push(new Enemy(scene, position.x, position.y, scene.player.entity, scene.stage.wall_layer));
	});
}

function create(scene) {
    scene.player.pickupWeapon(new Weapon(scene))
	sight = new Sight(scene)

	camera = scene.cameras.main;
	camera.setZoom(2);
    camera.startFollow(scene.player.entity)
    
	scene.physics.add.collider(scene.player.entity, scene.stage.wall_layer);
	
    game.canvas.addEventListener('mousedown', function () {
		game.input.mouse.requestPointerLock();
    });
	
    scene.input.on('pointermove', function (e) {
		
		if (scene.input.mouse.locked)
        {
			sight.entity.x += e.movementX;
            sight.entity.y += e.movementY;
        }
	}, scene);
	
    scene.input.on('pointerdown', function (pointer, time, lastFired) {
        if (scene.player.entity.active === false)
            return;
        var bullet = null;
        if(scene.player.getWeapon()) {
            bullet = scene.player.shoot(scene.player, sight)
        }
			
        if (bullet)
        {
            bullet.fire(scene.player, sight);
			scene.enemies.forEach((enemy) => {
				scene.physics.add.collider(enemy.entity, bullet, () => enemy.getHit(enemy.entity));
			});
        }
    }, scene);

}

function update(scene) {
    scene.player.setRotation(Phaser.Math.Angle.Between(scene.player.entity.x, scene.player.entity.y, sight.entity.x, sight.entity.y));
    scene.player.update();

	sight.entity.x += scene.player.entity.body.deltaXFinal();
	sight.entity.y += scene.player.entity.body.deltaYFinal();
    
	scene.enemies.forEach((enemy, index) => {
		if(!enemy.isAlive())
			scene.enemies.splice(index, 1);
		else
			enemy.update(scene.player, scene.stage);
	});
}

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
    scene: [Main_Menu, Stage1, Stage2, Stage3],
	loaderAsync: false,
	pixelArt: true,
	backgroundColor: "#493743"
};

var game = new Phaser.Game(config);