varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;
varying vec4 v_color;
varying vec4 v_lonlat;

void main()
{
//    if(v_lonlat.x < 0. || v_lonlat.y < 0.){
//        discard;
//    }

    vec3 positionToEyeEC = -v_positionEC;

    vec3 normalEC = normalize(v_normalEC);
    #ifdef FACE_FORWARD
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
    #endif

    czm_materialInput materialInput;
    materialInput.normalEC = normalEC;
    materialInput.positionToEyeEC = positionToEyeEC;
    materialInput.st = v_st;
    czm_material material = czm_getMaterial(materialInput);

    material.diffuse = vec3(v_lonlat.w);
    material.alpha = v_lonlat.w * 1.2;
//    material.alpha = 0.75;

    #ifdef FLAT
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
    #else
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
    #endif
}
