import Line from "./Entity/Line.js";
import Check from "./Check.js";

export default class CanvasTable {
    constructor(src) {
        this.canvas = document.createElement("canvas");

        let ele = document.getElementById(src);
        ele.appendChild(this.canvas);

        this.innerWidth = 1150;
        this.innerHeight = 1000;

        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        this.canvas.style.height = "100%";
        this.canvas.style.width = "100%";
        this.canvas.style.imageRendering = "pixelated";

        this.ctx = this.canvas.getContext('2d');

        this.verticalBorder = [];

        this.horizontalBorder = [];

        this.reSize();
    }


    RandomInit() {
        let count = Math.floor(Math.random() * 20);

        this.dx = (this.innerWidth - 150) / count;
        this.dy = this.innerHeight / count;

        for (let i = 0; i <= count; i++) {
            let line = new Line({
                ctx: this.ctx,
                x: 0,
                y: this.dy * i,
                width: this.innerWidth,
                height: 0
            });
            this.horizontalBorder.push(line);
            if (i > 0 && i < count) {
                line = new Line({
                    ctx: this.ctx,
                    x: this.dx * i + 150,
                    y: 0,
                    width: 0,
                    height: this.innerHeight,
                    lineWidth: 1.0
                });
                this.verticalBorder.push(line);
            } else {
                if (i === 0) {
                    this.verticalBorder.push(new Line({
                        ctx: this.ctx,
                        x: 0,
                        y: 0,
                        width: 0,
                        height: this.innerHeight,
                        lineWidth: 1.0
                    }));

                    this.verticalBorder.push(new Line({
                        ctx: this.ctx,
                        x: 150,
                        y: 0,
                        width: 0,
                        height: this.innerHeight,
                        lineWidth: 1.0
                    }));
                } else {
                    this.verticalBorder.push(new Line({
                        ctx: this.ctx,
                        x: this.innerWidth,
                        y: 0,
                        width: 0,
                        height: this.innerHeight,
                        lineWidth: 1.0
                    }));
                }
            }
        }
    }


    addEventListener(type, listener) {
        this.canvas.addEventListener(type, listener);
        return () => {
            this.canvas.removeEventListener(type, listener);
        };
    }

    removeEventListener(type, listener) {
        this.canvas.removeEventListener(type, listener);
    }

    reSize() {
        let position = CanvasTable.getTopAndLeft(this.canvas);
        this.top = position.top;
        this.left = position.left;
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.widthRatio = this.innerWidth / this.width;
        this.heightRatio = this.innerHeight / this.height;
    }

    static getTopAndLeft(ele) {
        let top = ele.offsetTop;
        let left = ele.offsetLeft;
        while (ele.parentElement !== document.body) {
            ele = ele.parentElement;
            top += ele.offsetTop;
            left += ele.offsetLeft;
        }
        return {top: top, left: left}
    }

    getPosition(event) {
        let ret = undefined;
        let x = event.x - this.left;
        let y = event.y - this.top;
        if (x <= this.width && y <= this.height) {
            x = x * this.widthRatio;
            y = y * this.heightRatio;
            ret = [x, y];
        }
        return ret;
    }

    render() {
        // this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
        for (let i = 0; i < this.horizontalBorder.length; i++) {
            this.horizontalBorder[i].draw();
        }
        for (let i = 0; i < this.verticalBorder.length; i++) {
            this.verticalBorder[i].draw();
        }
    }
}
