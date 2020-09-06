class Item {
    // entity = null
    constructor(game, x, y, image) {
        this.game = game
        this.entity = game.physics.add.image(x, y, image);
    }

createOverlap(player, weapon) {
    this.game.physics.add.overlap(this.entity, player.entity, () => {
        player.pickupWeapon(new Weapon(this.game));
        this.entity.destroy()
    })
}

    
}