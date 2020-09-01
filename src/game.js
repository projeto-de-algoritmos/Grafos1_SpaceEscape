var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 1200,
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

function preload() {}

function create() {}

function update() {}