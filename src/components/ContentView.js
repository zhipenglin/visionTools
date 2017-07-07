import React, {PureComponent} from 'react'
import classnames from 'classnames'
import merge from 'lodash.merge'
import debounce from 'lodash.debounce'
import Degree from './Degree'
import Coordinate from './Coordinate'
import Rule from './Rule'
import ImageOption from './ImageOption'
import RuleOption from './RuleOption'
import {CONTENT_PORT_NAME} from '../utils/CONSTANT'
import Connection from '../utils/Connection'
import './content.scss'

const connection = new Connection(CONTENT_PORT_NAME);
export default class extends PureComponent {
    static displayName = 'ContentView';
    state = {
        imgData: {
            scale: 100,
            opacity: 60,
            locked: false,
            translate: {
                x: 0,
                y: 0
            }
        },
        ruleData: {
            show: false,
            locked: false,
            angle: true,
            coordinate: true,
            degree: true
        },
        imgSrc: '',
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    };

    constructor() {
        super();
        this.handlerMouseUp = this.handlerMouseUp.bind(this);
        this.handlerMouseDown = this.handlerMouseDown.bind(this);
        this.handlerMouseMove = this.handlerMouseMove.bind(this);
        this.handlerResize = debounce(this.handlerResize.bind(this), 500);
        this.setImgData = this.setImgData.bind(this);
        this.setRuleData=this.setRuleData.bind(this);
    }

    componentWillMount() {
        connection
            .on('initData', (data) => {
                this.setState(merge({}, this.state, data));
            })
            .on('dataChange', (data) => {
                this.setState(merge({}, this.state, data));
            }).send('initData');
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handlerMouseMove);
        document.addEventListener('mouseup', this.handlerMouseUp);
        window.addEventListener('resize', this.handlerResize)
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handlerMouseMove);
        document.removeEventListener('mouseup', this.handlerMouseUp);
        window.removeEventListener('resize', this.handlerResize);
    }

    setRuleData(data){
        this.setData({
            ruleData: data
        });
    }

    setImgData(data) {
        this.setData({
            imgData: data
        });
    }

    handlerResize() {
        this.setState({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        });
    }

    handlerMouseUp() {
        this.start = null;
        function fixed(value) {
            let roundValue = Math.round(value / 10) * 10;
            if (Math.abs(roundValue - value) <= 2) {
                return roundValue;
            } else {
                return value;
            }
        }

        const {x, y} = this.state.imgData.translate;
        this.setData({
            imgData: {
                translate: {
                    x: fixed(x),
                    y: fixed(y)
                }
            }
        });
    }

    handlerMouseDown(e) {
        if (this.state.imgData.locked) {
            return;
        }
        this.start = {
            x: e.clientX,
            y: e.clientY
        }
    }

    handlerMouseMove(e) {
        if (this.state.imgData.locked) {
            return;
        }
        if (this.start && e.which) {
            let delta = {
                x: e.clientX - this.start.x,
                y: e.clientY - this.start.y
            };
            this.start = {
                x: e.clientX,
                y: e.clientY
            };
            this.setData({
                imgData: {
                    translate: {
                        x: delta.x + this.state.imgData.translate.x,
                        y: delta.y + this.state.imgData.translate.y
                    }
                }
            });
        }
    }

    setData(data) {
        this.setState(merge({}, this.state, data), () => {
            this.sendDataChangeMessage();
        });
    }

    sendDataChangeMessage() {
        connection.send('dataChange', {
            imgData: this.state.imgData,
            ruleData: this.state.ruleData
        });
    }

    render() {
        return (
            <div className="vt-content">
                {this.state.imgSrc && !this.state.imgData.locked || this.state.ruleData.show && !this.state.ruleData.locked ?
                    <div className="vt-content__over"></div> : null}
                {this.state.imgSrc ? <div className={classnames({
                    "vt-content__img": !this.state.imgData.locked,
                    "vt-content__img--locked": this.state.imgData.locked
                })}>
                    <div className="vt-content__img-outer" onMouseDown={this.handlerMouseDown} style={{
                        width: this.state.width,
                        height: this.state.height,
                        opacity: this.state.imgData.opacity / 100,
                        transform: `scale(${this.state.imgData.scale / 100}) translate(${this.state.imgData.translate.x}px,${this.state.imgData.translate.y}px)`
                    }}>
                        <img className="vt-content__img-image" src={this.state.imgSrc}
                             style={{width: this.state.width}}/>
                    </div>
                </div> : null}
                {this.state.ruleData.show ?
                    <div className="vt-content__rule">
                        {this.state.ruleData.degree ?
                            <Degree className="vt-content__rule-degree" width={this.state.width}
                                    height={this.state.height}/> : null}
                        {this.state.ruleData.coordinate ?
                            <Coordinate className="vt-content__coordinate" degree={this.state.ruleData.degree}/> : null}
                        <Rule className={classnames({
                            "vt-content__rule-rule--locked": this.state.ruleData.locked,
                            "vt-content__rule-rule": !this.state.ruleData.locked
                        })} width={this.state.width} height={this.state.height} coordinate={this.state.ruleData.coordinate}/>
                    </div>
                    : null}
                <div className="vt-content__options">
                    {this.state.ruleData.show ?
                        <RuleOption className="vt-content__options-rule" onChange={this.setRuleData}
                                    data={this.state.ruleData}/> : null}
                    {this.state.imgSrc && !this.state.imgData.locked ?
                        <ImageOption className="vt-content__options-img" onChange={this.setImgData}
                                     data={this.state.imgData}/> : null}
                </div>
            </div>
        );
    }
}