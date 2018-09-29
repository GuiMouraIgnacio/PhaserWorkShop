var game;

var gameOptions = {
    scorePanelHeight : 0.08,
    launchPanelHeight: 0.18,
    ballSize: 0.04,
    ballSpeed: 1000,
};

window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.AUTO);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}

playGame.prototype = {
 preload: function() {
     game.load.image("ball", "assets/ball.png");
     game.load.image("panel", "assets/panel.png");
     game.load.image("trajectory", "assets/trajectory.png");
 },

 create: function() {
     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     game.scale.pageAlignHorinzontally = true;
     game.scale.pageAlignVertically = true;
     game.stage.backgroundColor = 0x202020;

     game.physics.startSystem(Phaser.Physics.ARCADE);

     this.scorePanel = game.add.image(0,0,"panel");
     this.scorePanel.width = game.width;
     this.scorePanel.height = Math.round(game.height * gameOptions.scorePanelHeight);

     this.launchPanel = game.add.sprite(0, game.height, "panel");
     this.launchPanel.width = game.width;
     this.launchPanel.height = Math.round(game.height * gameOptions.launchPanelHeight);
     this.launchPanel.anchor.set(0,1);

     game.physics.enable(this.launchPanel, Phaser.Physics.ARCADE);
     this.launchPanel.body.immovable = true;

     var ballSize = game.width * gameOptions.ballSize;
     this.ball = game.add.sprite(game.width / 2, game.height - this.launchPanel.height, "ball");
     this.ball.width = ballSize;
     this.ball.height = ballSize;
     this.ball.anchor.set(0.5);
     game.physics.enable(this.ball, Phaser.Physics.ARCADE);

     this.ball.body.colliderWorldBounds = true;
     this.ball.body.bounce.set(1);

     this.trajectory = game.add.sprite(this.ball.x, this.ball.y, "trajectory");
     this.trajectory.anchor.set(0.5, 1);
     this.trajectory.visible = false;
 },

 update: function () {},
}