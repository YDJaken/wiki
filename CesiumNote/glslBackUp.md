 ```
                #ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
uniform vec4 color_X;
uniform float spacing_X;
uniform float width_X;
uniform bool show_X;

// uniform float maxX;
// uniform float maxY;
// uniform float minX;
// uniform float minY;
// uniform vec3 CameraP;

            // const float fInnerRadius = 6378137.0;
            // const float fOuterRadius = 6356752.3142451793;

            // vec3 getHeight(vec3 position)
            // {
            //     float ret = 0.0;
            //     float R = length(position);
            //     float e = abs((fInnerRadius * fInnerRadius - fOuterRadius * fOuterRadius) / (fInnerRadius * fInnerRadius));
            //     float f = 1.0 - sqrt(1.0 - e);
            //     float rsqXY = sqrt(position.x * position.x + position.y * position.y);
            //
            //     float theta = -czm_fastApproximateAtan(position.y, position.x);
            //     float nu = atan(position.z / rsqXY * ((1.0 - f) + e * fInnerRadius / R));
            //
            //     float sinu = sin(nu);
            //     float cosu = cos(nu);
            //
            //     float phi = atan((position.z * (1.0 - f) + e * fInnerRadius * sinu * sinu * sinu) / ((1.0 - f) * (rsqXY - e * fInnerRadius * cosu * cosu * cosu)));
            //
            //     ret = (rsqXY * cos(phi)) + position.z * sin(phi) - fInnerRadius * sqrt(1.0 - e * sin(phi) * sin(phi));
            //     return vec3(theta,phi,ret);
            // }

// bool inRangeDDD(float target,float max,float min){
//     return target <= max && target >= min;
// }

czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
if(show_X == false){
material.alpha  = 0.0;
}else{
float distanceToContour = mod(materialInput.height, spacing_X);
#ifdef GL_OES_standard_derivatives
float dxc = abs(dFdx(materialInput.height));
float dyc = abs(dFdy(materialInput.height));
float dF = max(dxc, dyc) * width_X;
float alpha = (distanceToContour < dF) ? 1.0 : 0.0;
#else
float alpha = (distanceToContour < (czm_resolutionScale * width_X)) ? 1.0 : 0.0;
#endif

vec4 outColor = czm_gammaCorrect(vec4(color_X.rgb, alpha));
material.diffuse = outColor.rgb;
material.alpha = outColor.a;}
// if(material.alpha == 1.0 ){
//     bool a =inRangeDDD(CameraP.x,maxX,minX);
//     if(a == false){
//      material.alpha = 0.0;
//     }
//     if(material.alpha == 1.0){
//         bool b = inRangeDDD(CameraP.y,maxY,minY);
//         if(b == false){
//             material.alpha = 0.0;
//         }
//     }
// }
return material;
}
```


```
{
            position: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            style: "ElevationContour",
            fragmentShaderSource: `varying vec3 v_positionMC;
            varying vec3 v_positionEC;
            varying vec2 v_st;
            varying vec3 v_positionWC;
        
            const float InnerRadius_WGS84 = 6378137.0;
            const float OuterRadius_WGS84 = 6356752.3142451793;
        
            vec3 getHeight(vec3 position)
            {
                float ret = 0.0;
                float R = length(position);
                float e = abs((InnerRadius_WGS84 * InnerRadius_WGS84 - OuterRadius_WGS84 * OuterRadius_WGS84) / (InnerRadius_WGS84 * InnerRadius_WGS84));
                float f = 1.0 - sqrt(1.0 - e);
                float rsqXY = sqrt(position.x * position.x + position.y * position.y);

                float theta = -czm_fastApproximateAtan(position.y, position.x);
                float nu = atan(position.z / rsqXY * ((1.0 - f) + e * InnerRadius_WGS84 / R));

                float sinu = sin(nu);
                float cosu = cos(nu);

                float phi = atan((position.z * (1.0 - f) + e * InnerRadius_WGS84 * sinu * sinu * sinu) / ((1.0 - f) * (rsqXY - e * InnerRadius_WGS84 * cosu * cosu * cosu)));

                ret = (rsqXY * cos(phi)) + position.z * sin(phi) - InnerRadius_WGS84 * sqrt(1.0 - e * sin(phi) * sin(phi));
                return vec3(theta,phi,ret);
            }
        
            void main()
            {
            czm_materialInput materialInput;
            vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));
            #ifdef FACE_FORWARD
            normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
            #endif
            materialInput.s = v_st.s;
            materialInput.st = v_st;
            materialInput.str = vec3(v_st, 0.0);
            materialInput.normalEC = normalEC;
            materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);
            vec3 positionToEyeEC = -v_positionEC;
            materialInput.positionToEyeEC = positionToEyeEC;
            if(czm_viewerPositionWC.x == 0.0){
            materialInput.height = getHeight(czm_viewerPositionWC).z;
            }else{
            materialInput.height = getHeight(v_positionWC).z;
            }
            czm_material material = czm_getMaterial(materialInput);
            #ifdef FLAT
            gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
            #else
            gl_FragColor = czm_phong(normalize(positionToEyeEC), material);
            #endif
            }`
        }
```