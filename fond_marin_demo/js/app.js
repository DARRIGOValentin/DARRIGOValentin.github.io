function App(){

	console.log("hello???");

	var container = document.getElementById("canvasHolder");

		var WIDTH = this.WIDTH =  container.clientWidth;
		var HEIGHT = this.HEIGHT = container.clientHeight;
		
		var scene = this.scene = new THREE.Scene();
		scene.background = new THREE.Color("rgb(0, 0, 0)");
		scene.fog = new THREE.FogExp2( 0xaaaaaa, 0.05);

		var camera = this.camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 1000);
		camera.position.set(0, 8, 8);

		var renderer = this.renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		var ambiantLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 1)
		scene.add(ambiantLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		var controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement );
		controls.screenSpacePanning = true;
		controls.enableKeys = false;	

		

		var loader = new THREE.OBJLoader();

		var _this = this
		loader.load("./obj/fond_marin.obj",
			function(object){
				object.rotateX(-Math.PI/2);
				scene.add(object);
			},
			function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
		);
}

App.prototype.resize = function(){
	var container = document.getElementById("canvasHolder");
		this.WIDTH = container.clientWidth;
		this.HEIGHT = container.clientHeight;

		this.camera.aspect = this.WIDTH / this.HEIGHT
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.WIDTH, this.HEIGHT );
};

function run(){

	var app = new App()


	function onWindowResize() {
		app.resize();
	}
	window.addEventListener( 'resize', onWindowResize, false );

	function animate(){
		requestAnimationFrame(animate);
		//app.update();
		app.renderer.render(app.scene, app.camera);
	};

	animate();
}

run();
