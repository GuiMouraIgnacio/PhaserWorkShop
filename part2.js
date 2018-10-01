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
 
        // wait for player input
        game.input.onDown.add(this.aimBall, this);
        game.input.onUp.add(this.shootBall, this);
        game.input.addMoveCallback(this.adjustBall, this);
 
        // the player is not aiming
        this.aiming = false;
 
        // the player is not shooting
        this.shooting = false;
	},
 
    aimBall: function(e){
 
        // if the player is not shooting...
        if(!this.shooting){
 
            // the player is aiming
            this.aiming = true;
        }
    },
 
    adjustBall: function(e){
 
        // if the player is aiming...
        if(this.aiming){
 
            // check distance between initial and current input  position
            var distX = e.position.x - e.positionDown.x;
            var distY = e.position.y - e.positionDown.y;
 
            // a vertical distance of at least 10 pixels is required
            if(distY > 10){
 
                // place the trajectory over the ball
                this.trajectory.position.set(this.ball.x, this.ball.y);
 
                // show trajectory
                this.trajectory.visible = true;
 
                // calculate direction
                this.direction = Phaser.Math.angleBetween(e.position.x, e.position.y, e.positionDown.x, e.positionDown.y);
 
                // adjust trajectory angle according to direction, in degrees
                this.trajectory.angle = Phaser.Math.radToDeg(this.direction) + 90;
            }
            else{
 
                // hide trajectory
                this.trajectory.visible = false;
            }
        }
    },
 
    shootBall: function(){
 
        // if the trajectory is visible...
        if(this.trajectory.visible){
 
            // get angle of fire in radians
            var angleOfFire = Phaser.Math.degToRad(this.trajectory.angle - 90);
 
            // set ball velocity
            this.ball.body.velocity.set(gameOptions.ballSpeed * Math.cos(angleOfFire), gameOptions.ballSpeed * Math.sin(angleOfFire));
 
            // the player is shooting!
            this.shooting = true;
        }
 
        // do not aim anymore
        this.aiming = false;
 
        // do not show the trajectory anymore
        this.trajectory.visible = false;
    },
 
    update: function(){
 
        // if the player is shooting...
        if(this.shooting){
 
            // check for collision between the ball and the launch panel
            game.physics.arcade.collide(this.ball, this.launchPanel, function(){
 
                // stop the ball
                this.ball.body.velocity.set(0);
 
                // the player is not shooting
                this.shooting = false;
            }, null, this);
        }
    }
}