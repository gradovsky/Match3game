let playState = {
    create: function() {
        this.timeUp = game.add.image(100,100, 'timeUp');
        this.add.image(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
        this.donutShadow = game.add.image(140,210,'donutShadow');
        this.donut = game.add.image(110,210,'donut');
        this.logo = game.add.image(110,100,'logo');
        this.game.add.tween(this.logo).to({y: 200}, 700, Phaser.Easing.Linear.In, true);
        this.playBtn = game.add.button(260,580,'play', this.play, this);
        this.game.add.tween(this.playBtn).to({y: 560}, 700, Phaser.Easing.Linear.In, true);
      
        this.music = game.add.audio('backgroundMusic');
        this.music.loop = true
        this.music.play();
        
        this.muteBtn = this.game.add.button(30, 820, 'btnSfx', this.toggleMute, this);
        this.muteBtn.fixedToCamera = true;
        if (!this.game.sound.mute) {
            this.muteBtn.tint = 16777215;
        } else {
            this.muteBtn.tint = 16711680;
        }

        this.tutorial = game.add.button(260,580, 'tutorial', this.tutorial, this);
        this.game.add.tween(this.tutorial).to({y:850},700, Phaser.Easing.Linear.In, true);
        this.tutorial.scale.setTo(0.3, 0.3);

        this.gemTypes = [
            'redDonut',
            'purpleDonut',
            'blueDonut',
            'greenDonut',
            'cyanDonut',
            'yellowDonut'
        ];
        this.activeGem1 = null;
        this.activeGem2 = null;
        this.canMove = false;
        this.gemSize = this.game.cache.getImage('redDonut').width;
        this.gems = this.game.add.group();

        this.gemGrid = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],

        ];
            this.playBtn.events.onInputDown.add(this.play, this);
            this.game.time.events.add(500, () => {
        });
            this.shouldStartTimeCount = false;
    },
    toggleMute: function() {
        if (!this.game.sound.mute) {
            this.game.sound.mute = true;
            this.muteBtn.tint = 16711680;
        } else {
            this.game.sound.mute = false;
            this.muteBtn.tint = 16777215;
        }
    },
 update: function () {
        if (this.shouldStartTimeCount && this.timeLeft === 0) {
            this.gameOver();
        }
        if (this.activeGem1 && !this.activeGem2) {
            let pointerX = this.game.input.x;
            let pointerY = this.game.input.y;

            let pointerPosX = Math.floor(pointerX / this.gemSize);
            let pointerPosY = Math.floor(pointerY / this.gemSize);

            let difX = (pointerPosX - this.startPosX);
            let difY = (pointerPosY - this.startPosY);

            if (pointerPosY < this.gemGrid[0].length && pointerPosX < this.gemGrid.length) {
                if ((Math.abs(difY) === 1 && difX === 0) || (Math.abs(difX) === 1 && difY === 0)) {
                    this.canMove = false;
                    this.activeGem2 = this.gemGrid[pointerPosX][pointerPosY];
                    this.swapGems();
                    this.game.time.events.add(500, () => this.checkMatching());
                }
            }
        }
    },
    play: function () {
        
        this.donut.destroy();
        this.donutShadow.destroy();
        this.playBtn.destroy();
        this.logo.destroy();
        this.timeUp.destroy();
        this.tutorial.destroy();
        text.destroy();
        this.startGame();

    },
    tutorial: function (){
        this.donut.destroy();
        this.donutShadow.destroy();
        this.logo.destroy();
        this.playBtn.destroy();
        this.tutorial.destroy();
        this.game.add.tween(this.playBtn).to({y: 750}, 700, Phaser.Easing.Linear.In, true);
        text = game.add.text(game.world.centerX, game.world.centerY, "- HOW TO PLAY -\nMake \na horizontal or vertical \nline to form \nthree or more donuts", { font: "65px Fredoka One", fill: "#ff0044", align: "center" });
        text.anchor.setTo(0.5, 0.5);
        this.playBtn = game.add.button(260,850,'play', this.play, this);
        
        
        
        },
    startGame: function () {

        this.shouldStartTimeCount = true;

        this.score = 0
        this.timeLeft = 10

        this.scoreBar = this.game.add.sprite(660, 900, 'scoreBar');
        this.scoreBar.anchor.setTo(0.5, 0.5);
        this.scoreBar.scale.setTo(0.8, 0.8);

        this.scoreString = this.game.add.text(660, 890, this.score.toString(), {font: '60px Fredoka One', fill: 'red'});
        this.scoreString.anchor.setTo(0.5, 0.5);

        this.timeLeftString = this.game.add.text(450, 890, this.timeLeft.toString(), {font: '40px Fredoka One', fill: 'red'},);
        this.timeLeftString.anchor.setTo(0.5, 0.5);
        this.fillTheGrid();
        this.timeInterval(false);
    },

    timeInterval: function (stop) {
        if (this.timeLeft >= 0 && !stop) {
            this.game.time.events.add(1000, () => {
                this.timeLeft -= 1;
                this.timeLeftString.setText(this.timeLeft.toString());
                stop = this.timeInterval(false);
            });
        } else return true;

    },

    fillTheGrid: function () {
        const length = this.gemGrid.length;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                this.gemGrid[i][j] = this.addGem(i, j);
            }
        }
        this.game.time.events.add(500, () => {
            this.checkMatching();
        });
    },

    addGem: function (i, j) {
        let randomN = Math.floor(Math.random() * (this.gemTypes.length - 1));
        const gemType = this.gemTypes[randomN];
        const gem = this.gems.create(i * this.gemSize + this.gemSize / 2, -10, gemType);

        this.game.add.tween(gem).to({y: j * this.gemSize + this.gemSize / 2}, 250, Phaser.Easing.Linear.In, true);
        gem.scale.setTo(1.3, 1.3);
        gem.anchor.setTo(0.5, 0.5);
        gem.inputEnabled = true;
        gem.type = gemType;
        gem.events.onInputDown.add(this.gemDown, this);

        return gem;
    },

    gemDown: function (gem) {
        if (this.canMove) {
            this.activeGem1 = gem;
            this.startPosX = (gem.x - this.gemSize / 2) / this.gemSize;
            this.startPosY = (gem.y - this.gemSize / 2) / this.gemSize;
        }
    },

    swapGems: function () {
        if (this.activeGem1 && this.activeGem2) {
            let gem1Pos = {
                x: (this.activeGem1.x - this.gemSize / 2) / this.gemSize,
                y: (this.activeGem1.y - this.gemSize / 2) / this.gemSize
            };
            let gem2Pos = {
                x: (this.activeGem2.x - this.gemSize / 2) / this.gemSize,
                y: (this.activeGem2.y - this.gemSize / 2) / this.gemSize
            };
            this.gemGrid[gem1Pos.x][gem1Pos.y] = this.activeGem2;
            this.gemGrid[gem2Pos.x][gem2Pos.y] = this.activeGem1;

            this.game.add.tween(this.activeGem1).to(
                {
                    x: gem2Pos.x * this.gemSize + this.gemSize / 2,
                    y: gem2Pos.y * this.gemSize + this.gemSize / 2
                },
                200,
                Phaser.Easing.Linear.In, true
            );
            this.game.add.tween(this.activeGem2).to(
                {
                    x: gem1Pos.x * this.gemSize + this.gemSize / 2,
                    y: gem1Pos.y * this.gemSize + this.gemSize / 2
                },
                200,
                Phaser.Easing.Linear.In, true
            );
        }
    },

    checkMatching: function () {
        const matches = this.getMatchingGems();

        if (matches.length > 0) {
            this.removeGems(matches, false);
            this.moveGemsDown();
            this.fillTheMisingGems();

            this.game.time.events.add(500, () => this.activeGemReset());
            this.game.time.events.add(500, () => this.checkMatching());
        } else {
            this.swapGems();
            this.game.time.events.add(500, () => {
                this.activeGemReset();
                this.canMove = true;
            });
        }

    },

    activeGemReset: function () {
        this.activeGem1 = null;
        this.activeGem2 = null;
    },

    getMatchingGems: function () {
        let matches = [];
        let gems = [];

        for (let i = 0; i < this.gemGrid.length; i++) {
            gems = [];
            for (let j = 0; j < this.gemGrid[i].length; j++) {
                if (j < this.gemGrid[i].length - 2) {
                    if (this.gemGrid[i][j] && this.gemGrid[i][j + 1] && this.gemGrid[i][j + 2]) {
                        if (this.gemGrid[i][j].type === this.gemGrid[i][j + 1].type && this.gemGrid[i][j + 1].type === this.gemGrid[i][j + 2].type) {
                            if (gems.length > 0) {
                                if (gems.indexOf(this.gemGrid[i][j]) === -1) {
                                    matches.push(gems);
                                    gems = [];
                                }
                            }
                            for (let x = 0; x < 3; x++) {
                                if (gems.indexOf(this.gemGrid[i][j + x]) === -1) {
                                    gems.push(this.gemGrid[i][j + x]);
                                }
                            }
                        }
                    }
                }
            }
            if (gems.length > 0) {
                matches.push(gems);
            }
        }

        for (let j = 0; j < this.gemGrid.length; j++) {
            gems = [];
            for (let i = 0; i < this.gemGrid[j].length; i++) {
                if (i < this.gemGrid[j].length - 2) {
                    if (this.gemGrid[i][j] && this.gemGrid[i + 1][j] && this.gemGrid[i + 2][j]) {
                        if (this.gemGrid[i][j].type === this.gemGrid[i + 1][j].type && this.gemGrid[i + 1][j].type === this.gemGrid[i + 2][j].type) {
                            if (gems.length > 0) {
                                if (gems.indexOf(this.gemGrid[i][j]) === -1) {
                                    matches.push(gems);
                                    gems = [];
                                }
                            }
                            for (let x = 0; x < 3; x++) {
                                if (gems.indexOf(this.gemGrid[i + x][j]) === -1) {
                                    gems.push(this.gemGrid[i + x][j])
                                }
                            }
                        }
                    }
                }
            }
            if (gems.length > 0) {
                matches.push(gems);
            }
        }

        return matches;
    },

    removeGems: function (matches, GameOver) {
        for (let i = 0; i < matches.length; i++) {
            for (let j = 0; j < matches[i].length; j++) {
                let gem = matches[i][j];

                this.score += 10;

                if (!GameOver) {
                    if (this.timeLeft < 100) {
                        this.timeLeft += 1;
                    }
                } else {
                }
                let gemPos = this.getGemPos(gem);
                this.gems.remove(gem);

                if (gemPos.i != -1 && gemPos.j != -1) {
                    this.gemGrid[gemPos.i][gemPos.j] = null;
                }
            }
        }
        this.scoreString.setText(this.score.toString());
    },

    getGemPos: function (gem) {
        let position = {i: -1, j: -1};
        for (let i = 0; i < this.gemGrid.length; i++) {
            for (let j = 0; j < this.gemGrid[i].length; j++) {
                if (gem === this.gemGrid[i][j]) {
                    position.i = i;
                    position.j = j;
                    break;
                }
            }
        }
        return position;
    },

    moveGemsDown: function () {
        for (let i = 0; i < this.gemGrid.length; i++) {
            for (let j = this.gemGrid[i].length - 1; j > 0; j--) {
                if (this.gemGrid[i][j] === null && this.gemGrid[i][j - 1] != null) {
                    let x = this.gemGrid[i][j - 1];
                    this.gemGrid[i][j] = x;
                    this.gemGrid[i][j - 1] = null;

                    this.game.add.tween(x).to({y: this.gemSize * j + this.gemSize / 2}, 250, Phaser.Easing.Linear.In, true);
                    j = this.gemGrid[i].length;
                }
            }
        }
    },

    fillTheMisingGems: function () {
        let gem;
        for (let i = 0; i < this.gemGrid.length; i++) {
            for (let j = 0; j < this.gemGrid.length; j++) {
                if (this.gemGrid[i][j] === null) {
                    gem = this.addGem(i, j);
                    this.gemGrid[i][j] = gem;
                }
            }
        }

    },
    gameOver: function () {
        this.shouldStartTimeCount = false;
        this.canMove = false;
        this.removeGems(this.gemGrid, true);
        this.activeGemReset();

        this.scoreString.destroy();
        this.timeLeftString.destroy();
        this.scoreBar.destroy();

        this.donutShadow = game.add.image(140,210,'donutShadow');
        this.donut = game.add.image(110,210,'donut');
        this.playBtn.alpha = 0;
        this.timeUp = this.game.add.sprite(170, 260, 'timeUp');
        this.game.add.tween(this.timeUp).to({y: 310}, 700, Phaser.Easing.Linear.In, true);
        this.playBtn = game.add.button(260,580,'play');
        this.game.add.tween(this.playBtn).to({y: 560}, 700, Phaser.Easing.Linear.In, true);

        this.playBtn.inputEnabled = true;
        this.playBtn.events.onInputDown.add(this.play, this);


    },
};
