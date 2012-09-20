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
    name: "walk",
    type: "image",
    src: "data/img/walk.gif"
}];

var jsApp	= 
{	
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
	   
	   // enable the keyboard
	   me.input.bindKey(me.input.KEY.LEFT,  "left");
	   me.input.bindKey(me.input.KEY.RIGHT, "right");
       me.input.bindKey(me.input.KEY.UP,  "up");
	   me.input.bindKey(me.input.KEY.DOWN, "down");
      
        // disable gravity
        me.sys.gravity = 0;
        
      // start the game 
		me.state.change(me.state.PLAY);
		
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
      // load a level
        me.levelDirector.loadLevel("Test");
        
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
});
