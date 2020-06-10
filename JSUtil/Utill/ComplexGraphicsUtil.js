import DrawBezierLine from "../Draw/DrawBezierLine";
import DrawBSplineLine from "../Draw/DrawBSplineLine";
import DrawParabolaLine from "../Draw/DrawParabolaLine";
import Point2D from "../Math/Geometry/2D/Point";

const North = new Point2D(0, 1, 0);
export default class ComplexGraphicsUtil {
    static computeShape(config) {
        let shape = config.shape;
        let number = config.interpolationNumber;
        let scale = config.scale;
        let basePos = [...config.position];
        let position = [];
        for (let i = 0; i < shape.length; i++) {
            let target = shape[i];
            position.push(...ComplexGraphicsUtil.computeInterpolation(target.interpolation, ComplexGraphicsUtil.getControlPoint(basePos, target.shape, scale), number));
            if (i !== shape.length - 1) {
                let tmp = [position.pop(), position.pop(), position.pop()];
                basePos = [tmp[2], tmp[1], tmp[0]];
            }
        }
        return position;
    }

    static getBasePos(basePos, shape, scale, number, index) {
        if (index >= shape.length || index < 0) {
            return undefined;
        }
        let position = [];
        for (let i = 0; i < index; i++) {
            let target = shape[i];
            position.push(...ComplexGraphicsUtil.computeInterpolation(target.interpolation, ComplexGraphicsUtil.getControlPoint(basePos, target.shape, scale), number));
            let tmp = [position.pop(), position.pop(), position.pop()];
            basePos = [tmp[2], tmp[1], tmp[0]];
        }
        return basePos;
    }


    static getControlPoint(basePos, shape, scale) {
        let currentPoint = new Point2D(basePos);
        let position = [...currentPoint.toArray()];
        for (let i = 0; i < shape.length; i++) {
            let target = shape[i];
            let angle = target.angle;
            let distance = target.distance * scale;
            let tmp = North.rotation(angle);
            tmp.applyScaler(1 / tmp.mangnitude());
            tmp.longitude = currentPoint.longitude + tmp.longitude * distance;
            tmp.latitude = currentPoint.latitude + tmp.latitude * distance;
            position.push(...tmp.toArray());
        }
        return position;
    }

    static covertToShape(control, interpolation) {
        let points = [];
        for (let i = 0; i < control.length; i += 3) {
            points.push(new Point2D(control[i], control[i + 1], control[i + 2]));
        }
        let shapes = [];
        let base = points[0];
        for (let i = 1; i < points.length; i++) {
            let target = points[i];
            let angle = base.getAzimuth(target);
            shapes.push({
                distance: Math.sqrt(Math.pow(target.longitude - base.longitude, 2) + Math.pow(target.latitude - base.latitude, 2)),
                angle: angle
            })
        }
        return {shape: shapes, interpolation: interpolation}
    }

    static computeInterpolation(interpolation, position, interpolationNumber) {
        switch (interpolation) {
            case "Bezier":
                return DrawBezierLine.handleBezierPos(position, interpolationNumber);
            case "BSpline":
                return DrawBSplineLine.handlePos(position, interpolationNumber);
            case "Parabola":
                return DrawParabolaLine.handlePos(position, interpolationNumber);
            case "none":
            case undefined:
            case "":
            case null:
                return position;
        }
    }
}