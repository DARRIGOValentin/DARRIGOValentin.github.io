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

	constructor(){

		var container = document.getElementById("canvasHolder");

		this.WIDTH = container.clientWidth;
		this.HEIGHT = container.clientHeight;

		this.camera = new THREE.PerspectiveCamera( 70, this.WIDTH / this.HEIGHT, 0.1, 1_000_000 );
		this.camera.position.z = 400;
		this.currentPersective = "perspective";
		this.scene = new THREE.Scene();

		/* ========================================================================================================================================== */

		const loader = new THREE.OBJLoader();

		var ico;

		var this_ = this;

		loader.load(
			// resource URL
			'js/icoSphere.obj',
			// called when resource is loaded
			function ( object ) {
		
				ico = (object.children[0].geometry);

				var material = this_.mat = new THREE.RawShaderMaterial( {
					uniforms: {
						lacunarity: { value: 2.1 },
						persistance: { value: 0.7 },
						zoom: { value: 250.0 },
						
						snowHeight: { value: 0.4 },
						mountainHeight: { value: 0.2 },
						grassHeight: { value: 0.0 },
						waterHeight: { value: -0.1 },
						reliefExageration: { value: 0.02},

						snowColor: { value: new THREE.Color(1.0, 1.0, 1.0)},
						mountainColor: { value: new THREE.Color(0.4, 0.0, 0.0)},
						grassColor: { value: new THREE.Color(0.0, 0.8, 0.0)},
						waterColor: { value: new THREE.Color(0.5, 0.5, 1.0)},
						deepWaterColor: { value: new THREE.Color(0.0, 0.0, 0.7)},
					},
					vertexShader: terrain_vert,
					fragmentShader: terrain_frag,
					side: THREE.DoubleSide,
				} );
				
				const plane = new THREE.Mesh( ico, material );
		
				var terrain = this_.terrain = plane;
		
				this_.scene.add( terrain );
			},
			
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			
			function ( error ) {
				console.log( 'An error happened' );
			}
		);

		/* ========================================================================================================================================== */


		this.scene.add(this.camera);

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

function zoomOnChange(value){
	app.mat.uniforms.zoom.value = value;
}

function lacunarityOnChange(value){
	app.mat.uniforms.lacunarity.value = value;
}

function persistanceOnChange(value){
	app.mat.uniforms.persistance.value = value;
}

function snowHeightOnChange(value){
	app.mat.uniforms.snowHeight.value = value;
}

function mountainHeightOnChange(value){
	app.mat.uniforms.mountainHeight.value = value;
}

function grassHeightOnChange(value){
	app.mat.uniforms.grassHeight.value = value;
}

function waterHeightOnChange(value){
	app.mat.uniforms.waterHeight.value = value;
}

function reliefExagerationOnChange(value){
	app.mat.uniforms.reliefExageration.value = value;
}

function snowColorOnChange(value){
	const colorNumber = Number("0x" + value.substring(1) );
	app.mat.uniforms.snowColor.value = new THREE.Color(colorNumber);
}

function mountainColorOnChange(value){
	const colorNumber = Number("0x" + value.substring(1) );
	app.mat.uniforms.mountainColor.value = new THREE.Color(colorNumber);
}

function grassColorOnChange(value){
	const colorNumber = Number("0x" + value.substring(1) );
	app.mat.uniforms.grassColor.value = new THREE.Color(colorNumber);
}

function waterColorOnChange(value){
	const colorNumber = Number("0x" + value.substring(1) );
	app.mat.uniforms.waterColor.value = new THREE.Color(colorNumber);
}

function deepWaterColorOnChange(value){
	const colorNumber = Number("0x" + value.substring(1) );
	app.mat.uniforms.deepWaterColor.value = new THREE.Color(colorNumber);
}

function setEvent(){
	console.log("OK EVENT");
	var el;

	el = document.getElementById('zoomInput');
	el.addEventListener('change', function(e){
		zoomOnChange(this.value);
	}, false);

	el = document.getElementById('lacunarityInput');
	el.addEventListener('change', function(e){
		lacunarityOnChange(this.value);
	}, false);

	el = document.getElementById('persistanceInput');
	el.addEventListener('change', function(e){
		persistanceOnChange(this.value);
	}, false);

	el = document.getElementById('snowHeightInput');
	el.addEventListener('change', function(e){
		snowHeightOnChange(this.value);
	}, false);

	el = document.getElementById('mountainHeightInput');
	el.addEventListener('change', function(e){
		mountainHeightOnChange(this.value);
	}, false);

	el = document.getElementById('grassHeightInput');
	el.addEventListener('change', function(e){
		grassHeightOnChange(this.value);
	}, false);

	el = document.getElementById('waterHeightInput');
	el.addEventListener('change', function(e){
		waterHeightOnChange(this.value);
	}, false);

	el = document.getElementById('reliefExagerationInput');
	el.addEventListener('change', function(e){
		reliefExagerationOnChange(this.value);
	}, false);

	el = document.getElementById('snowColorInput');
	el.addEventListener('change', function(e){
		snowColorOnChange(this.value);
	}, false);

	el = document.getElementById('mountainColorInput');
	el.addEventListener('change', function(e){
		mountainColorOnChange(this.value);
	}, false);

	el = document.getElementById('grassColorInput');
	el.addEventListener('change', function(e){
		grassColorOnChange(this.value);
	}, false);

	el = document.getElementById('waterColorInput');
	el.addEventListener('change', function(e){
		waterColorOnChange(this.value);
	}, false);

	el = document.getElementById('deepWaterColorInput');
	el.addEventListener('change', function(e){
		deepWaterColorOnChange(this.value);
	}, false);

}

setEvent();

animate();