class Player {
    constructor(game, image, x=0, y=0) {
        this.game = game
        this.entity = this.game.physics.add.sprite(425, 360, image);
        this.entity.setOrigin(0.5, 0.5).setDisplaySize(64, 64).setCollideWorldBounds(true).setDrag(500, 500);

        var entity = this.entity

        var moveKeys = this.game.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });
    
        // Enables movement of player with WASD keys
        this.game.input.keyboard.on('keydown_W', function (event) {7
            entity.setAccelerationY(-800);
        });
        this.game.input.keyboard.on('keydown_S', function (event) {
            entity.setAccelerationY(800);
        });
        this.game.input.keyboard.on('keydown_A', function (event) {
            entity.setAccelerationX(-800);
        });
        this.game.input.keyboard.on('keydown_D', function (event) {
            entity.setAccelerationX(800);
        });
    
        // Stops player acceleration on uppress of WASD keys
        this.game.input.keyboard.on('keyup_W', function (event) {
            if (moveKeys['down'].isUp)
                entity.setAccelerationY(0);
        });
        this.game.input.keyboard.on('keyup_S', function (event) {
            if (moveKeys['up'].isUp)
                entity.setAccelerationY(0);
        });
        this.game.input.keyboard.on('keyup_A', function (event) {
            if (moveKeys['right'].isUp)
                entity.setAccelerationX(0);
        });
        this.game.input.keyboard.on('keyup_D', function (event) {
            if (moveKeys['left'].isUp)
                entity.setAccelerationX(0);
        });

    }

    update() { }

    getEntity() {
        return this.entity;
    }

    setRotation(rotation) {
        this.entity.rotation = rotation;
    }
}