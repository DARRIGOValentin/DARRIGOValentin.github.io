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

console.log("VERSION 1.1");

class MyCube{


	constructor(size){
		var geometry = new THREE.BufferGeometry();

		var points = [];
		var colors = [];
		var hsize = size/2;

		var r, g, b;

		//face 1.1 red
		r = 1.0, g = 0.0, b = 0.0; 
		points.push(-hsize, -hsize, hsize,
		             hsize, -hsize, hsize,
		            -hsize,  hsize, hsize);
		
		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 1.2 red
		points.push( hsize, -hsize, hsize,
		             hsize,  hsize, hsize,
		            -hsize,  hsize, hsize);

		
		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 2.1 yellow
		r = 1.0, g = 1.0, b = 0.0; 
		points.push(-hsize, -hsize, -hsize,
		             hsize, -hsize, -hsize,
		            -hsize,  hsize, -hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 2.2 yellow
		points.push( hsize, -hsize, -hsize,
		             hsize,  hsize, -hsize,
		            -hsize,  hsize, -hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 3.1 green
		r = 0.0, g = 1.0, b = 0.0; 
		points.push( hsize,  -hsize,  -hsize,
		             hsize,   hsize,  -hsize,
		             hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 3.2 green
		points.push( hsize,   hsize,  -hsize,
		             hsize,   hsize,   hsize,
		             hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 4.1 cyan
		r = 0.0, g = 1.0, b = 1.0; 
		points.push( -hsize,  -hsize,  -hsize,
		             -hsize,   hsize,  -hsize,
		             -hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 4.2 cyan
		points.push( -hsize,   hsize,  -hsize,
		             -hsize,   hsize,   hsize,
		             -hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 5.1 blue
		r = 0.0, g = 0.0, b = 1.0; 
		points.push( -hsize,   hsize,  -hsize,
		              hsize,   hsize,  -hsize,
		             -hsize,   hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 5.2 blue
		points.push(  hsize,   hsize,  -hsize,
		              hsize,   hsize,   hsize,
		             -hsize,   hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 5.1 magenta
		r = 1.0, g = 0.0, b = 1.0; 
		points.push( -hsize,  -hsize,  -hsize,
		              hsize,  -hsize,  -hsize,
		             -hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		//face 5.2 magenta
		points.push(  hsize,  -hsize,  -hsize,
		              hsize,  -hsize,   hsize,
		             -hsize,  -hsize,   hsize);

		colors.push(r, g, b,
		            r, g, b,
		            r, g, b);

		var positionAttribute = new THREE.Float32BufferAttribute( points, 3 );
		var colorAttribute = new THREE.Float32BufferAttribute( colors, 3 );

		geometry.setAttribute( 'position', positionAttribute );
		geometry.setAttribute( 'color', colorAttribute );

		var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side: THREE.DoubleSide} );
		this.mesh = new THREE.Mesh( geometry, material );


		this.colors = this.mesh.geometry.attributes.color; // colors of every point of the mesh
		this.points = this.mesh.geometry.attributes.position; // every point of the mesh


		var materialLine = new THREE.LineBasicMaterial( { color: 0xffffff} );
		var geometryLine = new THREE.Geometry();

		
		geometryLine.vertices.push(new THREE.Vector3(-hsize, -1000000, hsize));
		geometryLine.vertices.push(new THREE.Vector3(-hsize,  1000000, hsize));

		geometryLine.vertices.push(new THREE.Vector3( hsize, -1000000, hsize));
		geometryLine.vertices.push(new THREE.Vector3( hsize,  1000000, hsize));

		geometryLine.vertices.push(new THREE.Vector3(-hsize, -1000000, -hsize));
		geometryLine.vertices.push(new THREE.Vector3(-hsize,  1000000, -hsize));

		geometryLine.vertices.push(new THREE.Vector3( hsize, -1000000, -hsize));
		geometryLine.vertices.push(new THREE.Vector3( hsize,  1000000, -hsize));

		geometryLine.vertices.push(new THREE.Vector3(-1000000, hsize, hsize));
		geometryLine.vertices.push(new THREE.Vector3( 1000000, hsize, hsize));

		geometryLine.vertices.push(new THREE.Vector3(-1000000, hsize, -hsize));
		geometryLine.vertices.push(new THREE.Vector3( 1000000, hsize, -hsize));

		geometryLine.vertices.push(new THREE.Vector3(-1000000, -hsize, hsize));
		geometryLine.vertices.push(new THREE.Vector3( 1000000, -hsize, hsize));

		geometryLine.vertices.push(new THREE.Vector3(-1000000, -hsize, -hsize));
		geometryLine.vertices.push(new THREE.Vector3( 1000000, -hsize, -hsize));

		geometryLine.vertices.push(new THREE.Vector3( hsize, hsize, -1000000));
		geometryLine.vertices.push(new THREE.Vector3( hsize, hsize,  1000000));

		geometryLine.vertices.push(new THREE.Vector3( -hsize, hsize, -1000000));
		geometryLine.vertices.push(new THREE.Vector3( -hsize, hsize,  1000000));

		geometryLine.vertices.push(new THREE.Vector3( hsize, -hsize, -1000000));
		geometryLine.vertices.push(new THREE.Vector3( hsize, -hsize,  1000000));

		geometryLine.vertices.push(new THREE.Vector3( -hsize, -hsize, -1000000));
		geometryLine.vertices.push(new THREE.Vector3( -hsize, -hsize,  1000000));

		this.line = new THREE.LineSegments( geometryLine, materialLine );
	}
}

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

		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var obj = new THREE.Mesh( geometry, material );

		var cube = this.cube = new MyCube(200);

		this.scene.add( cube.mesh );
		this.scene.add( cube.line );
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

	switchPerspective(){
		console.log(this.currentPersective);

		if (this.currentPersective == "perspective"){
			this.controls.dispose();
			this.scene.remove(this.camera);
			this.camera = new THREE.OrthographicCamera(this.WIDTH / - 2, this.WIDTH / 2, this.HEIGHT / 2, this.HEIGHT / - 2, 1, 1_000_000 );
			this.scene.add(this.camera);
			this.camera.position.z = 400;
			this.currentPersective = "orthographic";

			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement );
			this.controls.screenSpacePanning = true;
			this.controls.enableKeys = false;
		}

		else if (this.currentPersective == "orthographic"){
			this.controls.dispose();
			this.scene.remove(this.camera);
			this.camera = new THREE.PerspectiveCamera( 70, this.WIDTH / this.HEIGHT, 0.1, 1_000_000 );
			this.scene.add(this.camera);
			this.camera.position.z = 400;
			this.currentPersective = "perspective";

			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement );
			this.controls.screenSpacePanning = true;
			this.controls.enableKeys = false;
		}
		
	}
}

app =  new App()

app.cube.mesh.rotateY(Math.PI/8);
app.cube.line.rotateY(Math.PI/8);

function onWindowResize() {
	app.resize();
}

window.addEventListener( 'resize', onWindowResize, false );


function animate() {
	requestAnimationFrame( animate );
	console.log(app.cube);
	//app.cube.mesh.rotateX(0.01);
	//app.cube.line.rotateX(0.01);
	app.update();
	app.render();
}

window.onkeydown = checkKey;

function checkKey(e) {

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
		app.switchPerspective();
	}

	//console.log(e);

}

animate();