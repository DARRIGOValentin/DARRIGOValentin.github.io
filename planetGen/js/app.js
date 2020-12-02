/*MIT LICENSE
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

authors : Valentin D'arrigo
*/

import terrain_vert from './terrain_vert.glsl.js'
import terrain_frag from './terrain_frag.glsl.js'

console.log("VERSION 1.0");

class App{
	// Create the three.js canvas, which contains the grids

	constructor(){

		var container = document.getElementById("canvasHolder");

		this.WIDTH = container.clientWidth;
		this.HEIGHT = container.clientHeight;

		this.camera = new THREE.PerspectiveCamera( 70, this.WIDTH / this.HEIGHT, 0.1, 1_000_000 );
		this.camera.position.z = 400;
		this.currentPersective = "perspective";
		this.scene = new THREE.Scene();

		/* ========================================================================================================================================== */

		//const geometry = new THREE.SphereBufferGeometry( 200, 80, 80 );


		const loader = new THREE.OBJLoader();

		var ico;

		var this_ = this;

		loader.load(
			// resource URL
			'js/icoSphere.obj',
			// called when resource is loaded
			function ( object ) {
		
				//scene.add( object );
				//console.log);
				ico = (object.children[0].geometry);
				console.log("OK");

				var material = this_.mat = new THREE.RawShaderMaterial( {
					uniforms: {
						lacunarity: { value: 1.4 },
						persistance: { value: 0.8 },
						zoom: { value: 180.0 }
					},
					vertexShader: terrain_vert,
					fragmentShader: terrain_frag,
					side: THREE.DoubleSide,
				} );
				
				
		
		
				const plane = new THREE.Mesh( ico, material );
		
				var terrain = this_.terrain = plane;
		
				this_.scene.add( terrain );
				
		
			},
			// called when loading is in progresses
			function ( xhr ) {
		
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		
			},
			// called when loading has errors
			function ( error ) {
		
				console.log( 'An error happened' );
		
			}
		);
		
		//const positions = geometry.attributes.position.array;

		/* ========================================================================================================================================== */


		this.scene.add(this.camera);

		//console.log(terrain.geometry.attributes.position.array);	
		


		

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio(this.WIDTH / this.HEIGHT );
		this.renderer.setSize(this.WIDTH,this.HEIGHT );
		container.appendChild( this.renderer.domElement );

		
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement );
		this.controls.screenSpacePanning = true;
		this.controls.enableKeys = false;

	}

	resize(){
		var container = document.getElementById("canvasHolder");
		this.WIDTH = container.clientWidth;
		this.HEIGHT = container.clientHeight;

		this.camera.aspect = this.WIDTH / this.HEIGHT
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.WIDTH, this.HEIGHT );
	}

	render(){
		this.renderer.render( this.scene, this.camera );
	}

	update(){
		//this.controls.update();
	}
}

var app =  new App()

function onWindowResize() {
	app.resize();
}

window.addEventListener( 'resize', onWindowResize, false );


function animate() {
	requestAnimationFrame( animate );;
	app.update();
	app.render();
}

window.onkeydown = checkKey;

function checkKey(e) {

	console.log(e);

	if (e.keyCode == '37') {
	// left arrow
		if (app.camera.fov > 1 ){
			app.camera.fov -= 1;
			app.camera.updateProjectionMatrix();
		}
     
	}
	else if (e.keyCode == '39') {
	// right arrow
		if (app.camera.fov < 180 ){
			app.camera.fov += 1;
			app.camera.updateProjectionMatrix();
		}
	}

	if (e.key == 'p' || e.key == 'P'){ //80
		//app.switchPerspective();
		console.log("888888888");
	}

	if (e.key == 'a' || e.key == 'A'){ //80
		app.mat.uniforms.lacunarity.value += 0.1;
		console.log(app.mat.uniforms.lacunarity.value);
	}

	if (e.key == 'z' || e.key == 'Z'){ //80
		app.mat.uniforms.lacunarity.value -= 0.1;
		console.log(app.mat.uniforms.lacunarity.value);
	}

	if (e.key == 'q' || e.key == 'Q'){ //80
		app.mat.uniforms.persistance.value += 0.1;
		console.log(app.mat.uniforms.persistance.value);
	}

	if (e.key == 's' || e.key == 'S'){ //80
		app.mat.uniforms.persistance.value -= 0.1;
		console.log(app.mat.uniforms.persistance.value);
	}

	if (e.key == 'w' || e.key == 'W'){ //80
		app.mat.uniforms.zoom.value += 0.1;
		console.log(app.mat.uniforms.zoom.value);
	}

	if (e.key == 'x' || e.key == 'X'){ //80
		app.mat.uniforms.zoom.value -= 0.1;
		console.log(app.mat.uniforms.zoom.value);
	}

	//console.log(e);

}

animate();