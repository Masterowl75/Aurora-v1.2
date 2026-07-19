const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    // defines the height and width of the canvas
    pixelArt: true,
    // enbles teh use of pixel art so that the images appear clearly
    parent: 'GAME',
    // sets the game canvas to be inside the GAME div inside of html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1800,
            },
            debug: false
        }
        // sets the physics engine to arcade and the gravity to 1800
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update,
        end: end
    },
};

const game = new Phaser.Game(config);

let debugGraphics;
let debugEnabled = false;
let debugText;
let debugKey;
let gameStarted = false
let leaderboardOpen = false
let leaderboardMode = "1pp";
let isAdmin = false;
let gameFinished = false;
let adminButtonCreated = false;
var map;
let dbReady = false;
var tileset;
var layer;
var player;
var platforms;
var berry;
var spikes;
var score = 0;
var deaths = 0;
var scoreText;
var deathText;
this.flag;
var paddedMinutes;
var paddedSeconds;
var time;
var deathSkull;
var scoreBerry;
var isWavedashing;


let sp = [0, 0]
// Defining the variables to be called on and used in the code

function init() {}

function preload() {
    this.load.spritesheet('AuroraIdle', 'game/assets/Celeste Idol animation.png', {
        // load.spritesheet loads an image as a spritesheet that can be used to make animations in the game
        frameWidth: 32,
        frameHeight: 32,
        // frame height and width define the height and width of each frame ina spritesheet so that thy can be sperated into animations
    });
    this.load.spritesheet('AuroraRight', 'game/assets/Celeste running right..png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.spritesheet('AuroraLeft', 'game/assets/CELESTE RUNNING LEFT.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.image('dashNorthEast', 'game/assets/celeste north-east dash.png');
    this.load.image('star', 'game/assets/pixil-frame-0 (3).png');
    // load.image loads the image so that it can be used in the game
    this.load.image('dashNorth', 'game/assets/celeste up dash.png');
    this.load.image('dashSouth', 'game/assets/celeste down dash.png');
    this.load.image('aurora-mountain', 'game/assets/Aurora-mountain.png')
    this.load.image('dashNorthWest', 'game/assets/celeste north-west dash.png');
    this.load.image('dashRight', 'game/assets/celeste right dash.png');
    this.load.image('dashLeft', 'game/assets/pixil-frame-0 (9).png');
    this.load.image('Background', 'game/assets/That one celeste background.webp');
    this.load.spritesheet('berry', 'game/assets/actual celeste strawberry.png', {
        frameHeight: 16,
        frameWidth: 16,
    });
    this.load.image('flag', 'game/assets/Screenshot_2026-06-02_121145-removebg-preview.png');
    this.load.image('flake', 'game/assets/pixil-frame-0 (13).png')
    this.load.image('skull', 'game/assets/Screenshot_2026-06-03_180213-removebg-preview.png')
    this.load.image('tiles1', 'game/assets/pixil-frame-0 (15).png');
    this.load.tilemapTiledJSON('map1', 'game/assets/map.json');
    // load.tilemapTiledJSON loads the file sourced as a tile map so that it can be used as one in the game
}

function create() {		

	 if (!gameStarted) {

        this.add.image(0, 0, 'aurora-mountain').setScale(0.68).setOrigin(0, 0).setScrollFactor(0);

        const title = this.add.text(500, 47, 'AURORA', {
            font: "bold 54px Silkscreen",
            fontWeight: '600',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(9999);

        this.tweens.add({
            targets: title,
            scale: 1.08,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startButton = this.add.text(500, 320, 'START', {
                fontFamily: 'Silkscreen',
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#302f30',
                padding: {
                    x: 20,
                    y: 10
                }
            })
            .setOrigin(0.5)
            .setDepth(9999)
            .setInteractive({
                useHandCursor: true
            });

        startButton.on('pointerover', () => {
            startButton.setScale(1.05);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
        });

        startButton.on('pointerdown', () => {

            this.cameras.main.fadeOut(500, 0, 0, 0);

            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {
                    tutorial = false;
                    gameStarted = true;
                    this.scene.restart();
                }
            );

        });
		 return;
	 }

    // localStorage.setItem('admin', 'yessir'); 
    map = this.make.tilemap({
        // makes the tilemap object
        key: 'map1'
    });
    // defines the key from the preload that should be used to create the tilemap


    tileset = map.addTilesetImage('tiles', 'tiles1', 32, 32);
    // adds the provided tileset image and turns it into a defined tileset object that is then used to make the tilemap work
    layer = map.createLayer('LAYER', tileset, 0, 0);
    // adds a layer to the tilemap that allows for the tilemap to load and be visible
    layer.setVisible(true);
    // sets the visibility of the tilemap to true so that it is definitely visible
    layer.setDepth(100);
    // sets the depth of the tilemap so that it is on top f everything to make sure that it is not behind anything
    layer.setAlpha(1);
    // set alpha controls the opacity of the object, in this case making it so that the tilemap is not transparent at all
    layer.setScale(1);
    // set scale changes the scale factor of the object, in this case making sure that the tilemap layer is not scaled at all



    this.add.image(0, 0, 'Background').setScale(1.75).setOrigin(0, 0).setScrollFactor(0);
    // add the background image into the scene. Set origin defines the point of the object that should be used for its roatation, placment and scaling
    // set scrollfactor(0) stops the object from moving when the camera moves, fixing it to the position it is set to
    // player = this.physics.add.sprite(60, 2700, 'AuroraIdle');
    player = this.physics.add.sprite(1120, 3872, 'AuroraIdle');
    // using 'player =' defines the variable of player to this object
    // adding anobject using physics allows it to be effected by the built in phaser physics that have been set to arcade
    player.setGravity(true);
    // 'player.' addresses the player object
    // set gravity true makes sure that the player experiences gravity
    player.setDepth(101);
    player.setBounce(0);
    // set bounce changes the level of bounce that the player experiences when they hit the floor. in this case stopping the player from bouncing.
    player.setScale(2).refreshBody();
    // refresh body makes the player object refresh so that the correct scaling from set scale is applied.
    player.setBodySize(12, 16, true);
    // set body size changes the hitbox of the object

    scoreBerry = this.add.image(20, 20, 'berry').setOrigin(0, 0).setScale(2.5).setScrollFactor(0).setDepth(200);
    deathSkull = this.add.image(25, 70, 'skull').setOrigin(0, 0).setScrollFactor(0).setScale(0.25).setDepth(200);

    cursors = this.input.keyboard.createCursorKeys();

    this.flag = this.physics.add.image(1710, 928, 'flag').setScale(0.4);
    this.flag.body.setAllowGravity(false);
    // set allow gravity(false) stops the object from experiencing gravity
    this.flag.body.setImmovable(true);
    // set immovable makes it so that the object cant be moved when colliding with

    berries = this.physics.add.staticGroup();
    // adding a static group makes it so that all of the collectables in this case are in one group and share the same properties

    berries.create(1024, 3040, 'berry').setScale(2.5).refreshBody();
    // creates a berry to be spawned at the coordinates given
    berries.create(1952, 3552, 'berry').setScale(2.5).refreshBody();
    berries.create(3072, 3328, 'berry').setScale(2.5).refreshBody();
    berries.create(1280, 3104, 'berry').setScale(2.5).refreshBody();
    berries.create(2134, 3104, 'berry').setScale(2.5).refreshBody();
    berries.create(1024, 2912, 'berry').setScale(2.5).refreshBody();
    berries.create(3904, 2528, 'berry').setScale(2.5).refreshBody();
    berries.create(2816, 2528, 'berry').setScale(2.5).refreshBody();
    berries.create(1063, 2592, 'berry').setScale(2.5).refreshBody();
    berries.create(3136, 1462, 'berry').setScale(2.5).refreshBody();





    this.cameras.main.startFollow(player);
    // makes the camera follow the player
    this.cameras.main.setZoom(1);
    // sets the zoom of the camera


    this.physics.add.overlap(player, berries, collectBerry, null, this)
    map.setTileIndexCallback([4, 5], killPlayer, null, layer);
    layer.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, layer);

    const WOODEN_PLATFORM_INDEX = [9, 10];

    this.woodTiles = layer.filterTiles(tile => WOODEN_PLATFORM_INDEX.includes(tile.index));

    this.woodTiles.forEach(tile => {
        tile.setCollision(true);

        tile.collideUp = true;
        tile.collideDown = false;
        tile.collideLeft = false;
        tile.collideRight = false;
    });


    scoreText = this.add.text(60, 28, 'x 0', {
        // adds text at the location given
        fontSize: '20px',
        // changes the font size
        fill: '#FFFFFF',
        // changes the colour
        fontFamily: 'Silkscreen',
        // changes the font
    }).setScrollFactor(0).setDepth(200);

    deathText = this.add.text(60, 71, 'x 0', {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontFamily: 'Silkscreen',
    }).setScrollFactor(0).setDepth(200);




    this.summaryText = this.add.text(175, -10, '', {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontFamily: 'Silkscreen',
        align: 'center',
    }).setScrollFactor(0).setDepth(200).setVisible(false);

    this.elapsedTime = 0;
    // defines the elapsed time variable to 0
    this.isTracking = true;
    // sets the isTracking variable to true

    this.timerText = this.add.text(910, 20, '00:00', {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontFamily: 'Silkscreen',
    }).setScrollFactor(0).setDepth(200);



    this.anims.create({
        // creates the animation
        key: 'right',
        // creates the key for the animation that can be used to identify what animation to use
        frames: [{
            key: 'AuroraRight',
            frame: 0,
        }, {
            key: 'AuroraRight',
            frame: 1
        }, {
            key: 'AuroraRight',
            frame: 2
        }, {
            key: 'AuroraRight',
            frame: 3
        }, {
            key: 'AuroraRight',
            frame: 4
        }],
        // defines all of the frames of the animation  from the spritesheet that has the defined frame width and height values
        frameRate: 10,
        // chanegs the speed of the animation
        repeat: -1
        // makes the animation repeat
    });

    this.anims.create({
        key: 'left',
        frames: [{
            key: 'AuroraLeft',
            frame: 0,
        }, {
            key: 'AuroraLeft',
            frame: 1
        }, {
            key: 'AuroraLeft',
            frame: 2
        }, {
            key: 'AuroraLeft',
            frame: 3
        }, {
            key: 'AuroraLeft',
            frame: 4
        }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'Idle',
        frames: [{
            key: 'AuroraIdle',
            frame: 0,
        }, {
            key: 'AuroraIdle',
            frame: 1
        }],
        frameRate: 2,
        repeat: -1
    });

    this.anims.create({
        key: 'berryAnim',
        frames: [{
            key: 'berry',
            frame: 0,
        }, {
            key: 'berry',
            frame: 1
        }],
        frameRate: 2,
        repeat: -1
    });



    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    // all of these add the keys on the keyboard that are used as things that can be used and called on


    this.canDash = true;
    // sets canDash to true
    this.isDashing = false;
    this.stopControls = false;
    // sets is dashing to false
    this.isGrounded = false;
    // sets isGrounded to false
    this.dashChargeLock = false;
    // sets dashChargeLock to false
    berries.playAnimation('berryAnim');
    // makes the berries play the animation with the key of berryAnim

    player.body.maxVelocity.setTo(1000, 1000);
    // sets the players max velocity so that bugs don't occur

    const snowParticles = this.add.particles(0, 0, 'flake', {
        // adds the image used for the snow particles
        x: {
            min: 0,
            max: this.scale.width
            // sets the min and max x value that the snowflakes can spawn at
        },
        y: -20,
        // sets the y value for where the snowflakes spawn.

        gravityY: 20,
        // sets the gravity for the snow
        speedX: {
            min: -20,
            max: 20
        },
        // sets the min and max x speed which changes how fast it sways bacck and forth
        speedY: {
            min: 0,
            max: 1
        },
        // sets the min and max y speed 

        scale: {
            min: 0.5,
            max: 1.2
        },
        // sets the min and max scale for the flakes to add variation to the effect
        alpha: {
            start: 0.8,
            end: 0.3
        },
        // makes the flakes start at 0.8 opacity and end at 0.3
        lifespan: 8000,
        // the time that the flakes are visible for
        frequency: 50
        // how frequent the flakes are
    });

    snowParticles.setDepth(200);

    snowParticles.setScale(5, 5)

    snowParticles.setScrollFactor(0);

    this.physics.add.overlap(player, this.flag, () => {

        gameFinished = true;

        this.isTracking = false;

        // Stop player control
        this.stopControls = true;

        // Let physics continue
        player.body.allowGravity = true;
		player.setVelocityX(0)



        deathSkull.setVisible(false);
        scoreBerry.setVisible(false);
        scoreText.setVisible(false);
        deathText.setVisible(false);
        this.flag.setVisible(false);

        let finalTime = this.timerText.text;

        this.summaryText.setText(`
        ===== WELCOME TO THE SUMMIT =====
        You reached the summit of Mt. Aurora!
        Here is a summary of your climb:

        Strawberries collected: ${score}/10
        Deaths: ${deaths}
        Time: ${finalTime}

        Press SHIFT + R to restart
        `);

        this.summaryText.setVisible(true);
        this.timerText.setVisible(false);
            });


    debugText = this.add.text(8, 8, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#00ff00",
        backgroundColor: "#000000"
    });

    debugText.setScrollFactor(0);
    debugText.setDepth(999999);
    debugText.setVisible(false);

    debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F3);

    debugKey.on("down", () => {
        debugEnabled = !debugEnabled;
        debugText.setVisible(debugEnabled);
    });
    debugGraphics = this.add.graphics();
    debugGraphics.setDepth(999998);
}

function update(time, delta) {
    if (!gameStarted){
		return
	}
	if (
        !this.keyW ||
        !this.keyA ||
        !this.keyS ||
        !this.keyD ||
        !this.keyENTER ||
        !this.keySHIFT ||
        !this.keyE
    ) {
        return;
    }

    if (!gameStarted) {
        return;
    }

    if (gameFinished == true) {
        this.isDashing = false
        player.anims.play('Idle', true);
    }


    if (this.keySHIFT.isDown && Phaser.Input.Keyboard.JustDown(this.keyE)) {

        if (!this.physics.world.debugGraphic) {
            this.physics.world.createDebugGraphic();
        }

        this.physics.world.drawDebug = !this.physics.world.drawDebug;

        if (!this.physics.world.drawDebug) {
            this.physics.world.debugGraphic.clear();
        }
    }


    if (this.isTracking) {
        // if isTracking is true this runs
        this.elapsedTime += delta;
        // adds the amount that has past since the last frame to the overall total (elapsedTime)

        let totalSeconds = Math.floor(this.elapsedTime / 1000);
        // converts ms into sec by dividing it by 1000

        let minutes = Math.floor(totalSeconds / 60);
        // converts seconds into minutes by dividing by 60
        let seconds = totalSeconds % 60;
        // calculates the remaining seconds after converting to minutes

        let paddedMinutes = String(minutes).padStart(2, '0');
        // makes the minutes appear as '01' instead of '1' to prevent ui shifting in game
        let paddedSeconds = String(seconds).padStart(2, '0');
        // makes the seconds appear as '01' instead '1' to prevent ui shifting in game

        this.timerText.setText(`${paddedMinutes}:${paddedSeconds}`);
        // sets the timer text to the values of paddedMinutes and paddedSeconds
    }

    this.isWavedashing = false;
    this.isSliding = false;
    const isNearGround = player.body.touching.down || player.body.blocked.down || Math.abs(player.body.deltaY()) < 0.1;
    const normalRunSpeed = 210;
    console.log(`Dash: ${this.isDashing} | W-Key: ${this.keyW.isDown} | Touching: ${player.body.touching.down} | Blocked: ${player.body.blocked.down}`);

    if (this.isDashing && this.keyW.isDown && isNearGround && !this.isSliding) {
        console.log("🚀 WAVEDASH TRIGGERED!");
        player.setVelocityY(-200);
        player.setVelocityX(player.body.velocity.x * 1.5);
        this.isWavedashing = true;
        this.isSliding = true;
    }

    if (this.keyS.isDown) {
        this.woodTiles.forEach(tile => {
            tile.setCollision(true);

            tile.collideUp = false;
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        });
    } else if (!this.keyS.isDown) {
        this.woodTiles.forEach(tile => {
            tile.setCollision(true);

            tile.collideUp = true;
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        });
    }

    if (this.isSliding) {
        const decayFactor = Math.pow(0.002, delta / 1000);
        player.body.setVelocityX(player.body.velocity.x * decayFactor);

        if (Math.abs(player.body.velocity.x) <= normalRunSpeed) {
            player.isSliding = false;
        }

        return;
    }


    if (this.isDashing) return;

    // if teh isDashing variable is set to true it skips over the rest of the update function

    if (player.body.blocked.down || player.body.touching.down) {
        // if the player is touching the ground it set the isGrounded variable to true
        this.isGrounded = true;

        if (!this.isDashing && !this.dashChargeLock) {
            // if the isDashing and dashChargeLock variables are false it set the canDash variable to true
            this.canDash = true;
        }
    }

    if (gameFinished == false) {
        if (this.keyA.isDown) {
            // if the akey is pressed it sets the player velocity to move to the left
            player.setVelocityX(-210);
            player.anims.play('left', true);
            // makes the walk left animation play
        } else if (this.keyD.isDown) {
            player.setVelocityX(210);
            player.anims.play('right', true);
            // same for the a key but changes the direction and the animation to right
        } else {
            player.setVelocityX(0);
            player.anims.play('Idle', true);
            // if these 2 keys before arent pressed then it set the player to stand still and changees the animation to the idol animation
        }

        if (this.keyW.isDown && this.isGrounded) {
            player.setVelocityY(-550);
            this.isGrounded = false;
            // if the w key is pressed it make the player jump and sets the isGrounded variable to false
        }
    }





    // northwest dash
    if (this.keyW.isDown && this.keyA.isDown && this.keyENTER.isDown && this.canDash) {
        // all of the dashes are the same
        // if all of teh keys listed are pressed down then the following happens
        player.setVelocityX(-495);
        player.setVelocityY(-495);
        // sets the x and y velocity to the direction and speed for the dash
        this.canDash = false;
        // sets canDash to false
        this.isDashing = true;
        // set isDashing to true
        player.body.allowGravity = false;
        // stops gravity from working on the player
        player.setTexture('dashNorthWest');
        // changes the texture used for the sprite to the texture for that direction's dash
        player.anims.stop();
        // stops the other animation playing at the time


        this.time.delayedCall(150, () => {
            // after 150ms the following happens
            player.setVelocityX(-300);
            player.setVelocityY(-450);
            // both the x and y velocities are set back to what they were before the dash
            this.isDashing = false;
            // isDashing is set to false
            player.body.allowGravity = true;
            // gravity is allowed on the player again
        }, [], this);
    }
    // northeast dash
    if (this.keyW.isDown && this.keyD.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityX(495);
        player.setVelocityY(-495);
        this.canDash = false;
        this.isDashing = true;
        player.body.allowGravity = false;
        player.setTexture('dashNorthEast');
        player.anims.stop();



        this.time.delayedCall(150, () => {
            player.setVelocityX(300);
            player.setVelocityY(-450);
            this.isDashing = false;
            player.body.allowGravity = true;
        }, [], this);

    }
    // north dash
    if (this.keyW.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityY(-700);
        this.canDash = false;
        this.isDashing = true;
        player.setTexture('dashNorth');
        player.anims.stop()

        this.time.delayedCall(150, () => {
            player.setVelocityY(-450);
            this.isDashing = false;
        }, [], this);

    }
    // southeast dash
    if (this.keyS.isDown && this.keyA.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityX(-495);
        player.setVelocityY(495);
        this.canDash = false;
        this.isDashing = true;
        player.setTexture('dashNorthWest');
        player.anims.stop();

        this.time.delayedCall(150, () => {
            player.setVelocityX(-300);
            player.setVelocityY(450);
            this.isDashing = false;
        }, [], this);

    }
    // southwest dash
    if (this.keyS.isDown && this.keyD.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityX(495);
        player.setVelocityY(495);
        this.canDash = false;
        this.isDashing = true;
        player.setTexture('dashNorthEast');
        player.anims.stop();


        this.time.delayedCall(150, () => {
            player.setVelocityX(300);
            player.setVelocityY(450);
            this.isDashing = false;
        }, [], this);


    }
    // south dash
    if (this.keyS.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityY(700);
        this.canDash = false;
        this.isDashing = true;
        player.setTexture('dashSouth');
        player.anims.stop()


        this.time.delayedCall(150, () => {
            player.setVelocityY(450);
            this.isDashing = false;
        }, [], this);


    }
    // left dash
    if (this.keyA.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityX(-700);
        player.setVelocityY(0);
        this.canDash = false;
        this.isDashing = true;
        this.dashChargeLock = true;
        player.setTexture('dashLeft');
        player.anims.stop();
        player.body.allowGravity = false;

        this.time.delayedCall(150, () => {
            player.setVelocityX(-300);
            this.isDashing = false;
            player.body.allowGravity = true;
        }, [], this);

        this.time.delayedCall(250, () => {
            // the left and right dash have an extra callback that stops them from dashing continuously across the ground
            this.dashChargeLock = false;
        }, [], this);



    }
    // right dash
    if (this.keyD.isDown && this.keyENTER.isDown && this.canDash) {
        player.setVelocityX(700);
        player.setVelocityY(0)
        this.canDash = false;
        this.isDashing = true;
        this.dashChargeLock = true;
        player.setTexture('dashRight');
        player.anims.stop();
        player.body.allowGravity = false;


        this.time.delayedCall(150, () => {
            player.setVelocityX(300);
            this.isDashing = false;
            player.body.allowGravity = true;
        }, [], this);

        this.time.delayedCall(250, () => {
            this.dashChargeLock = false;
        }, [], this);


    }


    if (this.keySHIFT.isDown && Phaser.Input.Keyboard.JustDown(this.keyR)) {
        sp = [0, 0]
        // when the shift and r key ae pressed together it does the following
        this.scene.restart();
        // restarts the scene (game)
        score = 0;
        deaths = 0;
        // sets the deaths and score to 0 to restart
        this.isTracking = true;
        // set isTracking to true
        this.timerText.setVisible(true);
        deathText.setVisible(true);
        deathSkull.setVisible(true);
        scoreBerry.setVisible(true);
        scoreText.setVisible(true);
        this.flag.setVisible(true);
        gameFinished = false
        // makes all of the ui elements visible again
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
        // r key ae pressed together it does the following
        this.isTracking = true;
        // set isTracking to true
        this.timerText.setVisible(true);
        deathText.setVisible(true);
        deathSkull.setVisible(true);
        scoreBerry.setVisible(true);
        scoreText.setVisible(true);
        this.flag.setVisible(true);
        gameFinished = false

        if (sp[0] != 0 && sp[1] != 0) {
            player.setPosition(sp[0], sp[1])
            console.log("a")
        }
        // makes all of the ui elements visible again
    }


}



function end() {}

function killPlayer(player, tile) {
    const isFalling = player.body.velocity.y > 0;

    const dynamicBuffer = Math.max(8, player.body.velocity.y * 0.02);

    const isAboveTile = player.body.bottom <= (tile.pixelY + dynamicBuffer);

    const isOverlappingX = player.body.right > tile.pixelX && player.body.left < (tile.pixelX + tile.width);

    if (isFalling && isAboveTile && isOverlappingX) {
        console.log('asdasd')
        player.disableBody(true, true);
        deaths = deaths + 1;
        deathText.setText('x ' + deaths);
        player.scene.cameras.main.fadeOut(1000, 0, 0, 0);

        player.scene.time.delayedCall(700, () => {
            player.enableBody(true, 1120, 3872, true, true);
            player.scene.cameras.main.fadeIn(500, 0, 0, 0);

            if (sp[0] != 0 && sp[1] != 0) {
                player.setPosition(sp[0], sp[1]);
                console.log("plop");
            }
        }, [], this);
    }
}

function collectBerry(player, berry) {
    sp = [berry.x, berry.y]
    console.log("pluh")
    // defines the collectberry function
    berry.disableBody(true, true);
    // makes the berry disappear
    score = score + 1;
    // adds one to the score
    scoreText.setText('x ' + score);
    // changes the score text to the updated score
}
async function openleaderboard(forceOpen = false) {

    if (leaderboardOpen == false) {
        document.getElementById("LPU").innerHTML = "<b>🠙LEADERBOARD🠙</b>"
    }
    if (leaderboardOpen == true) {
        document.getElementById("LPU").innerHTML = "<b>⬇LEADERBOARD⬇</b>"
    }

    leaderboardOpen = !leaderboardOpen


    createAdminButton();

    if (!dbReady) return;

    // let leaderboard = document.getElementById("leaderboard");

    // if (!leaderboard) {
    //     leaderboard = document.createElement("div");
    //     leaderboard.id = "leaderboard";
    //     document.body.appendChild(leaderboard);
    // }

    let leaderboard = document.getElementById("leaderboard");

    if (!leaderboard) {
        leaderboard = document.createElement("div");
        leaderboard.id = "leaderboard";
        document.body.appendChild(leaderboard);
    }


    if (!forceOpen) {
        if (leaderboard.style.display === "block") {
            leaderboard.style.opacity = "0";

            setTimeout(() => {
                leaderboard.style.display = "none";
            }, 300);

            return;
        }
    }

    leaderboard.style.display = "block";

    requestAnimationFrame(() => {
        leaderboard.style.opacity = "1";
    });

    leaderboard.style.display = "block";

    requestAnimationFrame(() => {
        leaderboard.style.opacity = "1";
    });

    const result = await webucate.db.run(`
        SELECT * FROM leaderboard
        ORDER BY time_seconds ASC
    `);

    let runs = result;

    if (Array.isArray(result) && Array.isArray(result[0])) {
        runs = result[0];
    }

    function getBestPerPlayer(runList) {
        const bestMap = {};

        runList.forEach(r => {
            if (
                !bestMap[r.player_name] ||
                r.time_seconds < bestMap[r.player_name].time_seconds
            ) {
                bestMap[r.player_name] = r;
            }
        });

        return Object.values(bestMap);
    }


    let anyRuns = runs.filter(r => r.category === "Any%");
    let allRuns = runs.filter(r => r.category === "All Berries");

    if (leaderboardMode === "1pp") {
        anyRuns = getBestPerPlayer(anyRuns);
        allRuns = getBestPerPlayer(allRuns);
    }

    anyRuns.sort((a, b) => a.time_seconds - b.time_seconds);
    allRuns.sort((a, b) => a.time_seconds - b.time_seconds);


    const wrAny = anyRuns.reduce((best, r) =>
        !best || r.time_seconds < best.time_seconds ? r : best, null);

    const wrAll = allRuns.reduce((best, r) =>
        !best || r.time_seconds < best.time_seconds ? r : best, null);

    let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1>Leaderboard</h1>
        <div>
            <button onclick="setLeaderboardMode('1pp')" 
                style="margin-right:10px; ${leaderboardMode === '1pp' ? 'background:gold;' : ''}">
                1PP
            </button>
            <button onclick="setLeaderboardMode('full')" 
                style="${leaderboardMode === 'full' ? 'background:gold;' : ''}">
                Full
            </button>
        </div>
    </div>
    `;

    // ANY%
    html += "<h2>Any%</h2>";

    if (anyRuns.length === 0) {
        html += "<p>No runs</p>";
    } else {

        anyRuns.slice(0, 5).forEach((r, i) => {

            const isWR = wrAny && r.id === wrAny.id;

            html += `
            <div class="run ${isWR ? "wr" : ""}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${i + 1} ${r.player_name}<b id="gold">${isWR ? " (WR)" : ""}</b></span>
                    <span>${r.time_seconds} sec</span>
                </div>
                <div>${r.berries} Berries</div>
            `;

            if (isAdmin) {
                html += `<button class="deleteBtn" onclick="deleteRun(${r.id})">Delete</button>`;
            }

            html += `</div><br>`;
        });
    }

    // ALL BERRIES
    html += "<h2>All Berries</h2>";

    if (allRuns.length === 0) {
        html += "<p>No runs</p>";
    } else {

        allRuns.slice(0, 5).forEach((r, i) => {

            const isWR = wrAll && r.id === wrAll.id;

            html += `
            <div class="run ${isWR ? "wr" : ""}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${i + 1} ${r.player_name}<b id="gold">${isWR ? " (WR)" : ""}</b></span>
                    <span>${r.time_seconds} sec</span>
                </div>
                <div>${r.berries} Berries</div>
            `;

            if (isAdmin) {
                html += `<button class="deleteBtn" onclick="deleteRun(${r.id})">Delete</button>`;
            }

            html += `</div><br>`;
        });
    }

    leaderboard.innerHTML = html;
}

async function deleteRun(id) {

    if (!isAdmin) return;

    await webucate.db.run(`
		DELETE FROM leaderboard
		WHERE id = ${id}
	`);

    openleaderboard();
    openleaderboard();

}

function createAdminButton() {

    if (adminButtonCreated) return;

    adminButtonCreated = true;

    // btn.onclick = () => {

    //     const pass = prompt("Enter admin password:");

    //     if (pass === "admin123") {

    //         isAdmin = true;
    //         alert("Admin mode enabled");

    //         openleaderboard(); // refresh leaderboard

    //     } else {

    //         alert("Wrong password");

    //     }
    // };

    //document.body.appendChild(btn);
}


if (localStorage.getItem("admin") == "yessir") {
    isAdmin = true;
}

async function submitRun() {

    if (!dbReady) return;

    const name = "USER";

    let category = "Any%";
    if (score === 19) {
        category = "All Berries";
    }

    const time = this?.elapsedTime ? Math.floor(this.elapsedTime / 1000) : 0;
    const berries = score;

    let imageData = "";

    if (file) {
        imageData = await toBase64(file);
    }

    await webucate.db.run(`
        INSERT INTO leaderboard
        (player_name, category, time_seconds, berries, proof_image)
        VALUES (?, ?, ?, ?, ?)
    `, [name, category, time, berries, imageData]);
}
document.getElementById("submitBtn").onclick = async () => {

    const name = document.getElementById("nameInput").value.trim();
    if (!name) return;

    const finalTime = Math.floor(this.elapsedTime / 1000);
    const berriesCollected = score;
    const category = (berriesCollected === 19) ? "All Berries" : "Any%";

    try {

        console.log("Submitting run...");

        await webucate.db.run(`
            INSERT INTO leaderboard
            (player_name, category, time_seconds, berries, proof_image)
            VALUES (?, ?, ?, ?, ?)
        `, [
            name,
            category,
            finalTime,
            berriesCollected,
            "none"
        ]);

        console.log("DB insert success");

        document.body.removeChild(box);
        alert("Run submitted!");

    } catch (err) {
        console.error("DB ERROR:", err);
        alert("Submit failed (check console)");
    }
};

function setLeaderboardMode(mode) {
    leaderboardMode = mode;
    openleaderboard(true);
}

async function showLeaderboard() {

    if (!dbReady) return;

    const result = await webucate.db.run(`
        SELECT *
        FROM leaderboard
        ORDER BY time_seconds ASC
        LIMIT 10
    `);

    let runs = result;

    if (Array.isArray(result) && Array.isArray(result[0])) {
        runs = result[0];
    }

    // Background panel
    const panel = this.add.rectangle(
        500,
        300,
        800,
        500,
        0x000000,
        0.9
    ).setDepth(10000);

    const title = this.add.text(
            500,
            80,
            'LEADERBOARD', {
                fontFamily: 'Silkscreen',
                fontSize: '28px',
                color: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setDepth(10001);

    let leaderboardText = "";

    runs.slice(0, 10).forEach((run, index) => {

        leaderboardText +=
            `${index + 1}. ${run.player_name} - ${run.time_seconds}s\n`;

    });

    const list = this.add.text(
            500,
            150,
            leaderboardText || "No runs yet", {
                fontFamily: 'Silkscreen',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }
        )
        .setOrigin(0.5, 0)
        .setDepth(10001);

    const backButton = this.add.text(
            500,
            500,
            'BACK', {
                fontFamily: 'Silkscreen',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#302f30',
                padding: {
                    x: 20,
                    y: 10
                }
            }
        )
        .setOrigin(0.5)
        .setDepth(10001)
        .setInteractive({
            useHandCursor: true
        });

    backButton.on('pointerdown', () => {

        panel.destroy();
        title.destroy();
        list.destroy();
        backButton.destroy();

    });
}
async function openMenuLeaderboard() {

    if (!dbReady) return;

    let leaderboard = document.getElementById("menuLeaderboard");

    if (leaderboard) {
        leaderboard.remove();
    }

    leaderboard = document.createElement("div");
    leaderboard.id = "menuLeaderboard";

    leaderboard.style.position = "absolute";
    leaderboard.style.left = "50%";
    leaderboard.style.top = "333px";
    leaderboard.style.transform = "translate(-50%, -50%)";

    leaderboard.style.width = "1000px";
    leaderboard.style.height = "600px";

    leaderboard.style.background = "#131E48";
    leaderboard.style.border = "3px solid white";
    leaderboard.style.color = "white";

    leaderboard.style.zIndex = "999999";

    leaderboard.style.display = "flex";
    leaderboard.style.flexDirection = "column";

    leaderboard.style.padding = "20px";
    leaderboard.style.boxSizing = "border-box";

    document.getElementById("GAME").appendChild(leaderboard);

    const result = await webucate.db.run(`
        SELECT *
        FROM leaderboard
        ORDER BY time_seconds ASC
    `);

    let runs = result;

    if (Array.isArray(result) && Array.isArray(result[0])) {
        runs = result[0];
    }

    function getBestPerPlayer(runList) {

        const bestMap = {};

        runList.forEach(r => {

            if (
                !bestMap[r.player_name] ||
                r.time_seconds < bestMap[r.player_name].time_seconds
            ) {
                bestMap[r.player_name] = r;
            }

        });

        return Object.values(bestMap);
    }

    let anyRuns = runs.filter(r => r.category === "Any%");
    let allRuns = runs.filter(r => r.category === "All Berries");

    if (leaderboardMode === "1pp") {
        anyRuns = getBestPerPlayer(anyRuns);
        allRuns = getBestPerPlayer(allRuns);
    }

    anyRuns.sort((a, b) => a.time_seconds - b.time_seconds);
    allRuns.sort((a, b) => a.time_seconds - b.time_seconds);

    const wrAny = anyRuns.reduce(
        (best, r) =>
        !best || r.time_seconds < best.time_seconds ? r : best,
        null
    );

    const wrAll = allRuns.reduce(
        (best, r) =>
        !best || r.time_seconds < best.time_seconds ? r : best,
        null
    );

    leaderboard.innerHTML = `
        <h1 style="
            text-align:center;
            margin-top:0;
            font-family:Silkscreen;
        ">
            Leaderboard
        </h1>

        <div>
            <button onclick="setLeaderboardMode('1pp')" id = 'onepp'
                style="margin-right:10px; ${leaderboardMode === '1pp' ? 'border: 2px solid white;' : ''}">
                1PP
            </button>
            <button onclick="setLeaderboardMode('full')" id = 'full'
                style="${leaderboardMode === 'full' ? 'border: 2px solid white;' : ''}">
                Full
            </button>
        </div>

        <div id="leaderboardContent" style="
            flex:1;
            overflow-y:auto;
            padding-right:10px;
        ">
        </div>

        <button id="backLeaderboardBtn"
            style="
                margin-top:15px;
                padding:10px;
                font-family:Silkscreen;
                cursor:pointer;
            ">
            BACK
        </button>
    `;

    const content = document.getElementById("leaderboardContent");

    let html = "";

    // ANY%

    html += `<h2>Any%</h2>`;

    if (anyRuns.length === 0) {

        html += `<p>No runs</p>`;

    } else {

        anyRuns.slice(0, 5).forEach((r, i) => {

            const isWR = wrAny && r.id === wrAny.id;

            html += `
                <div style="
                    border:1px solid white;
                    padding:10px;
                    margin-bottom:10px;
                    ${isWR ? "background:#665200;" : ""}
                ">
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    ">
                        <span>
                            #${i + 1} ${r.player_name}
                            ${isWR ? "(WR)" : ""}
                        </span>

                        <span>
                            ${r.time_seconds}s
                        </span>
                    </div>

                    <div>
                        ${r.berries} Berries
                    </div>

                    ${isAdmin ? `
                        <button
                            onclick="deleteRun(${r.id})"
                            style="
                                margin-top:8px;
                                background:#c62828;
                                color:white;
                                border:none;
                                padding:5px 10px;
                                cursor:pointer;
                            ">
                            Delete
                        </button>
                    ` : ""}
                </div>
            `;
        });
    }

    // ALL BERRIES

    html += `<h2>All Berries</h2>`;

    if (allRuns.length === 0) {

        html += `<p>No runs</p>`;

    } else {

        allRuns.slice(0, 5).forEach((r, i) => {

            const isWR = wrAll && r.id === wrAll.id;

            html += `
                <div style="
                    border:1px solid white;
                    padding:10px;
                    margin-bottom:10px;
                    ${isWR ? "background:#665200;" : ""}
                ">
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    ">
                        <span>
                            #${i + 1} ${r.player_name}
                            ${isWR ? "(WR)" : ""}
                        </span>

                        <span>
                            ${r.time_seconds}s
                        </span>
                    </div>

                    <div>
                        ${r.berries} Berries
                    </div>

                    ${isAdmin ? `
                        <button
                            onclick="deleteRun(${r.id})"
                            style="
                                margin-top:8px;
                                background:#c62828;
                                color:white;
                                border:none;
                                padding:5px 10px;
                                cursor:pointer;
                            ">
                            Delete
                        </button>
                    ` : ""}
                </div>
            `;
        });
    }

    content.innerHTML = html;

    document.getElementById("onepp").onclick = () => {
        leaderboardMode = "1pp";
        openMenuLeaderboard();
    };

    document.getElementById("full").onclick = () => {
        leaderboardMode = "full";
        openMenuLeaderboard();
    };

    document.getElementById("backLeaderboardBtn").onclick = () => {
        leaderboard.remove();
    };
}

function openPatchNotes() {
    document.getElementById("patchNotesModal").style.display = "flex";
}

function closePatchNotes() {
    document.getElementById("patchNotesModal").style.display = "none";
}


window.addEventListener("click", (e) => {
    const modal = document.getElementById("patchNotesModal");

    if (e.target === modal) {
        closePatchNotes();
    }
});
