import React, {PureComponent} from 'react'
import classnames from 'classnames'
import {findDOMNode} from 'react-dom'
import './rule.scss'

function drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
    var dashLen = dashLength === undefined ? 5 : dashLength,
        xpos = x2 - x1, //得到横向的宽度;
        ypos = y2 - y1, //得到纵向的高度;
        numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
    for (var i = 0; i < numDashes; i++) {
        if (i % 2 === 0) {
            ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
        } else {
            ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
        }
    }
    ctx.stroke();
}

function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

export default class extends PureComponent {
    static displayName = 'Rule';

    constructor() {
        super();
        this.handlerMouseDown = this.handlerMouseDown.bind(this);
        this.handlerMouseLeave = this.handlerMouseLeave.bind(this);
        this.handlerMouseMove = this.handlerMouseMove.bind(this);
        this.isPaintting = false;
        this.currentGraph = null;
        this.graphList = [];
    }

    componentDidMount() {
        this.context = findDOMNode(this).getContext('2d');
        this.paint();
    }

    componentDidUpdate() {
        this.paint();
    }

    paint() {
        const {width, height} = this.props;
        this.context.clearRect(0, 0, width, height);
        this.currentGraph && this.currentGraph();
        this.graphList.forEach((graph) => {
            graph();
        });
    }

    handlerMouseDown(e) {
        this.isPaintting = !this.isPaintting;
        if (this.isPaintting) {
            this.start = {
                x: e.clientX,
                y: e.clientY
            };
        } else {
            this.graphList.push(this.currentGraph);
            this.currentGraph = null;
        }
    }

    handlerMouseLeave() {
        //this.isPaintting = false;
    }

    handlerMouseMove(e) {
        if (!this.isPaintting || !this.start) {
            return;
        }
        const {angle} = this.props;
        let graphList = this.graphList, ctx = this.context, start = this.start, end = {
            x: e.clientX,
            y: e.clientY
        };

        this.currentGraph = () => {
            ctx.save();
            ctx.font = "10px";
            ctx.textAlign = "center";
            ctx.strokeStyle = "#333";
            let angle = Math.atan2(end.y - start.y, end.x - start.x),
                angleText = (angle * 180 / Math.PI).toFixed(1) + '°',
                angleX = start.x + 40, angleY = start.y + 20 * (angle < 0 ? -0.5 : 1),
                layoutX = start.x + 50,
                layoutText = `w:${end.x - start.x},h:${end.y - start.y},L:${Math.round(Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)))}`,
                layoutY = start.y + 20 * (angle < 0 ? 1 : -0.5);

            ctx.fillStyle = "rgba(255,255,255,0.5)";

            drawRoundRect(ctx, angleX - 24, angleY - 14, 46, 20, 4);
            ctx.fill();
            drawRoundRect(ctx, layoutX - 60, layoutY - 14, 120, 20, 4);
            ctx.fill();
            ctx.fillStyle = "#333";
            ctx.fillText(angleText, angleX, angleY);
            ctx.fillText(layoutText, layoutX, layoutY);

            ctx.beginPath();

            ctx.arc(start.x, start.y, 20, 0, angle, angle < 0);

            drawDashLine(ctx, 0.5 + start.x, 0.5 + start.y, 50.5 + start.x, 0.5 + start.y);

            ctx.moveTo(0.5 + start.x, 0.5 + start.y);
            ctx.lineTo(0.5 + end.x, 0.5 + end.y);

            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        };
        this.paint();
    }

    render() {
        const {width, height, coordinate, className} = this.props;
        return <canvas className={classnames({
            "c-rule--coordinate":coordinate,
            "c-rule":!coordinate,
        }, className)} width={width}
                       height={height}
                       onMouseDown={this.handlerMouseDown}
                       onMouseLeave={this.handlerMouseLeave} onMouseMove={this.handlerMouseMove}/>
    }
}