
/*------------------- 
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        this.parent(x, y, settings);
 
 		// set default acceleration and max velocity
 		this.setVelocity(5, 5);
 		
 		// make it collidable
        this.collidable = true;
        
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        // set pathing variables
        this.isPathing = false;
        this.pathingIndex = 0;
        this.path = [];
        this.busyWalking = false;
        
 		console.log('player created.');
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
 
		// check for collision
		var res = me.game.collide(this);
		if (res && res.obj.type == me.game.ENEMY_OBJECT) {
			console.log('hit');
		}
		
		// pathfinding movement
		this.doPathing();

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
    },
    
    pathTo: function(dest) {
    	var runnerPos = jsApp.runner.pos;
    	var src = jsApp.getTilePosition(runnerPos.x, runnerPos.y);
    	
        var a = jsApp.graph.nodes[src.x][src.y];
        var b = jsApp.graph.nodes[dest.x][dest.y];
        this.path = astar.search(jsApp.graph.nodes, a, b, true);
        
        if (this.path.length == 0) {
        	return false;  // no modification to path because the new one is invalid
        } else {
        	this.isPathing = true;  // Begin new path..
        	this.pathingIndex = 0;  // Starting at node 0
        }

    	return true;
    },
    
    doPathing: function() {
    	if (this.isPathing) {
    		if (!this.busyWalking) {
    			jsApp.runner.busyWalking = true;
				var dest = this.path[this.pathingIndex];
				this.destPixels = jsApp.getTileCoord(dest.x, dest.y);
				
				tween = new me.Tween(this.pos)
					.to({x: this.destPixels.x, y: this.destPixels.y}, 100)
					.onComplete( function() {
						if (jsApp.runner.isPathing) {
							jsApp.runner.busyWalking = false;
							jsApp.runner.pathingIndex++;
							if (jsApp.runner.pathingIndex >= jsApp.runner.path.length) {
								// reached final destination
								jsApp.runner.pathingIndex = 0;
								jsApp.runner.isPathing = false;
							}
						}
					});
				tween.start();
			}
		}
    },
    
 
});



/* --------------------------
an enemy turret
------------------------ */
var TurretEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {

		settings.image = "turret1";
		settings.spritewidth = 21;
		settings.spriteheight = 21;
		
        this.parent(x, y, settings);

        // make it collidable
        this.collidable = true;

 		this.spawnedBullet = false;

    },
    
    // manage the enemy movement
    update: function() {
    	this.parent();
    	
    	if (!this.spawnedBullet) {
    		this.spawnedBullet = true;
    		var missile = new MissileEntity(this.pos.x+8, this.pos.y, { image: 'missile2', spritewidth: 7, spriteheight: 7 });
 			me.game.add(missile, this.z);
 			me.game.sort();
 		}
 
		// check for collision
		var res = me.game.collide(this);
		if (res && res.obj.type == me.game.ENEMY_OBJECT) {
			
		}

        // check and update movement
        this.updateMovement();

		this.parent(this);
		
        return true;
    }
});


/* --------------------------
an enemy missile
------------------------ */
var MissileEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
		this.startx = x;
		this.starty = y;
		
		// todo: image angle

        this.parent(x, y, settings);

		// set default acceleration
 		this.setVelocity(0, 2);
 		
        // make it collidable
        this.collidable = true;
        this.collidedWithSolids = 0;
        
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
    
    // manage the enemy movement
    update: function() {

		if (!this.visible){
			// remove myself if not on the screen anymore
            //me.game.remove(this);
		}
		
		// update the entity velocity
        this.vel.y -= this.accel.y * me.timer.tick;
        
		// check for collision with player
		var res = me.game.collide(this);
		if (res) {
			this.collidedWithSolids++;
			
			//console.log('bullet hit');
		}

        // check and update movement
        var res = this.updateMovement();
        if (res.x != 0 || res.y !=0 ) {
			this.pos.x = this.startx;
 			this.pos.y = this.starty;
 			this.vel.y = 0;
		}
		
		this.parent(this);
		
        return true;
    }
});
    