/**
 * @Author DY
 */
const PI = Math.PI;
const TWO_PI = PI * 2;
const PI_OVER_TWO = PI / 2;
const EPSILON_10 = 0.0000000001;

class LonLatUtil {
  /**
   * 角度转弧度
   * @param angle
   */
  static angleToRadian(angle) {
    return angle * PI / 180;
  }

  /**
   * 弧度转角度
   * @param radian
   */
  static radianToAngle(radian) {
    return radian * 180 / PI;
  }

  /**
   * 在[0,2PI]内找出一个和输入x相对应的弧度
   * @param x
   * @return {number}
   */
  static zeroToTwoPi(x) {
    let value = x % TWO_PI;
    return (value < 0.0) ? (value + TWO_PI) % TWO_PI : value;
  }

  /**
   * 在[0,PI]内找出一个和输入x相对应的弧度
   * @param x
   * @return {number}
   */
  static zeroToPi(x) {
    let value = x % PI;
    return (value < 0.0) ? (value + PI) % PI : value;
  }

  /**
   * 在[-PI,PI]内找出一个和输入x相对应的弧度
   * @param x
   * @return {number}
   */
  static negativePIToPI(x) {
    while (x < -(PI + EPSILON_10)) {
      x += TWO_PI;
    }
    if (x < -PI) {
      return -PI;
    }
    while (x > PI + EPSILON_10) {
      x -= TWO_PI;
    }
    return x > PI ? PI : x;
  }

  /**
   * 在[-PI/2,PI/2]内找出一个和输入x相对应的弧度
   * @param x
   * @return {number}
   */
  static negativePIOverTwoToPIOverTwo(x) {
    while (x < -(PI_OVER_TWO + EPSILON_10)) {
      x += PI;
    }
    if (x < -PI_OVER_TWO) {
      return -PI_OVER_TWO;
    }
    while (x > PI_OVER_TWO + EPSILON_10) {
      x -= PI;
    }
    return x > PI_OVER_TWO ? PI_OVER_TWO : x;
  }

  /**
   * 转换经度使其满足[-PI,PI]
   * @param angle
   * @return {number}
   */
  static convertLongitudeRange(angle) {
    let simplified = angle - Math.floor(angle / TWO_PI) * TWO_PI;
    if (simplified < -PI) {
      return simplified + TWO_PI;
    }
    if (simplified >= PI) {
      return simplified - TWO_PI;
    }
    return simplified;
  }

  /**
   * 转换纬度使其满足[-PI/2,PI/2]
   * @param angle
   * @return {number}
   */
  static converLatitudeRange(angle) {
    let simplified = angle - Math.floor(angle / PI) * PI;
    if (simplified < -PI_OVER_TWO) {
      return simplified + PI;
    }
    if (simplified >= PI_OVER_TWO) {
      return simplified - PI;
    }
    return simplified;
  }
}

export {LonLatUtil}
