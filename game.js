// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var lostMessage;
var won = false;
var lost = false;
var currentScore = 0;
var currentLife = 2;
var winningScore = 100;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(230, 500, 'coin');
  createItem(580, 500, 'coin');
  createItem(370, 380, 'coin');
  createItem(510, 270, 'coin');
  createItem(650, 220, 'coin');
  createItem(100, 220, 'coin');
  createItem(220, 170, 'coin');
  createItem(570, 120, 'coin');
  createItem(400, 80, 'poison');
  createItem(370, 500,'poison');
  createItem(125, 50,'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(100, 550, 'platform1');
  platforms.create(450, 550, 'platform1');
  platforms.create(300, 430, 'platform2');
  platforms.create(400, 320, 'platform2');
  platforms.create(650, 270, 'platform1');
  platforms.create(60, 270, 'platform1');
  platforms.create(150, 220, 'platform1');
  platforms.create(550, 170, 'platform2');
  platforms.create(270, 130, 'platform1');
  platforms.create(130, 90, 'platform2');

  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  var objeto = item.key;

  if(objeto == "coin"){
    currentScore = currentScore + 10;
  }else if(objeto == "poison"){
    currentLife = currentLife - 1;
    if(currentLife == 0){
      lost = true;
      setTimeout('document.location.reload()',1000);
    }
  }else{
    currentScore = currentScore + 20;
  }

  if (currentScore === winningScore && currentLife > 0) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#DF0101';

    //Load images
    game.load.image('platform1', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');

    //Load spritesheets
    game.load.spritesheet('player', 'mikethefrog.png', 32, 32);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    textLives = game.add.text(616, 16, "LIVES: " + currentLife, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    lostMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    lostMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    textLives.text = "Lives: " + currentLife;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    } else if (lost){
      lostMessage.text = "YOU LOOSE!!!";
    }
  }

  function render() {

  }

};
