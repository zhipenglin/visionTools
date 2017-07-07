import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'

export default class extends PureComponent {
    static displayName = 'Degree';

    componentDidMount() {
        this.context = findDOMNode(this).getContext('2d');
        this.paint();
    }

    componentDidUpdate() {
        const {width, height} = this.props;
        this.context.clearRect(0, 0, width, height);
        this.paint();
    }

    paint() {
        const {width, height} = this.props;
        let xIndex = 1, yIndex = 1, ctx = this.context;
        ctx.save();
        ctx.font = "10px";
        ctx.textAlign = "center";
        ctx.strokeStyle = ctx.fillStyle = "#333";
        while (xIndex * 10 <= width) {
            let unit = xIndex % 10 === 0, length = unit ? 10.5 : 5.5, x = xIndex * 10 + 0.5;
            ctx.beginPath();
            ctx.moveTo(x, 0.5);
            ctx.lineTo(x, length);
            ctx.stroke();
            ctx.closePath();
            unit && ctx.fillText((xIndex * 10).toString(), x, 30);
            xIndex += 1;
        }

        while (yIndex * 10 <= height) {
            let unit = yIndex % 10 === 0, length = unit ? 10.5 : 5.5, y = yIndex * 10 + 0.5;
            ctx.beginPath();
            ctx.moveTo(0.5, y);
            ctx.lineTo(length, y);
            ctx.stroke();
            ctx.closePath();
            unit && ctx.fillText((yIndex * 10).toString(), 30, y + 3);
            yIndex += 1;
        }

        ctx.restore();
    }

    render() {
        const {width, height, className} = this.props;
        return <canvas className={className} width={width} height={height}></canvas>;
    }
}