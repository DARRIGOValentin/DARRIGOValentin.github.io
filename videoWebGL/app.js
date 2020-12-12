import video_vert from './video_vert.glsl.js'
import video_frag from './video_frag.glsl.js'

function createShader(gl, shaderType, source){
  let shader = gl.createShader(shaderType);

  gl.shaderSource(shader, source);
  gl.compileShader(shader)
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if(!success){
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource){
  let program = gl.createProgram()

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if(!success){
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  return program;
}

class Video{
  constructor(gl){

    this.isReady = false;

    const vsSource = video_vert;
    const fsSource = video_frag;

    const program = createProgram(gl, vsSource, fsSource);

    this.programInfo = {
      program: program,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
      },
      uniformLocations: {
        uSampler: gl.getUniformLocation(program, 'uSampler'),

        r: gl.getUniformLocation(program, 'r'),
        g: gl.getUniformLocation(program, 'g'),
        b: gl.getUniformLocation(program, 'b'),

        delta:  gl.getUniformLocation(program, 'delta')

      },

      uniformValues:{
        r: 1.0,
        g: 1.0,
        b: 1.0,
        delta: 0
      }
    };

    this.buffers = this.initBuffers(gl);
    this.texture = this.initTexture(gl);
    this.video = this.setupVideo('mario.mp4');

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(
          this.programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          this.programInfo.attribLocations.vertexPosition);
    }

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
      gl.vertexAttribPointer(
          this.programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          this.programInfo.attribLocations.textureCoord);
    }
  }

  initBuffers(gl){
    //----------------------------------------------------------------------------------------------------
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //----------------------------------------------------------------------------------------------------
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
      // Front
      0.0,  1.0,
      1.0,  1.0,
      1.0,  0.0,
      0.0,  0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    //----------------------------------------------------------------------------------------------------
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
      0,  1,  2,      0,  2,  3,    // front
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }

  initTexture(gl){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    return texture;
  }

  setupVideo(url){
    const video = document.createElement('video');

    const this_ = this;
  
    var playing = false;
    var timeupdate = false;
  
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
  
    video.addEventListener('playing', function() {
      playing = true;
      checkReady();
   }, true);
  
   video.addEventListener('timeupdate', function() {
      timeupdate = true;
      checkReady();
   }, true);
  
    video.src = url;
    video.play();
  
    function checkReady() {
      if (playing && timeupdate) {
        this_.isReady = true;
      }
    }
  
    return video;
  }

  draw(gl){

    if (this.isReady) {
      this.updateTexture(gl);
    }
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
  
    gl.useProgram(this.programInfo.program);
  
    gl.activeTexture(gl.TEXTURE0);
  
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  
    gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

    gl.uniform1f(this.programInfo.uniformLocations.r, this.programInfo.uniformValues.r);
    gl.uniform1f(this.programInfo.uniformLocations.g, this.programInfo.uniformValues.g);
    gl.uniform1f(this.programInfo.uniformLocations.b, this.programInfo.uniformValues.b);

    gl.uniform1i(this.programInfo.uniformLocations.delta, this.programInfo.uniformValues.delta);

  
    {
      const vertexCount = 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  updateTexture(gl) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, this.video);
  }
}

class App{
  constructor(){
    const canvas = document.querySelector('#glcanvas');
    const gl = this.gl = canvas.getContext('webgl');

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.canvas.width = canvas.width = 640;
    gl.canvas.height = canvas.height = 480;
    canvas.style.backgroundColor = "black";

    this.video = new Video(gl);
    
  }

  run(){
    const app = this;

    function loop(){

      app.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
      app.gl.clearDepth(1.0);                 // Clear everything
      app.gl.clear(app.gl.COLOR_BUFFER_BIT | app.gl.DEPTH_BUFFER_BIT);
    
      app.video.draw(app.gl);
    
      requestAnimationFrame(loop);
    }
    
    requestAnimationFrame(loop);
  }
  
}

function initRedSliderListener(app){
  var slider = document.getElementById("sliderRValue");
  var output = document.getElementById("ROutput");
  output.innerHTML = slider.value; // Display the default slider value

  app.video.programInfo.uniformValues.r = slider.value;

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    app.video.programInfo.uniformValues.r = this.value;
  }
}

function initGreenSliderListener(app){
  var slider = document.getElementById("sliderGValue");
  var output = document.getElementById("GOutput");
  output.innerHTML = slider.value; // Display the default slider value

  app.video.programInfo.uniformValues.g = slider.value;

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    app.video.programInfo.uniformValues.g = this.value;
  }
}

function initBlueSliderListener(app){
  var slider = document.getElementById("sliderBValue");
  var output = document.getElementById("BOutput");
  output.innerHTML = slider.value; // Display the default slider value

  app.video.programInfo.uniformValues.b = slider.value;

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    app.video.programInfo.uniformValues.b = this.value;
  }
}

function initSelectListener(app){
  var select = document.getElementById("operations");

  select.onchange = function(){
    app.video.programInfo.uniformValues.delta = (this.value === "divide") ? 1 : 0;
  }
}

function initListeners(app){
  initRedSliderListener(app);
  initGreenSliderListener(app);
  initBlueSliderListener(app);
  initSelectListener(app);
}

function main(){
  let app = new App();
  initListeners(app);
  app.run();
}

main();



