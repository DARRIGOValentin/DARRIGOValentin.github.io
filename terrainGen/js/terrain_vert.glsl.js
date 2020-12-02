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


int modi(int x, int y) {
    return x - y * (x / y);
}


int PERM[512]; 
void init_PERM(){
    PERM[0] = 151; PERM[1] = 160; PERM[2] = 137; PERM[3] = 91; PERM[4] = 90; PERM[5] = 15; PERM[6] = 131; PERM[7] = 13; PERM[8] = 201; PERM[9] = 95; PERM[10] = 96; PERM[11] = 53; PERM[12] = 194; PERM[13] = 233; PERM[14] = 7; PERM[15] = 225; PERM[16] = 140; PERM[17] = 36; PERM[18] = 103; PERM[19] = 30; PERM[20] = 69; PERM[21] = 142; PERM[22] = 8; PERM[23] = 99; PERM[24] = 37; PERM[25] = 240; PERM[26] = 21; PERM[27] = 10; PERM[28] = 23; PERM[29] = 190; PERM[30] = 6; PERM[31] = 148; PERM[32] = 247; PERM[33] = 120; PERM[34] = 234; PERM[35] = 75; PERM[36] = 0; PERM[37] = 26; PERM[38] = 197; PERM[39] = 62; PERM[40] = 94; PERM[41] = 252; PERM[42] = 219; PERM[43] = 203; PERM[44] = 117; PERM[45] = 35; PERM[46] = 11; PERM[47] = 32; PERM[48] = 57; PERM[49] = 177; PERM[50] = 33; PERM[51] = 88; PERM[52] = 237; PERM[53] = 149; PERM[54] = 56; PERM[55] = 87; PERM[56] = 174; PERM[57] = 20; PERM[58] = 125; PERM[59] = 136; PERM[60] = 171; PERM[61] = 168; PERM[62] = 68; PERM[63] = 175; PERM[64] = 74; PERM[65] = 165; PERM[66] = 71; PERM[67] = 134; PERM[68] = 139; PERM[69] = 48; PERM[70] = 27; PERM[71] = 166; PERM[72] = 77; PERM[73] = 146; PERM[74] = 158; PERM[75] = 231; PERM[76] = 83; PERM[77] = 111; PERM[78] = 229; PERM[79] = 122; PERM[80] = 60; PERM[81] = 211; PERM[82] = 133; PERM[83] = 230; PERM[84] = 220; PERM[85] = 105; PERM[86] = 92; PERM[87] = 41; PERM[88] = 55; PERM[89] = 46; PERM[90] = 245; PERM[91] = 40; PERM[92] = 244; PERM[93] = 102; PERM[94] = 143; PERM[95] = 54; PERM[96] = 65; PERM[97] = 25; PERM[98] = 63; PERM[99] = 161; PERM[100] = 1; PERM[101] = 216; PERM[102] = 80; PERM[103] = 73; PERM[104] = 209; PERM[105] = 76; PERM[106] = 132; PERM[107] = 187; PERM[108] = 208; PERM[109] = 89; PERM[110] = 18; PERM[111] = 169; PERM[112] = 200; PERM[113] = 196; PERM[114] = 135; PERM[115] = 130; PERM[116] = 116; PERM[117] = 188; PERM[118] = 159; PERM[119] = 86; PERM[120] = 164; PERM[121] = 100; PERM[122] = 109; PERM[123] = 198; PERM[124] = 173; PERM[125] = 186; PERM[126] = 3; PERM[127] = 64; PERM[128] = 52; PERM[129] = 217; PERM[130] = 226; PERM[131] = 250; PERM[132] = 124; PERM[133] = 123; PERM[134] = 5; PERM[135] = 202; PERM[136] = 38; PERM[137] = 147; PERM[138] = 118; PERM[139] = 126; PERM[140] = 255; PERM[141] = 82; PERM[142] = 85; PERM[143] = 212; PERM[144] = 207; PERM[145] = 206; PERM[146] = 59; PERM[147] = 227; PERM[148] = 47; PERM[149] = 16; PERM[150] = 58; PERM[151] = 17; PERM[152] = 182; PERM[153] = 189; PERM[154] = 28; PERM[155] = 42; PERM[156] = 223; PERM[157] = 183; PERM[158] = 170; PERM[159] = 213; PERM[160] = 119; PERM[161] = 248; PERM[162] = 152; PERM[163] = 2; PERM[164] = 44; PERM[165] = 154; PERM[166] = 163; PERM[167] = 70; PERM[168] = 221; PERM[169] = 153; PERM[170] = 101; PERM[171] = 155; PERM[172] = 167; PERM[173] = 43; PERM[174] = 172; PERM[175] = 9; PERM[176] = 129; PERM[177] = 22; PERM[178] = 39; PERM[179] = 253; PERM[180] = 19; PERM[181] = 98; PERM[182] = 108; PERM[183] = 110; PERM[184] = 79; PERM[185] = 113; PERM[186] = 224; PERM[187] = 232; PERM[188] = 178; PERM[189] = 185; PERM[190] = 112; PERM[191] = 104; PERM[192] = 218; PERM[193] = 246; PERM[194] = 97; PERM[195] = 228; PERM[196] = 251; PERM[197] = 34; PERM[198] = 242; PERM[199] = 193; PERM[200] = 238; PERM[201] = 210; PERM[202] = 144; PERM[203] = 12; PERM[204] = 191; PERM[205] = 179; PERM[206] = 162; PERM[207] = 241; PERM[208] = 81; PERM[209] = 51; PERM[210] = 145; PERM[211] = 235; PERM[212] = 249; PERM[213] = 14; PERM[214] = 239; PERM[215] = 107; PERM[216] = 49; PERM[217] = 192; PERM[218] = 214; PERM[219] = 31; PERM[220] = 181; PERM[221] = 199; PERM[222] = 106; PERM[223] = 157; PERM[224] = 184; PERM[225] = 84; PERM[226] = 204; PERM[227] = 176; PERM[228] = 115; PERM[229] = 121; PERM[230] = 50; PERM[231] = 45; PERM[232] = 127; PERM[233] = 4; PERM[234] = 150; PERM[235] = 254; PERM[236] = 138; PERM[237] = 236; PERM[238] = 205; PERM[239] = 93; PERM[240] = 222; PERM[241] = 114; PERM[242] = 67; PERM[243] = 29; PERM[244] = 24; PERM[245] = 72; PERM[246] = 243; PERM[247] = 141; PERM[248] = 128; PERM[249] = 195; PERM[250] = 78; PERM[251] = 66; PERM[252] = 215; PERM[253] = 61; PERM[254] = 156; PERM[255] = 180; PERM[256] = 151; PERM[257] = 160; PERM[258] = 137; PERM[259] = 91; PERM[260] = 90; PERM[261] = 15; PERM[262] = 131; PERM[263] = 13; PERM[264] = 201; PERM[265] = 95; PERM[266] = 96; PERM[267] = 53; PERM[268] = 194; PERM[269] = 233; PERM[270] = 7; PERM[271] = 225; PERM[272] = 140; PERM[273] = 36; PERM[274] = 103; PERM[275] = 30; PERM[276] = 69; PERM[277] = 142; PERM[278] = 8; PERM[279] = 99; PERM[280] = 37; PERM[281] = 240; PERM[282] = 21; PERM[283] = 10; PERM[284] = 23; PERM[285] = 190; PERM[286] = 6; PERM[287] = 148; PERM[288] = 247; PERM[289] = 120; PERM[290] = 234; PERM[291] = 75; PERM[292] = 0; PERM[293] = 26; PERM[294] = 197; PERM[295] = 62; PERM[296] = 94; PERM[297] = 252; PERM[298] = 219; PERM[299] = 203; PERM[300] = 117; PERM[301] = 35; PERM[302] = 11; PERM[303] = 32; PERM[304] = 57; PERM[305] = 177; PERM[306] = 33; PERM[307] = 88; PERM[308] = 237; PERM[309] = 149; PERM[310] = 56; PERM[311] = 87; PERM[312] = 174; PERM[313] = 20; PERM[314] = 125; PERM[315] = 136; PERM[316] = 171; PERM[317] = 168; PERM[318] = 68; PERM[319] = 175; PERM[320] = 74; PERM[321] = 165; PERM[322] = 71; PERM[323] = 134; PERM[324] = 139; PERM[325] = 48; PERM[326] = 27; PERM[327] = 166; PERM[328] = 77; PERM[329] = 146; PERM[330] = 158; PERM[331] = 231; PERM[332] = 83; PERM[333] = 111; PERM[334] = 229; PERM[335] = 122; PERM[336] = 60; PERM[337] = 211; PERM[338] = 133; PERM[339] = 230; PERM[340] = 220; PERM[341] = 105; PERM[342] = 92; PERM[343] = 41; PERM[344] = 55; PERM[345] = 46; PERM[346] = 245; PERM[347] = 40; PERM[348] = 244; PERM[349] = 102; PERM[350] = 143; PERM[351] = 54; PERM[352] = 65; PERM[353] = 25; PERM[354] = 63; PERM[355] = 161; PERM[356] = 1; PERM[357] = 216; PERM[358] = 80; PERM[359] = 73; PERM[360] = 209; PERM[361] = 76; PERM[362] = 132; PERM[363] = 187; PERM[364] = 208; PERM[365] = 89; PERM[366] = 18; PERM[367] = 169; PERM[368] = 200; PERM[369] = 196; PERM[370] = 135; PERM[371] = 130; PERM[372] = 116; PERM[373] = 188; PERM[374] = 159; PERM[375] = 86; PERM[376] = 164; PERM[377] = 100; PERM[378] = 109; PERM[379] = 198; PERM[380] = 173; PERM[381] = 186; PERM[382] = 3; PERM[383] = 64; PERM[384] = 52; PERM[385] = 217; PERM[386] = 226; PERM[387] = 250; PERM[388] = 124; PERM[389] = 123; PERM[390] = 5; PERM[391] = 202; PERM[392] = 38; PERM[393] = 147; PERM[394] = 118; PERM[395] = 126; PERM[396] = 255; PERM[397] = 82; PERM[398] = 85; PERM[399] = 212; PERM[400] = 207; PERM[401] = 206; PERM[402] = 59; PERM[403] = 227; PERM[404] = 47; PERM[405] = 16; PERM[406] = 58; PERM[407] = 17; PERM[408] = 182; PERM[409] = 189; PERM[410] = 28; PERM[411] = 42; PERM[412] = 223; PERM[413] = 183; PERM[414] = 170; PERM[415] = 213; PERM[416] = 119; PERM[417] = 248; PERM[418] = 152; PERM[419] = 2; PERM[420] = 44; PERM[421] = 154; PERM[422] = 163; PERM[423] = 70; PERM[424] = 221; PERM[425] = 153; PERM[426] = 101; PERM[427] = 155; PERM[428] = 167; PERM[429] = 43; PERM[430] = 172; PERM[431] = 9; PERM[432] = 129; PERM[433] = 22; PERM[434] = 39; PERM[435] = 253; PERM[436] = 19; PERM[437] = 98; PERM[438] = 108; PERM[439] = 110; PERM[440] = 79; PERM[441] = 113; PERM[442] = 224; PERM[443] = 232; PERM[444] = 178; PERM[445] = 185; PERM[446] = 112; PERM[447] = 104; PERM[448] = 218; PERM[449] = 246; PERM[450] = 97; PERM[451] = 228; PERM[452] = 251; PERM[453] = 34; PERM[454] = 242; PERM[455] = 193; PERM[456] = 238; PERM[457] = 210; PERM[458] = 144; PERM[459] = 12; PERM[460] = 191; PERM[461] = 179; PERM[462] = 162; PERM[463] = 241; PERM[464] = 81; PERM[465] = 51; PERM[466] = 145; PERM[467] = 235; PERM[468] = 249; PERM[469] = 14; PERM[470] = 239; PERM[471] = 107; PERM[472] = 49; PERM[473] = 192; PERM[474] = 214; PERM[475] = 31; PERM[476] = 181; PERM[477] = 199; PERM[478] = 106; PERM[479] = 157; PERM[480] = 184; PERM[481] = 84; PERM[482] = 204; PERM[483] = 176; PERM[484] = 115; PERM[485] = 121; PERM[486] = 50; PERM[487] = 45; PERM[488] = 127; PERM[489] = 4; PERM[490] = 150; PERM[491] = 254; PERM[492] = 138; PERM[493] = 236; PERM[494] = 205; PERM[495] = 93; PERM[496] = 222; PERM[497] = 114; PERM[498] = 67; PERM[499] = 29; PERM[500] = 24; PERM[501] = 72; PERM[502] = 243; PERM[503] = 141; PERM[504] = 128; PERM[505] = 195; PERM[506] = 78; PERM[507] = 66; PERM[508] = 215; PERM[509] = 61; PERM[510] = 156; PERM[511] = 180;
}

