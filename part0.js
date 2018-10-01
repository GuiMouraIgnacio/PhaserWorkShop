var game;

window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.AUTO);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}

playGame.prototype = {
 preload: function() {},

 create: function() {},

 update: function () {},
}