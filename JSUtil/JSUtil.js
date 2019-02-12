class JSUtil {
    /**
     * 利用二分查找查询现有array
     * @param arr
     * @param id
     * @return {number}
     * @private
     */
    static _binarySearch(arr, id) {
        let low = 0;
        let heigh = arr.length - 1;
        if (low === heigh) {
            return arr[low].id === id ? low : -1;
        }
        while (low <= heigh) {
            let m = Math.floor((low + heigh) / 2);
            if (arr[m].id < id) {
                low = m + 1;
            } else if (arr[m].id > id) {
                heigh = m - 1;
            } else {
                return m;
            }
        }

        return -1;
    }

    static _sort(arr) {
        return new TinyQueue(arr, function (c, d) {
            let a, b;
            if (c === undefined) {
                a = c;
            } else {
                a = c.id;
            }
            if (d === undefined) {
                b = d;
            } else {
                b = d.id;
            }
            return a < b ? -1 : a > b ? 1 : 0;
        }).data;
    }


    static _inRange(min, max, input) {
        return input <= max && input >= min;
    }

    static findRange(Array, haveTQ) {
        if (haveTQ) {
            Array.sort();
        } else {
            Array = JSUtil._sort(Array);
        }
        return {max: Array[Array.length - 1], min: Array[0]};
    }

    /**
     * 将范围移至[0,2PI]和[0,PI]
     * @param position
     */
    static movePosition(position) {
        let p1 = position[0];
        let p2 = position[1];
        p1.longitude = LonLatUtil.zeroToTwoPi(p1.longitude);
        p2.longitude = LonLatUtil.zeroToTwoPi(p2.longitude);
        p1.latitude = LonLatUtil.zeroToPi(p1.latitude);
        p2.latitude = LonLatUtil.zeroToPi(p2.latitude);
        return [p1, p2];
    }

    /**
     * 将范围移至[0,2PI]和[0,PI]
     * @param range
     * @return {{max: Point, min: Point}}
     */
    static moveRange(range) {
        return {
            max: new Point({
                longitude: LonLatUtil.zeroToTwoPi(range.max.longitude),
                latitude: LonLatUtil.zeroToPi(range.max.latitude),
                height: range.max.height
            }),
            min: new Point({
                longitude: LonLatUtil.zeroToTwoPi(range.min.longitude),
                latitude: LonLatUtil.zeroToPi(range.min.latitude),
                height: range.min.height
            })
        };
    }

    /**
     * 计算线的范围
     * @param position
     * @return {{max: {longitude: number, latitude: number, height: number}, min: {longitude: number, latitude: number, height: number}}}
     */
    static loadRange(position) {
        let start = position[0];
        let end = position[1];
        let ret = {
            max: new Point(),
            min: new Point()
        };
        if (start.longitude > end.longitude) {
            ret.max.longitude = start.longitude;
            ret.min.longitude = end.longitude;
        } else {
            ret.max.longitude = end.longitude;
            ret.min.longitude = start.longitude;
        }
        if (start.latitude > end.latitude) {
            ret.max.latitude = start.latitude;
            ret.min.latitude = end.latitude;
        } else {
            ret.max.latitude = end.latitude;
            ret.min.latitude = start.latitude;
        }
        if (start.height > end.height) {
            ret.max.height = start.height;
            ret.min.height = end.height;
        } else {
            ret.max.height = end.height;
            ret.min.height = start.height;
        }
        return ret;
    }

}