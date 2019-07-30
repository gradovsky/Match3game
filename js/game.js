let game = new Phaser.Game(800, 960, Phaser.CANVAS, null);
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);
game.state.start('boot');