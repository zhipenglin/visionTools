import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Button from './Button'
import './regulator.scss'
class Range extends PureComponent {
    static defaultProps = {
        value: 50
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
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }
        const {onChange} = this.props;
        onChange && onChange({value});
    }

    handlerMouseMove(e) {
        if (this.startX && e.which) {
            let deltaX = parseInt(100 * (e.clientX - this.startX) / this.outerWidth);
            if (deltaX != 0) {
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
        const {value, disabled} = this.props;
        return (
            <div className="c-regulator__range">
                <Button className="c-regulator__smaller" disabled={disabled} onClick={this.handlerSmallerClick}/>
                <div className="c-regulator__slider" ref="slider">
                    <div className="c-regulator__slider-inner" style={{width: `${value}%`}}>
                        <Button className="c-regulator__slider-btn" disabled={disabled}
                                onMouseDown={this.handlerMouseDown}/>
                    </div>
                </div>
                <Button className="c-regulator__bigger" disabled={disabled} onClick={this.handlerBiggerClick}/>
            </div>
        );
    }
}

export default class extends PureComponent {
    static defaultProps = {
        locked: false,
        scale: 0,
        opacity: 0.6,
        translate: {x: 0, y: 0}
    };

    constructor() {
        super();
        this.handlerClick = this.handlerClick.bind(this);
        this.handlerScaleChange = this.handlerScaleChange.bind(this);
        this.handlerOpacityChange = this.handlerOpacityChange.bind(this);
    }

    handlerClick() {
        const {locked, onChange} = this.props;
        onChange && onChange({locked: !locked});
    }

    handlerScaleChange({value}) {
        const {onChange} = this.props;
        onChange && onChange({scale: value});
    }

    handlerOpacityChange({value}) {
        const {onChange} = this.props;
        onChange && onChange({opacity: value});
    }

    render() {
        const {className, locked, scale, opacity} = this.props;
        return (
            <div className={classnames("c-regulator", className, {
                "c-regulator--close": locked
            })}>
                <Button className={classnames("c-regulator__lock", {
                    "c-regulator__lock--close": locked
                })} onClick={this.handlerClick}></Button>
                <div className="c-regulator__area">
                    <div className="c-regulator__item">
                        <Range value={scale} disabled={locked} onChange={this.handlerScaleChange}></Range>
                        <div className="c-regulator__label">缩放{scale * 2}%</div>
                    </div>
                    <div className="c-regulator__item">
                        <Range value={opacity} disabled={locked} onChange={this.handlerOpacityChange}></Range>
                        <div className="c-regulator__label">透明{opacity}%</div>
                    </div>
                </div>
            </div>
        );
    }
}
