export default /* glsl */ `

    precision mediump float;
    precision mediump int;

    varying float elevation;

    uniform float snowHeight;
    uniform float mountainHeight;
    uniform float grassHeight;
    uniform float waterHeight;

    uniform vec3 snowColor;
    uniform vec3 mountainColor;
    uniform vec3 grassColor;
    uniform vec3 waterColor;
    uniform vec3 deepWaterColor;


    void main()	{

        if (elevation > snowHeight){
            gl_FragColor = vec4(snowColor, 1.0);
        }
        else if (elevation > mountainHeight){
            gl_FragColor = vec4(mountainColor, 1.0);
        }
        else if (elevation > grassHeight){
            gl_FragColor = vec4(grassColor, 1.0);
        }
        else if (elevation > waterHeight){
            gl_FragColor = vec4(waterColor, 1.0);
        }
        else{
            gl_FragColor = vec4(deepWaterColor, 1.0);
        }
        

    }
`;