int get_PERM(int id) {
    for (int i=0; i<512; i++) {
        if (i == id) return PERM[i];
    }
}

int GRAD3[48];
void init_GRAD3(){
    GRAD3[0] = 1; GRAD3[1] = 1; GRAD3[2] = 0; GRAD3[3] = -1; GRAD3[4] = 1; GRAD3[5] = 0; GRAD3[6] = 1; GRAD3[7] = -1; GRAD3[8] = 0; GRAD3[9] = -1; GRAD3[10] = -1; GRAD3[11] = 0; GRAD3[12] = 1; GRAD3[13] = 0; GRAD3[14] = 1; GRAD3[15] = -1; GRAD3[16] = 0; GRAD3[17] = 1; GRAD3[18] = 1; GRAD3[19] = 0; GRAD3[20] = -1; GRAD3[21] = -1; GRAD3[22] = 0; GRAD3[23] = -1; GRAD3[24] = 0; GRAD3[25] = 1; GRAD3[26] = 1; GRAD3[27] = 0; GRAD3[28] = -1; GRAD3[29] = 1; GRAD3[30] = 0; GRAD3[31] = 1; GRAD3[32] = -1; GRAD3[33] = 0; GRAD3[34] = -1; GRAD3[35] = -1; GRAD3[36] = 1; GRAD3[37] = 0; GRAD3[38] = -1; GRAD3[39] = -1; GRAD3[40] = 0; GRAD3[41] = -1; GRAD3[42] = 0; GRAD3[43] = -1; GRAD3[44] = 1; GRAD3[45] = 0; GRAD3[46] = 1; GRAD3[47] = 1;
}

