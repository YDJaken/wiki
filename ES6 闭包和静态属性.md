# <center>记录人：DY</center>
--------------------------------

在重构从ES5转换到ES6的过程中，遇到了一些在ES5源码中是闭包和静态属性的情况:

## 闭包:

-----------------------

``` javascript
generateUUID: ( function () {
        var lut = [];
        for ( var i = 0; i < 256; i ++ ) {
            lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );
        }
        return function generateUUID() {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            var uuid = lut[ d0 & 0xff ] + lut[ d0 >> 8 & 0xff ] + lut[ d0 >> 16 & 0xff ] + lut[ d0 >> 24 & 0xff ] + '-' +
                lut[ d1 & 0xff ] + lut[ d1 >> 8 & 0xff ] + '-' + lut[ d1 >> 16 & 0x0f | 0x40 ] + lut[ d1 >> 24 & 0xff ] + '-' +
                lut[ d2 & 0x3f | 0x80 ] + lut[ d2 >> 8 & 0xff ] + '-' + lut[ d2 >> 16 & 0xff ] + lut[ d2 >> 24 & 0xff ] +
                lut[ d3 & 0xff ] + lut[ d3 >> 8 & 0xff ] + lut[ d3 >> 16 & 0xff ] + lut[ d3 >> 24 & 0xff ];
            return uuid.toUpperCase();
        };
    } )()
```
-----------------------
如上所示，原函数是一个闭包，且是一个立即执行的闭包。意思为:

-----------------------
``` javascript
this.generateUUID = function generateUUID() {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            var uuid = lut[ d0 & 0xff ] + lut[ d0 >> 8 & 0xff ] + lut[ d0 >> 16 & 0xff ] + lut[ d0 >> 24 & 0xff ] + '-' +
                lut[ d1 & 0xff ] + lut[ d1 >> 8 & 0xff ] + '-' + lut[ d1 >> 16 & 0x0f | 0x40 ] + lut[ d1 >> 24 & 0xff ] + '-' +
                lut[ d2 & 0x3f | 0x80 ] + lut[ d2 >> 8 & 0xff ] + '-' + lut[ d2 >> 16 & 0xff ] + lut[ d2 >> 24 & 0xff ] +
                lut[ d3 & 0xff ] + lut[ d3 >> 8 & 0xff ] + lut[ d3 >> 16 & 0xff ] + lut[ d3 >> 24 & 0xff ];
            return uuid.toUpperCase();
        };
this.generateUUID() = 上述函数的执行结果
```
-----------------------
如果在修改为ES6时不注意立即执行的问题，如下例：

-----------------------
``` javascript
static generateUUID() {
        let lut = [];
        for (let i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        return function generateUUID() {
            let d0 = Math.random() * 0xffffffff | 0;
            let d1 = Math.random() * 0xffffffff | 0;
            let d2 = Math.random() * 0xffffffff | 0;
            let d3 = Math.random() * 0xffffffff | 0;
            let uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
            return uuid.toUpperCase();
        };
    }
```
-----------------------
如果上述代码要达到ES5的效果需要

-----------------------
```javascript
ClassName.generateUUID() = function generateUUID() {
            let d0 = Math.random() * 0xffffffff | 0;
            let d1 = Math.random() * 0xffffffff | 0;
            let d2 = Math.random() * 0xffffffff | 0;
            let d3 = Math.random() * 0xffffffff | 0;
            let uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
            return uuid.toUpperCase();
        };
ClassName.generateUUID()() = 上述函数的执行结果;
```
-----------------------
修改为**立即执行**的代码:

-----------------------
``` javascript
static generateUUID() {
        let lut = [];
        for (let i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        return (function generateUUID() {
            let d0 = Math.random() * 0xffffffff | 0;
            let d1 = Math.random() * 0xffffffff | 0;
            let d2 = Math.random() * 0xffffffff | 0;
            let d3 = Math.random() * 0xffffffff | 0;
            let uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
            return uuid.toUpperCase();
        })();
    }
```
-----------------------
如果上述代码要达到ES5的效果需要

-----------------------
```javascript
ClassName.generateUUID = function generateUUID() {
            let d0 = Math.random() * 0xffffffff | 0;
            let d1 = Math.random() * 0xffffffff | 0;
            let d2 = Math.random() * 0xffffffff | 0;
            let d3 = Math.random() * 0xffffffff | 0;
            let uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
            return uuid.toUpperCase();
        };
ClassName.generateUUID() = 上述函数的执行结果;
```
-----------------------

和ES源码执行效果一致。

如果原函数内**有变量**:

-----------------------
``` javascript
generateUUID: ( function () {
        var asd = 1;
        return function generateUUID(uuid) {
            return uuid.toUpperCase();
        };
    } )()
```
-----------------------
在修改ES6时应当考虑将变量加在函数初始时

------------------------
``` javascript
static generateUUID(uuid) {
        let asd = 1;
        return (function generateUUID() {
            return uuid.toUpperCase();
        })();
    }
```
---------------------------
以防止可能出现的指针错误和babel编译为ES5时可能的错误。

## 静态属性:
---------------------------
```javascript
_Math = {

    DEG2RAD: Math.PI / 180,
    RAD2DEG: 180 / Math.PI,
```
---------------------------

如上所示，DEG2RAD和RAD2DEG是_Math的静态属性调用方法如下:
---------------------------
```javascript
_Math.DEG2RAD;_Math.RAD2DEG;
```
---------------------------

在改ES6有两个思路:
### 思路一
---------------------------
```
class _Math {

    static DEG2RAD() {
        return Math.PI / 180;
    }

    static RAD2DEG() {
        return 180 / Math.PI;
    }
```
---------------------------
调用方法:

---------------------------
```
_Math.DEG2RAD();_Math.RAD2DEG();
```
---------------------------
### 思路二
---------------------------
```
class _Math {}
    _Math.DEG2RAD = Math.PI / 180;
    _Math.RAD2DEG = 180 / Math.PI;
```
---------------------------
调用方法:

---------------------------
```
_Math.DEG2RAD;_Math.RAD2DEG;
```
---------------------------