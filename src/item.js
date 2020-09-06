class Item {
    entity = null
    constructor(game, x, y, image) {
        this.game = game
        this.entity = game.physics.add.image(x, y, image);
    }

    
}