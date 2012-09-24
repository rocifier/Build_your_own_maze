/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

//game resources
var g_resources = [{
    name: "shapesy",
    type: "image",
    src: "data/img/shapesy.png"
}, {
    name: "shapesz",
    type: "image",
    src: "data/img/shapesz.png"
}, {
    name: "newsh2.shp.000000",
    type: "image",
    src: "data/img/newsh2.shp.000000.png"
}, {
    name: "Test",
    type: "tmx",
    src: "data/Test.tmx"
}, {
    name: "missile1",
    type: "image",
    src: "data/img/missile1.png"
}, {
    name: "missile2",
    type: "image",
    src: "data/img/missile2.png"
}, {
    name: "turret1",
    type: "image",
    src: "data/img/turret1.png"
}, {
    name: "walk",
    type: "image",
    src: "data/img/walk.gif"
}];

var jsApp	= 
{	
	grid: [],
	graph: [],
	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 960, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

		// add our player entity in the entity pool
	   me.entityPool.add("runner", PlayerEntity);
	   me.entityPool.add("turret1", TurretEntity);
	   me.entityPool.add("turret2", TurretEntity);
	   me.entityPool.add("turret3", TurretEntity);
	   me.entityPool.add("turret4", TurretEntity);
	   
	   // enable the keyboard
	   me.input.bindKey(me.input.KEY.LEFT,  "left");
	   me.input.bindKey(me.input.KEY.RIGHT, "right");
       me.input.bindKey(me.input.KEY.UP,  "up");
	   me.input.bindKey(me.input.KEY.DOWN, "down");
      
        // disable gravity
        me.sys.gravity = 0;
        //me.debug.renderHitBox = true;
        
      // start the game 
		me.state.change(me.state.PLAY);
		
	},
	
  // calculate angle between 2 points  
  calcAngle: function(x1, x2, y1, y2) { 
    return -Math.atan2(y2 - y1, x2 - x1);
  },
  
  // calculate x velocity on angle
  calcVelX: function(vel, angle){
    return -vel * Math.sin(angle);
  },
  
  // calculate y velocity on angle
  calcVelY: function(vel, angle){
    return vel * Math.cos(angle);
  },
  
  onMouseClick: function(x, y) {
  	
  	if (me.state.isCurrent(me.state.PLAY)) {
  	
		// compensate for camera position
		x += me.game.viewport.pos.x;
		y += me.game.viewport.pos.y;
		
		// pick tiles
		var pos = jsApp.getTilePosition(x, y);
		var tilesolid = jsApp.isTileSolid(x, y);
		
		if (!tilesolid) {
			// try to walk there
			if (!this.runner.pathTo(pos)) {
				// make bleep error sound and show "cannot walk here. path blocked."
			}
		} else {
			// make bleep error sound and show "cannot walk here. select a floor location."
		}
    }
    
  },
  
  // get tile row and col from pixels
  getTilePosition: function(x, y) {
    var pos = [];
    pos.x = Math.floor(x / me.game.currentLevel.collisionLayer.tilewidth);
    pos.y = Math.floor(y / me.game.currentLevel.collisionLayer.tileheight);  
    return pos;
  },
  
  // get tile position in pixels from pixels
  getTilePosPixels: function(x, y) {
    var tilePos = jsApp.getTilePosition(x, y);
    var pos = [];
    pos.x = tilePos.x * me.game.currentLevel.collisionLayer.tilewidth;
    pos.y = tilePos.y * me.game.currentLevel.collisionLayer.tileheight;
    return pos;
  },
  
  // get tile position in pixels from row and col
  getTileCoord: function(x, y) {
    var pos = [];
    pos.x = x * me.game.currentLevel.collisionLayer.tilewidth;
    pos.y = y * me.game.currentLevel.collisionLayer.tileheight;
    return pos;
  },
  
  isTileSolid: function(x, y) {
    var tilePos = jsApp.getTilePosition(x, y);
    if (me.game.currentLevel.collisionLayer.layerData[~~(tilePos.x)]) {
      var collisionTile = me.game.currentLevel.collisionLayer.layerData[~~(tilePos.x)][~~(tilePos.y)];            
      if (collisionTile != null && collisionTile != undefined) {
        return true;
      }
      else {
        return false;
      }
    }    
  },

	loadMaze: function(mazename)
	{
		me.levelDirector.loadLevel(mazename);
		me.game.sort();
		
		jsApp.runner = me.game.getEntityByName('runner')[0];
		me.game.currentLevel.collisionLayer = me.game.currentLevel.getLayerByName("collision");
		
		// Setup A* graph
        var e = me.game.currentLevel.collisionLayer;
        if (!e.layerData) {
            alert("Error: Collision layer missing!");
            return;
        }
        var g = e.height;
        var f = e.width;
        for (var d = 0; d < f; d += 1) {
            jsApp.grid[d] = [];
            for (var c = 0; c < g; c += 1) {
                var b = jsApp.getTileCoord(d, c);
                if (e.getTile(b.x, b.y) == null) {
                    jsApp.grid[d][c] = 0;
                } else {
                    jsApp.grid[d][c] = 1;
                }
            }
        }
        jsApp.graph = new Graph(jsApp.grid);
        
	}

}; // jsApp



/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
      // load a level
      jsApp.loadMaze("Test");

    	// result is an array containing the shortest path
	},
	
	
	/* ---
	action to perform when game is finished (state change)
	---	*/
	onDestroyEvent: function()
	{
	
   }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
	
	
	$('canvas').click( function(e) {
	  var jsappOffset = $('#jsapp').offset();  
	  var mouseX = e.pageX - jsappOffset.left;
	  var mouseY = e.pageY - jsappOffset.top;
	  jsApp.onMouseClick(mouseX, mouseY);
	});
	
});
