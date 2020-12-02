export default /* glsl */ `
precision highp float;
precision highp int;

uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional

attribute vec3 position;

attribute float noise1;

varying float elevation;

const int BIT_COUNT = 16;

uniform float persistance;
uniform float lacunarity;
uniform float zoom;

vec3 permute(vec3 x){
    return mod(((x*34.0) + 1.0)*x, 289.0 );
}

vec4 permute(vec4 x){
    return mod(((x*34.0) + 1.0)*x, 289.0 );
}

vec3 taylorInvSqrt(vec3 r){
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec2 P){

    const vec2 C = vec2 (0.211324865405187134,
                          0.3660254037844384438597);
    
    vec2 i = floor(P + dot(P, C.yy));
    vec2 x0 = P - i + dot(i, C.xx);

    vec2 i1;
    i1.x = step(x0.y, x0.x);
    i1.y = 1.0 - i1.x;

    vec4 x12 = x0.xyxy + vec4 (C.xx, C.xx * 2.0 - 1.0);
    x12.xy -= i1;

    i = mod (i, 289.0);
    vec3 p = permute(permute(i.y+vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot (x12.zw, x12.zw)), 0.0);

    m = m*m;
    m = m*m;

    vec3 x = fract(p*(1.0 / 41.0)) * 2.0 - 1.0;
    vec3 gy = abs(x) - 0.5;
    vec3 ox = floor (x+0.5);
    vec3 gx = x - ox;

    m *= taylorInvSqrt(gx*gx + gy*gy);

    vec3 g;
    g.x = gx.x * x0.x + gy.x * x0.y;
    g.yz = gx.yz * x12.xz + gy.yz * x12.yw;

    return 130.0 * dot(m, g);
}

float snoise3(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step (x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min (g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute( permute( permute (
        i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
        i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w); 

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), 
        dot(p3, p3)));

    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)
        ), 0.0);

    m = m*m;

    return 42.0 * dot (m*m,  vec4(dot(p0, x0), dot(p1,x1), 
                                  dot(p2, x2), dot(p3, x3)));
}

float fbm_noise2(float x, float y, float z){

    //float lacunarity = 0.3;
    //float persistance = 3.5;

    float freq = 1.0;
    float amp = 1.0;
    float max = 0.0;
    float total = 0.0;

    for(int i = 0; i < 6; i++){
        total += snoise3( vec3(x*freq, y*freq, z*freq) ) * amp;
        //total += snoise3( vec3(0.0, 0.0, 0.0) ) * amp;
        //total += noise2( x*freq, y*freq ) * amp;
        max += amp;
        freq *= lacunarity;
        amp *= persistance;
    }

    return total/max;
}

void main()	{

    //init_PERM();
    //init_GRAD3();

    float noise = fbm_noise2(position.x / zoom, position.y / zoom, position.z / zoom);

    vec3 newPos = position * (1.0 + noise/50.0);
    //vec3 newPos = position;

    elevation = noise;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );

}
`;