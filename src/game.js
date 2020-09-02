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
        this.setPosition(shooter.getEntity().x, shooter.getEntity().y); // Initial position
        this.direction = Math.atan( (target.getEntity().x-this.x) / (target.getEntity().y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.getEntity().y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.getEntity().rotation; // angle bullet with shooters rotation
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
    // player = this.physics.add.sprite(640, 360, 'gun');
    player = new Player(this)
    sight = new Sight(this)
    // sight = this.physics.add.sprite(800, 700, 'sight').setDisplaySize(64, 64);

    map.setOrigin(0, 0).setDisplaySize(1280, 720);
    // sight.setDisplaySize(64, 64).setCollideWorldBounds(true);

    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            sight.getEntity().x += pointer.movementX;
            sight.getEntity().y += pointer.movementY;
        }
    }, this);

    this.input.on('pointerdown', function (pointer, time, lastFired) {
        if (player.getEntity().active === false)
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
    var distX = sight.getEntity().x-player.getEntity().x; // X distance between player & sight
    var distY = sight.getEntity().y-player.getEntity().y; // Y distance between player & sight

    // Ensures sight cannot be moved offscreen (player follow)
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
    // console.log(Phaser.Math.Angle.Between(player.get_x(), player.get_y(), sight.x, sight.y))
    player.setRotation(Phaser.Math.Angle.Between(player.getEntity().x, player.getEntity().y, sight.getEntity().x, sight.getEntity().y));
    player.update()

    sight.setVelocityX(player.getEntity().body.velocity.y)
    sight.setVelocityY(player.getEntity().body.velocity.y)
    // sight.body.velocity.x = player.getEntity().body.velocity.x;
    // sight.body.velocity.y = player.getEntity().body.velocity.y;
}