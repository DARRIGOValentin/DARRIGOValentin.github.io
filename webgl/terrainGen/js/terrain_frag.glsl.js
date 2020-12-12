export default /* glsl */ `

    precision mediump float;
    precision mediump int;

    varying float elevation;


    void main()	{

        if (elevation > 0.9){
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
        else if (elevation > 0.5){
            gl_FragColor = vec4(0.3, 0.0, 0.0, 1.0);
        }
        else if (elevation > 0.0){
            gl_FragColor = vec4(0.0, 0.8, 0.0, 1.0);
        }
        else if (elevation > -0.5){
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
        else{
            gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
        }
        

    }
`;