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
        game.load.image("ball", "assets/ball.png");
        game.load.image("panel", "assets/panel.png");
        game.load.image("trajectory", "assets/trajectory.png");
	},
 
    create: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.scorePanel = game.add.image(0, 0, "panel");
        this.scorePanel.width = game.width;
        this.scorePanel.height = Math.round(game.height * gameOptions.scorePanelHeight);
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
        this.ball.body.collideWorldBounds=true;
        this.ball.body.bounce.set(1);
        this.trajectory = game.add.sprite(this.ball.x, this.ball.y, "trajectory");
        this.trajectory.anchor.set(0.5, 1);
        this.trajectory.visible = false;
 
        // configurando input do jogador
        game.input.onDown.add(this.aimBall, this);
        game.input.onUp.add(this.shootBall, this);
        game.input.addMoveCallback(this.adjustBall, this);
 
        // setta a mira e o tiro pra falso
        this.aiming = false;
        this.shooting = false;
	},
 
    aimBall: function(e){
        // setta a mira
        if(!this.shooting){
            this.aiming = true;
        }
    },
 
    adjustBall: function(e){
        if(this.aiming){
            // pega o quanto o jogador arrastou pra baixo na tela
            var distY = e.position.y - e.positionDown.y;
            if(distY > 10){
 
                // coloca a mira na bola
                this.trajectory.position.set(this.ball.x, this.ball.y);
                this.trajectory.visible = true;
                //calcula e aplica o angulo
                this.direction = Phaser.Math.angleBetween(e.position.x, e.position.y, e.positionDown.x, e.positionDown.y);
                this.trajectory.angle = Phaser.Math.radToDeg(this.direction) + 90;
            }
            else{
                // esconde a mira
                this.trajectory.visible = false;
            }
        }
    },
 
    shootBall: function(){
        // se estiver mirando
        if(this.trajectory.visible){
 
            // calcula o angulo e atira
            var angleOfFire = Phaser.Math.degToRad(this.trajectory.angle - 90);
            this.ball.body.velocity.set(gameOptions.ballSpeed * Math.cos(angleOfFire), gameOptions.ballSpeed * Math.sin(angleOfFire));
            this.shooting = true;
        }
 
        // para a mira
        this.aiming = false;
        this.trajectory.visible = false;
    },
 
    update: function(){
        if(this.shooting){
            // espera colisoes entre a bola e o painel inferior
            game.physics.arcade.collide(this.ball, this.launchPanel, function(){
 
                // para a bola
                this.ball.body.velocity.set(0);
                this.shooting = false;
            }, null, this);
        }
    }
}