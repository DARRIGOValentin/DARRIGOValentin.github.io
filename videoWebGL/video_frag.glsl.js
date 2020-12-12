export default /* glsl */ `
precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float r;
uniform float g;
uniform float b;

uniform bool delta;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  if (delta){
    gl_FragColor = vec4(texelColor.rgb, texelColor.a) / vec4(r, g, b, 0.0);
  }
  else{
    gl_FragColor = vec4(texelColor.rgb, texelColor.a) * vec4(r, g, b, 0.0);
  }
}
  
`;