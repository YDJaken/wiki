export default class TerrainUtil{
    static ComputePlanes(points) {
        var pointsLength = points.length;
        var clippingPlanes = []; // 存储ClippingPlane集合
        for (var i = 0; i < pointsLength; ++i) {
            var nextIndex = (i + 1) % pointsLength;
            var midpoint = despCore.Cartesian3.add(points[i], points[nextIndex], new despCore.Cartesian3());
            midpoint = despCore.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
            var up = despCore.Cartesian3.normalize(midpoint, new despCore.Cartesian3());
            var right = despCore.Cartesian3.subtract(points[nextIndex], midpoint, new despCore.Cartesian3());
            right = despCore.Cartesian3.normalize(right, right);

            var normal = despCore.Cartesian3.cross(right, up, new despCore.Cartesian3());
            normal = despCore.Cartesian3.normalize(normal, normal);

            var originCenteredPlane = new despCore.Plane(normal, 0.0);
            var distance = despCore.Plane.getPointDistance(originCenteredPlane, midpoint);

            clippingPlanes.push(new despCore.ClippingPlane(normal, distance));
        }
        return clippingPlanes;

    }
    static LonLat2Cartesian3(positions) {
        let CartesianPositions = [];
        for (let i = 0; i < positions.length; i += 3) {
            var cartesian3 = despCore.Cartesian3.fromDegrees(positions[i], positions[i + 1]);
            CartesianPositions.push(cartesian3);
        }
        return CartesianPositions;
    }
    static computePanel(points) {
        let breverse = TerrainUtil.isReverse(points[0], points[1], points[3], points[4]);
        let rpoints = [];
        if (breverse) {
            rpoints = TerrainUtil.reverse(points);
        } else {
            rpoints = points;
        }
        let array = TerrainUtil.LonLat2Cartesian3(rpoints);
        let panels = TerrainUtil.ComputePlanes(array);
        return panels;
    }
    //利用角度判读是否需要旋转
    static isReverse(lng1, lat1, lng2, lat2) {
        var dRotateAngle = Math.atan2(Math.abs(lng1 - lng2), Math.abs(lat1 - lat2));
        if (lng2 >= lng1) {
            if (lat2 >= lat1) {
            } else {
                dRotateAngle = Math.PI - dRotateAngle;
            }
        } else {
            if (lat2 >= lat1) {
                dRotateAngle = 2 * Math.PI - dRotateAngle;
            } else {
                dRotateAngle = Math.PI + dRotateAngle;
            }
        }
        dRotateAngle = dRotateAngle * 180 / Math.PI;
        if (dRotateAngle >= 0 && dRotateAngle <= 90) {
            return true
        }
        else if (dRotateAngle >= 270 && dRotateAngle <= 360) {
            return true;
        }
        else {
            return false;
        }

    }
    static reverse(points) {
        var rpoints = [];
        for (let i = 6; i > 0; i -= 3) {
            rpoints.push(points[i - 3]);
            rpoints.push(points[i - 2]);
            rpoints.push(points[i - 1]);
        }
        for (let i = points.length; i > 6; i -= 3) {
            rpoints.push(points[i - 3]);
            rpoints.push(points[i - 2]);
            rpoints.push(points[i - 1]);
        }
        return rpoints;
    }   
}