//End.js
//End Screen

class End extends Phaser.Scene {
    constructor(){
        super("endScene")
    }

    preload(){
        this.load.image('menuBG', './assets/menu/menuBackground.png');
        this.load.image('menuBGStars', './assets/menu/menuBackgroundStars.png');
        this.load.image('cursorParticles', './assets/menu/cursorParticles.png');
    }

    create(){
        //Fades in the Scene
        this.cameras.main.fadeIn(500);
        
        this.menuBackground = this.add.tileSprite(0, 0, game.config.width, game.config.height, "menuBG").setOrigin(0,0).setScrollFactor(0);
        this.menuBackgroundStars = this.add.tileSprite(0, 0, game.config.width, game.config.height, "menuBGStars").setOrigin(0,0).setScrollFactor(0);

        //Create a particle emitter to shoot flames out of the mouse
        this.mouseFlameEmitter = this.add.particles('cursorParticles').createEmitter({
            x: -3000,
            y: -3000,
            speed: { min: -100, max: 100 },
            angle: { min: 360, max: 360 },
            scale: { start: 0, end: 0.4 },
            alpha: { start: 1, end: 0, ease: 'Expo.easeIn' },
            blendMode: 'SCREEN',
            gravityY: 500,
            lifespan: 900
        });

        //define Keys (potentialy temparary) used for navigation
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        //text configuration
        this.textConfig = {
            fontFamily: 'Courier',
            fontSize: '200px',
            color: '#707081',
            backgroundColor: null,
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(screenWidth/2,screenHeight/2,"Score:" + gameScore,this.textConfig).setOrigin(0.5,1)
        this.add.text(screenWidth/2,screenHeight/2,"High Score:" + highScore,this.textConfig).setOrigin(0.5,0)

        this.textConfig.fontSize = '100px';
        this.add.text(screenWidth/2,screenHeight,'space to replay, esc for menu',this.textConfig).setOrigin(0.5,1)

    }

    update(){
        //Update Mouse flame location
        this.mouseFlameEmitter.setPosition(this.game.input.mousePointer.x + 40, this.game.input.mousePointer.y + 30);

        this.parallaxBackground();

        //potentialy temparary navigation back to menu
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start('menuScene')
        }

    }

    parallaxBackground(){
        this.menuBackground.tilePositionX = this.game.input.mousePointer.x / 20;
        this.menuBackground.tilePositionY = this.game.input.mousePointer.y / 20;
        this.menuBackgroundStars.tilePositionX = this.game.input.mousePointer.x / 35;
        this.menuBackgroundStars.tilePositionY = this.game.input.mousePointer.y / 35;
    }
}