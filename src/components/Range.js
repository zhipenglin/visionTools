import React, {PureComponent} from 'react'
import Button from './Button'
import './range.scss'

export default class extends PureComponent {
    static displayName = 'Range';
    static defaultProps = {
        value: 50,
        maxValue: 100
    };

    constructor() {
        super();
        this.handlerMouseDown = this.handlerMouseDown.bind(this);
        this.handlerMouseMove = this.handlerMouseMove.bind(this);
        this.handlerMouseUp = this.handlerMouseUp.bind(this);
        this.handlerSmallerClick = this.handlerSmallerClick.bind(this);
        this.handlerBiggerClick = this.handlerBiggerClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handlerMouseMove);
        document.addEventListener('mouseup', this.handlerMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handlerMouseMove);
        document.removeEventListener('mouseup', this.handlerMouseUp);
    }

    handlerSmallerClick() {
        const {value} = this.props;
        this.setValue(value - 1);
    }

    handlerBiggerClick() {
        const {value} = this.props;
        this.setValue(value + 1);
    }

    setValue(value) {
        const {maxValue} = this.props;
        if (value < 0) {
            value = 0;
        } else if (value > maxValue) {
            value = maxValue;
        }
        const {onChange} = this.props;
        onChange && onChange(value);
    }

    handlerMouseMove(e) {
        const {maxValue} = this.props;
        if (this.startX && e.which) {
            let deltaX = maxValue * (e.clientX - this.startX) / this.outerWidth;
            if (deltaX !== 0) {
                const {value} = this.props;
                this.setValue(deltaX + value);
                this.startX = e.clientX;
            }
        }
    }

    handlerMouseUp() {
        this.startX = null;
    }

    handlerMouseDown(e) {
        const {disabled} = this.props;
        if (disabled) {
            return;
        }
        this.outerWidth = this.refs.slider.clientWidth;
        this.startX = e.clientX;
    }

    render() {
        const {value, maxValue, disabled} = this.props;
        return (
            <div className="c-range">
                <Button className="c-range__smaller" disabled={disabled} onClick={this.handlerSmallerClick}/>
                <div className="c-range__slider" ref="slider">
                    <div className="c-range__slider-inner" style={{width: `${value * 100 / maxValue}%`}}>
                        <Button className="c-range__slider-btn" disabled={disabled}
                                onMouseDown={this.handlerMouseDown}/>
                    </div>
                </div>
                <Button className="c-range__bigger" disabled={disabled} onClick={this.handlerBiggerClick}/>
            </div>
        );
    }
}