int get_GRAD3(int id) {
    for (int i=0; i<48; i++) {
        if (i == id) return GRAD3[i];
    }
}

int and(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
        }

        a = a / 2;
        b = b / 2;
        n = n * 2;

        if(!(a > 0 && b > 0)) {
            break;
        }
    }
    return result;
}

float noise2(float x, float y){

    int i1, j1, I, J, c;

    float F2 = 0.3660254037844386;
    float G2 = 0.21132486540518713;

    float s = (x + y) * F2;
    float i = floor(x + s);
    float j = floor(y + s);
    float t = (i + j) * G2;
    
    float xx[3], yy[3], f[3];
    float noise[3]; noise[0] = 0.0; noise[1] = 0.0; noise[2] = 0.0;
    int g[3];

    xx[0] = x - (i - t);
    yy[0] = y - (j - t);

    //i1 = (xx[0] > yy[0]) ? 1 : 0;
    if (xx[0] > yy[0]){
        i1 = 1;
    }
    else{
        i1 = 0;
    }

    //j1 = xx[0] <= yy[0];
    if (xx[0] <= yy[0]){
        j1 = 1;
    }
    else{
        j1 = 0;
    }

    xx[2] = xx[0] + G2 * 2.0 - 1.0;
	yy[2] = yy[0] + G2 * 2.0 - 1.0;
	xx[1] = xx[0] - float(i1) + G2;
    yy[1] = yy[0] - float(j1) + G2;
    
    I = and(int(i), 255);
    J = and(int(j), 255);

    //g[0] = PERM[I + PERM[J]];
    g[0] = int( mod (float(get_PERM( I + get_PERM(J)) ) , 12.0));
    g[1] = int( mod (float(get_PERM( I + i1 + get_PERM(J + j1) )) , 12.0));
    g[2] = int( mod (float(get_PERM( I + 1 + get_PERM(J + 1) )) , 12.0));

    f[0] = 0.5 - xx[0]*xx[0] - yy[0]*yy[0];
    f[1] = 0.5 - xx[1]*xx[1] - yy[1]*yy[1];
    f[2] = 0.5 - xx[2]*xx[2] - yy[2]*yy[2];

    //float(get_GRAD3( int(g[c]*3.0)) )
    if (f[0] > 0.0){
        noise[0] = f[0]*f[0]*f[0]*f[0]* (float(get_GRAD3(  g[0]*3 )) * xx[0]+ float(get_GRAD3(  g[0]*3 +1)) * yy[0]);
    }

    if (f[1] > 0.0){
        noise[1] = f[1]*f[1]*f[1]*f[1]* (float(get_GRAD3(  g[1]*3 )) * xx[0]+ float(get_GRAD3(  g[1]*3 +1)) * yy[1]);
    }

    if (f[2] > 0.0){
        noise[2] = f[2]*f[2]*f[2]*f[2]* (float(get_GRAD3(  g[2]*3 )) * xx[2]+ float(get_GRAD3(  g[2]*3 +1)) * yy[2]);
    }
    

    //return 1.0;
    return (noise[0] + noise[1] + noise[2]) * 70.0;
}

vec3 permute(vec3 x){
    return mod(((x*34.0) + 1.0)*x, 289.0 );
}

vec3 taylorInvSqrt(vec3 r){
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

float fbm_noise2(float x, float y){

    //float lacunarity = 0.3;
    //float persistance = 3.5;

    float freq = 1.0;
    float amp = 1.0;
    float max = 0.0;
    float total = 0.0;

    for(int i = 0; i < 6; i++){
        total += snoise( vec2(x*freq, y*freq) ) * amp;
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

    float noise = fbm_noise2(position.x / zoom, position.y / zoom);

    elevation = noise;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, position.z+noise, 1.0 );

}
`;