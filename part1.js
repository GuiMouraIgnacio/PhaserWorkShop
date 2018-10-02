var game;

var gameOptions = {
    //variaveis de configuracao
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
        // Carrega Assets do jogo
        game.load.image("ball", "assets/ball.png");
        game.load.image("panel", "assets/panel.png");
        game.load.image("trajectory", "assets/trajectory.png");
	},
 
    create: function(){
        // background e fullscreen
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;
 
        // Inicia física
        game.physics.startSystem(Phaser.Physics.ARCADE);
 
        // coloca o painel superior
        this.scorePanel = game.add.image(0, 0, "panel");
        this.scorePanel.width = game.width;
        this.scorePanel.height = Math.round(game.height * gameOptions.scorePanelHeight);
 
        // coloca o painel inferior
        this.launchPanel = game.add.sprite(0, game.height, "panel");
        this.launchPanel.width = game.width;
        this.launchPanel.height = Math.round(game.height * gameOptions.launchPanelHeight);
        this.launchPanel.anchor.set(0, 1);
        // habilita fisica no painel
        game.physics.enable(this.launchPanel, Phaser.Physics.ARCADE);
        // deixa ele imovel
        this.launchPanel.body.immovable = true;
 
        // coloca a bola na posicao inicial
        var ballSize = game.width * gameOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.launchPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);
 
        // habilita fisica na bola
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);
 
        // coloca a bola pra rebater
        this.ball.body.collideWorldBounds=true;
        this.ball.body.bounce.set(1);
 
        // carrega o sprite da mira
        this.trajectory = game.add.sprite(this.ball.x, this.ball.y, "trajectory");
        this.trajectory.anchor.set(0.5, 1);
        this.trajectory.visible = false;
	},
 
    update: function(){
    }
}