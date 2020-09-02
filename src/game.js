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

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the sight
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

function preload() {
    this.load.image('map', 'assets/map.jpg');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('gun', 'assets/gun.jpg');
    this.load.image('sight', 'assets/sight.jpg');
}

function create() {
    this.physics.world.setBounds(0, 0, 1280, 720);

    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    var map = this.add.image(0, 0, 'map');
    player = this.physics.add.sprite(640, 360, 'gun');
    sight = this.physics.add.sprite(800, 700, 'sight').setDisplaySize(64, 64);

    map.setOrigin(0, 0).setDisplaySize(1280, 720);
    player.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(500, 500);
    sight.setDisplaySize(64, 64).setCollideWorldBounds(true);

    moveKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    // Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp)
            player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp)
            player.setAccelerationX(0);
    });

    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            sight.x += pointer.movementX;
            sight.y += pointer.movementY;
        }
    }, this);

    this.input.on('pointerdown', function (pointer, time, lastFired) {
        if (player.active === false)
            return;

        // Get bullet from bullets group
        var bullet = playerBullets.get().setActive(true).setVisible(true).setDisplaySize(16, 8);

        if (bullet)
        {
            bullet.fire(player, sight);
            // this.physics.add.collider(enemy, bullet, enemyHitCallback);
        }
    }, this);

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });
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

// Ensures sight does not move offscreen
function constrainsight(sight)
{
    var distX = sight.x-player.x; // X distance between player & sight
    var distY = sight.y-player.y; // Y distance between player & sight

    // Ensures sight cannot be moved offscreen (player follow)
    if (distX > 800)
        sight.x = player.x+800;
    else if (distX < -800)
        sight.x = player.x-800;

    if (distY > 600)
        sight.y = player.y+600;
    else if (distY < -600)
        sight.y = player.y-600;
}

function update() {
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, sight.x, sight.y);

    // Rotates enemy to face towards player
    // enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

    //Make sight move with player
    sight.body.velocity.x = player.body.velocity.x;
    sight.body.velocity.y = player.body.velocity.y;
}