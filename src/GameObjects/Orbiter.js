//Orbiter.js
//Defines the orbiter class, and implements its functionality

//note: the rocket sprite should point to the right

//functions desingend for outside use:

//update()  required for functionality
//setOrbit(x,y) orbit around x,y
//setTranslate(x,y,time) translate origin to x,y over time
//setShoot() move forward in a straight line
//checkColision(planet) returns true on collision with planet
//checkBounds() returns true if the orbiter leaves the screen


class Orbiter extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,Ox,Oy,rad,angle,texture,switchKey,frame){
        super(scene,x,y,texture,frame)
        scene.add.existing(this)

        //vars
        this.speedMulltiplier = 200;// a true magic number, changes the ratio between radius and speed to about correct
        this.movmentSpeed = 1;      // used to set the speed of a rotation, and the following liner motion
        this.isOrbiting = true;     // toggles between liner and circular motion
        this.isClockwise = false;   // wether the ship rotates clockwise or counterclockwise
        this.switchkey = switchKey; // used to switch the state of the orbiter
        this.angle = angle;         // the angle of the sprite relative to the gameworld
        this.rad = rad;             // the radious of the orbit
        this.originX = Ox;          // x coordinate of the center of an orbit
        this.originY = Oy;          // y coordinate of the center of an orbit
        this.period = 0;            // incremented to create circular motion

        //fixed vars
        this.screenOrigin = 0;      // 0,0 is the top left corner of the window
        this.quarterTurn = 90;      // rotates things 90 degrees
        this.milisPerSec = 1000;    // converts between miliseconds and seconds
        this.degRadConversion = 180/Math.PI // converts between degrees and radians


    }

    update(){
        //Increments the angle of the ship, defines speed and direction of rotation
        if(this.isClockwise){
            this.period += this.movmentSpeed/this.rad;
        }
        else{
            this.period -= this.movmentSpeed/this.rad; 
        }
        //move appropreatly
        if(this.isOrbiting){
            this.orbit();
        }
        else{
            this.shoot();
        }

        //listen for & switch movement modes
        if(Phaser.Input.Keyboard.JustDown(this.switchkey)){
            if(this.isOrbiting){
                this.setShoot();
            }
            else{   //remove to dissalow space switching back to orbital motion
                this.setOrbit(game.input.mousePointer.x,game.input.mousePointer.y);
            }
        }
    }

    //start orbiting around Ox,Oy from current position
    setOrbit(Ox,Oy){
        //update the origin
        this.originX = Ox;
        this.originY = Oy;
        //definine the radious as the distance between the origin and the orbiter
        this.rad = Math.sqrt(Math.pow(this.x-Ox,2)+Math.pow(this.y-Oy,2)); 
        this.isOrbiting = true;
        //make assumptions about the direction of the orbit
        if(this.y<Oy){this.isClockwise = true;} //orbiter always progressses to the right so if it is above the origin it should move clockwise
        else{this.isClockwise = false;}
        //set the period to the correct angle for the current position
        this.period = Math.atan2((this.y-this.originY),(this.x-this.originX));
        this.movmentSpeed = (this.speedMulltiplier/this.rad)*globalSpeed //adjust speed for orbit, bigger orbit = smaller speed, const is a random number
    }

    //continue orbiting with the current parameters
    orbit(){
        //update the position
        this.x = this.originX +  Math.cos(this.period)*this.rad;
        this.y = this.originY +  Math.sin(this.period)*this.rad;

        //set the angle of the ship to be tangent to the orbit
        if(this.isClockwise){
            this.angle = this.period*(this.degRadConversion) + this.quarterTurn;
        }
        else{
            this.angle = this.period*(this.degRadConversion) - this.quarterTurn;
        }
    }

    //translate the origin from current postition to x,y over time
    //only works while obriting
    setTranslate(x,y,time){
        this.scene.tweens.add({
            targets: this,
            originY: {from: this.originY, to: y},
            ease:'Quad',
            duration: time*this.milisPerSec,
        });
        this.scene.tweens.add({
            targets: this,
            originX: {from: this.originX, to: x},
            ease:'Quad',
            duration: time*this.milisPerSec,
        });
    }

    //checks if orbiter will collide with planet
    checkCollision(planet) {
        if (Math.hypot(this.x-planet.x,this.y-planet.y) <= planet.radius) {
            return true;
        }
        return false;
    }
    //checs if the orbiter is out of bounds
    checkBounds(){
        if(this.x < this.screenOrigin || this.x > screenWidth){
            return true;
        }
        if(this.y < this.screenOrigin || this.y > screenHeight){
            return true;
        }
        return false;
    }

    //start liner motion in the direction the ship is currently pointing
    setShoot(){
        this.isOrbiting = false;
    }

    //maintain liner motion 
    shoot(){
        //Move the approprate distance and preportion
        this.x += Math.cos(this.angle*(1/this.degRadConversion))*this.movmentSpeed
        this.y += Math.sin(this.angle*1/this.degRadConversion)*this.movmentSpeed
    }
}
