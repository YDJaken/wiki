attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec3 normal;
attribute vec2 st;
attribute float batchId;

uniform float time_4;
uniform vec4 controlNumber_3;
uniform vec2 gridSize_2;
uniform vec2 interval_1;
uniform vec2 origin_0;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;
varying vec4 v_lonlat;
varying vec4 v_color;

const vec3 earthRadius = vec3(6378137, 6378137, 6356752.3142451793);
const float DESP_PI = 3.141592653589793;
const float HALF_PI = 1.5707963267948966;
const float ONE_OVER_PI = 0.3183098861837907;
const float DEG_TO_RADIN = 0.017453292519943295;
const float RADIN_TO_DEG = 57.29577951308232;

float decodeColor(vec4 color){
    color *= 255.0;
    return (color.r + color.g + color.b)/ (256. * 3.);
}


const float r = 6378137.0;
const float sinP = sin(DESP_PI);
const float cosP = cos(DESP_PI);
const float sinP2 = sin(HALF_PI);
const float cosP2 = cos(HALF_PI);
vec4 computeRealWorldPos(in float lon, in float lat, in float height){
    float cosLat = cos(lat);
    float sinLat = sin(lat);
    float cosLog = cos(lon);
    float sinLog = sin(lon);

    float R = r + height;

    vec3 result;
    result = vec3(
    - R * (cosLat * sinP2 - cosP2 * sinLat) * (cosLog * cosP - sinP * sinLog),
    - R * (cosLat * sinP2 - cosP2 * sinLat) * (cosLog * sinP + cosP * sinLog),
    R * (cosLat * cosP2 + sinP2 * sinLat)
    );

    //    vec3 scratchK = vec3(1.0, 1.0, 1.0);
    //    vec3 scratchN = vec3(1.0, 1.0, 1.0);
    //    scratchN.x = cosLat * cosLog;
    //    scratchN.y = cosLat * sinLog;
    //    scratchN.z = sinLat;
    //    scratchN = normalize(scratchN);
    //
    //    scratchK.x= scratchN.x * earthRadius.x;
    //    scratchK.y= scratchN.y * earthRadius.y;
    //    scratchK.z= scratchN.z * earthRadius.z;
    //
    //    float gamma = sqrt(dot(scratchN, scratchK));
    //
    //    scratchK = scratchK / gamma;
    //    scratchN = scratchN * height;
    //
    //    result = scratchK + scratchN;

    return vec4(result.xyz, 0.);
}


float fastApproximateAtan2 (in float x, in float y){
    float opposite;
    float adjacent;
    float t = abs(x);
    opposite = abs(y);
    adjacent = max(t, opposite);
    opposite = min(t, opposite);

    float oppositeOverAdjacent = opposite / adjacent;
    t = atan(oppositeOverAdjacent);

    t = abs(y) > abs(x) ? HALF_PI - t : t;
    t = x < 0.0 ? DESP_PI - t : t;
    t = y < 0.0 ? -t : t;
    return t;
}

vec4 convertLatLon(in vec3 position){

    float Long = -1. * fastApproximateAtan2(position.z, position.x);
    float R = length(position);

    vec3 result;
    result = vec3(Long, HALF_PI - acos(position.y/R), R - r);
    return vec4(result.xyz, 0.);
    //    float R = sqrt(length(position));
    //    float e = abs((earthRadius.x * earthRadius.x - earthRadius.z * earthRadius.z)/(earthRadius.x * earthRadius.x));
    //    float f = 1. - sqrt(1. - e);
    //    float rsqXY = sqrt(position.x * position.x + position.y * position.y);
    //
    //    float theta = - fastApproximateAtan2(position.y, position.x);
    //    float nu = atan(position.z / rsqXY * ((1. - f) + e * position.x / R));
    //
    //    float sinu = sin(nu);
    //    float cosu = cos(nu);
    //
    //    float phi = atan((position.z * (1. - f) + e * position.x * sinu * sinu * sinu) / ((1. - f) * (rsqXY - e * position.x * cosu * cosu * cosu)));
    //
    //    float h = (rsqXY * cos(phi)) + position.z * sin(phi) - position.x * sqrt(1. - e * sin(phi) * sin(phi));
    //
    //    return vec4(theta, phi, h, 0.);
}

vec4 translateRelativeToEye(vec3 high, vec3 low){
    vec3 highDifference = high - czm_encodedCameraPositionMCHigh;
    vec3 lowDifference = low - czm_encodedCameraPositionMCLow;

    return vec4(highDifference + lowDifference, 1.0);
}

vec4 computePosition(in vec3 high, in vec3 low){
    vec4 p;
    p = translateRelativeToEye(high, low);
    return p;
}

const float twoByte = 65536.0;

vec2 reformat(float position){
    float doubleHigh = 0.0;
    vec2 result;
    if (position >= 0.0) {
        doubleHigh = floor(position / twoByte) * twoByte;
        result.x = doubleHigh;
        result.y = position - doubleHigh;
    } else {
        doubleHigh = floor(-position / twoByte) * twoByte;
        result.x = -doubleHigh;
        result.y = position + doubleHigh;
    }
    return result;
}

vec3 recover(){
    return position3DHigh + position3DLow;
}

float lerp(in float start, in float end, in float percentage){
    return (1. - percentage) * start + percentage * end;
}

vec4 lerpColor (in vec4 current, in vec4 next, in float step){
    vec4 ret = vec4(current);
    ret.x = lerp(current.x,next.x,step);
    ret.y = lerp(current.y,next.y,step);
    ret.z = lerp(current.z,next.z,step);
    ret.w = lerp(current.w,next.w,step);
    return ret;
}

void main(){
    vec4 p = vec4(recover(), 0.);

    //    vec4 p = computePosition(position3DHigh,position3DLow);

    vec4 currentLonLat = convertLatLon(p.xyz);
    float step = getStep(time_4);
    vec2 frac = fract(vec2(currentLonLat.x - origin_0.x, currentLonLat.y - origin_0.y)/interval_1/gridSize_2);
    vec4 currentColor = getCurrentColor(time_4,frac);
    vec4 nextColor = getNextColor(time_4, frac);

    v_color = lerpColor(currentColor,nextColor,step);

//    v_color = texture2D(image_0, fract(vec2(currentLonLat.x - origin_0.x, currentLonLat.y - origin_0.y)/interval_1/gridSize_2));
    v_lonlat =  vec4(currentLonLat.xyz, decodeColor(v_color));
    v_lonlat.z = (controlNumber_3.y - controlNumber_3.x) * v_lonlat.w + controlNumber_3.x;
    p =computeRealWorldPos(v_lonlat.x, v_lonlat.y, v_lonlat.z);
    vec2 posX = reformat(p.x);
    vec2 posY = reformat(p.y);
    vec2 posZ = reformat(p.z);
    p = computePosition(vec3(posX.x, posY.x, posZ.x), vec3(posX.y, posY.y, posZ.y));
    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
    v_normalEC = czm_normal * normal;
    v_st = st;

    gl_Position = czm_modelViewProjectionRelativeToEye * p;
}
