
/*------------------- 
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
 		// set default acceleration
 		this.setVelocity(5, 5);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        if (me.input.isKeyPressed('left')) {
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
    	} else {
            this.vel.x = 0;
    	}
    	
        if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.vel.y -= this.accel.y * me.timer.tick;
        } else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.vel.y += this.accel.y * me.timer.tick;
        } else {
            this.vel.y = 0;
        }
 
        // check & update player movement
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent(this);
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});



/* --------------------------
an enemy turret
------------------------ */
var TurretEntity = me.ObjectEntity.extend({

	MissileEntity missile;
	
    init: function(x, y, settings) {

        // call the parent constructor
        this.parent(x, y, settings);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
 		missile = new MissileEntity();
 		
    },
 
    // manage the enemy movement
    update: function() {
    
    	// handle projectiles
    	
        // check and update movement
        this.updateMovement();

        return false;
    }
});


/* --------------------------
an enemy missile
------------------------ */
var MissileEntity = me.ObjectEntity.extend({

	var missile;
	
    init: function(x, y, settings) {

		// todo: image angle
		settings.image = "missile1";

        // call the parent constructor
        this.parent(x, y, settings);

        // make it collidable
        this.collidable = true;
        
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
    
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
    },
    
    // manage the enemy movement
    update: function() {

        // check and update movement
        this.updateMovement();

        return true;
    }
});
    