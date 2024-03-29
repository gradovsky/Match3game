let loadState = {
preload: function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.load.image("background", "images/backgrounds/background.jpg");
        game.load.image("logo", "images/donuts_logo.png");
        game.load.image("donut", "images/donut.png");
        game.load.image("donutShadow", "images/big-shadow.png");
        game.load.image("play", "images/btn-play.png");
        game.load.image("btnSfx", "images/btn-sfx.png");
        game.load.image("tutorial", "images/tutorial.png");
        game.load.image('redDonut', 'images/game/gem-01.png');
        game.load.image('blueDonut', 'images/game/gem-02.png');
        game.load.image('greenDonut', 'images/game/gem-03.png');
        game.load.image('cyanDonut', 'images/game/gem-04.png');
        game.load.image('yellowDonut', 'images/game/gem-05.png');
        game.load.image('purpleDonut', 'images/game/gem-06.png');
        game.load.image('scoreBar', 'images/bg-score.png');
        game.load.image('timeUp', 'images/text-timeup.png');
        game.load.image('playBtn', 'images/btn-play.png');
        game.load.image('particle_ex1', 'images/particles/particle_ex1.png');
        game.load.image('particle_ex2', 'images/particles/particle_ex2.png');
        game.load.image('particle_ex3', 'images/particles/particle_ex3.png');
        game.load.audio('backgroundMusic', 'audio/background.mp3');
        game.load.audio('audioKill', 'audio/kill.mp3');
},
create: function() {
    game.state.start('play')
},
};