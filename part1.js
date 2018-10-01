var game;

var gameOptions = {
    scorePanelHeight: 0.08,
    launchPanelHeight: 0.18,
    ballSize: 0.04,
    ballSpeed: 1000
}

window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}
playGame.prototype = {

	preload: function(){
 
        // load graphic assets
        game.load.image("ball", "assets/ball.png");
        game.load.image("panel", "assets/panel.png");
        game.load.image("trajectory", "assets/trajectory.png");
	},
 
    create: function(){
 
        // scale and background settings
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;
 
        // start ARCADE physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
 
        // place score panel
        this.scorePanel = game.add.image(0, 0, "panel");
        this.scorePanel.width = game.width;
        this.scorePanel.height = Math.round(game.height * gameOptions.scorePanelHeight);
 
        // place launch panel
        this.launchPanel = game.add.sprite(0, game.height, "panel");
        this.launchPanel.width = game.width;
        this.launchPanel.height = Math.round(game.height * gameOptions.launchPanelHeight);
        this.launchPanel.anchor.set(0, 1);
        // enable ARCADE physics on launch panel
        game.physics.enable(this.launchPanel, Phaser.Physics.ARCADE);
        // launch panel will not move
        this.launchPanel.body.immovable = true;
 
        // place the ball
        var ballSize = game.width * gameOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.launchPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);
 
        // enable ARCADE physics on the ball
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);
 
        // the ball will collide on bounds
        this.ball.body.collideWorldBounds=true;
        this.ball.body.bounce.set(1);
 
        // place the trajectory
        this.trajectory = game.add.sprite(this.ball.x, this.ball.y, "trajectory");
        this.trajectory.anchor.set(0.5, 1);
        this.trajectory.visible = false;
	},
 
    update: function(){
    }
}