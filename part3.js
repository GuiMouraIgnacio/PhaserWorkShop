var game;

// global options
var gameOptions = {
    scorePanelHeight: 0.08,
    launchPanelHeight: 0.18,
    ballSize: 0.04,
    ballSpeed: 1000,
    // block spots per line
    blocksPerLine: 7,
    // maximum amount of blocks per line
    maxBlocksPerLine: 4
}

window.onload = function () {
    game = new Phaser.Game(640, 960, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function () {}
playGame.prototype = {
    preload: function () {
        game.load.image("ball", "assets/ball.png");
        game.load.image("panel", "assets/panel.png");
        game.load.image("trajectory", "assets/trajectory.png");
        // adciona o block
        game.load.image("block", "assets/block.png");
    },
    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.scorePanel = game.add.sprite(0, 0, "panel");
        this.scorePanel.width = game.width;
        this.scorePanel.height = Math.round(game.height * gameOptions.scorePanelHeight);
        //habilita fisicas no scorePanel
        game.physics.enable(this.scorePanel, Phaser.Physics.ARCADE);
        this.scorePanel.body.immovable = true;

        this.launchPanel = game.add.sprite(0, game.height, "panel");
        this.launchPanel.width = game.width;
        this.launchPanel.height = Math.round(game.height * gameOptions.launchPanelHeight);
        this.launchPanel.anchor.set(0, 1);
        game.physics.enable(this.launchPanel, Phaser.Physics.ARCADE);
        this.launchPanel.body.immovable = true;

        var ballSize = game.width * gameOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.launchPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);

        this.trajectory = game.add.sprite(this.ball.x, this.ball.y, "trajectory");
        this.trajectory.anchor.set(0.5, 1);
        this.trajectory.visible = false;

        game.input.onDown.add(this.aimBall, this);
        game.input.onUp.add(this.shootBall, this);
        game.input.addMoveCallback(this.adjustBall, this);

        this.aiming = false;

        this.shooting = false;

        // add the group where all blocks will be placed
        this.blockGroup = game.add.group();
        // place a new line of boxes
        this.placeLine();
    },

    placeLine: function () {
        // determine block size
        var blockSize = game.width / gameOptions.blocksPerLine;

        // array of positions already picked up by a block
        var placedBlocks = [];

        // repeat "maxBlocksPerLine" times
        for (var i = 0; i < gameOptions.maxBlocksPerLine; i++) {

            // choose a random position
            var blockPosition = game.rnd.between(0, gameOptions.blocksPerLine - 1);

            // if the random position is free...
            if (placedBlocks.indexOf(blockPosition) == -1) {

                // insert the position into the array of already picked positions
                placedBlocks.push(blockPosition);

                // add the block
                var block = game.add.sprite(blockPosition * blockSize + blockSize / 2, blockSize / 2 + game.height * gameOptions.scorePanelHeight, "block");
                block.width = blockSize;
                block.height = blockSize;
                block.anchor.set(0.5);

                // enable ARCADE physics on block
                game.physics.enable(block, Phaser.Physics.ARCADE);

                // block will not move
                block.body.immovable = true;

                // custom property. Block starts at row 1
                block.row = 1;

                // add block to block group
                this.blockGroup.add(block);
            }
        }
    },

    aimBall: function (e) {

        if (!this.shooting) {

            this.aiming = true;
        }
    },

    adjustBall: function (e) {

        if (this.aiming) {

            var distX = e.position.x - e.positionDown.x;
            var distY = e.position.y - e.positionDown.y;

            if (distY > 10) {

                this.trajectory.position.set(this.ball.x, this.ball.y);

                this.trajectory.visible = true;

                this.direction = Phaser.Math.angleBetween(e.position.x, e.position.y, e.positionDown.x, e.positionDown.y);

                this.trajectory.angle = Phaser.Math.radToDeg(this.direction) + 90;
            } else {
                this.trajectory.visible = false;
            }
        }
    },

    shootBall: function () {
        if (this.trajectory.visible) {
            var angleOfFire = Phaser.Math.degToRad(this.trajectory.angle - 90);
            this.ball.body.velocity.set(gameOptions.ballSpeed * Math.cos(angleOfFire), gameOptions.ballSpeed * Math.sin(angleOfFire));
            this.shooting = true;
        }
        this.aiming = false;
        this.trajectory.visible = false;
    },

    update: function () {

        if (this.shooting) {

            // check for collision between the ball and the score panel. Just check and make it bounce
            game.physics.arcade.collide(this.ball, this.scorePanel);

            // check for collision between the ball and blockGroup children
            game.physics.arcade.collide(this.ball, this.blockGroup, function (ball, block) {
                // destroy the block
                block.destroy();
            }, null, this);


            game.physics.arcade.collide(this.ball, this.launchPanel, function () {
                this.ball.body.velocity.set(0);

                // use a tween to scroll down blockGroup group
                var scrollTween = game.add.tween(this.blockGroup).to({
                    y: this.blockGroup.y + game.width / gameOptions.blocksPerLine
                }, 200, Phaser.Easing.Linear.None, true);

                // once the tween is completed...
                scrollTween.onComplete.add(function () {
                    // moved
                    this.shooting = false;
                    // put the group in its original position
                    this.blockGroup.y = 0;
                    // loop through all blockGroup children
                    this.blockGroup.forEach(function (block) {
                        block.y += game.width / gameOptions.blocksPerLine;
                        block.row++;
                        if (block.row == gameOptions.blocksPerLine) {
                            game.state.start("PlayGame");
                        }
                    }, this);
                    // add a new line
                    this.placeLine();
                }, this);
            }, null, this);
        }
    }
}