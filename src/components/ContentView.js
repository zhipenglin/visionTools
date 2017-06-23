import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Regulator from './Regulator'
import Connection from '../utils/Connection'
import './content.scss'
const connection = new Connection('vision_tools_content');

const windowWidth = document.documentElement.clientWidth, windowHeight = document.documentElement.clientHeight;

export default class extends PureComponent {
    state = {
        src: null,
        locked: false,
        scale: 50,
        opacity: 60,
        translate: {x: 0, y: 0}
    };

    constructor() {
        super();
        this.handlerMouseUp = this.handlerMouseUp.bind(this);
        this.handlerMouseDown = this.handlerMouseDown.bind(this);
        this.handlerMouseMove = this.handlerMouseMove.bind(this);
        this.handlerRegulatorChange = this.handlerRegulatorChange.bind(this);
    }

    componentWillMount() {
        connection.send('getInfo');
        connection.on('setImg', (img) => {
            this.setState({src: img});
        });
        connection.on('setImgStyle', (style) => {
            this.setState(style);
        });
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handlerMouseMove);
        document.addEventListener('mouseup', this.handlerMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handlerMouseMove);
        document.removeEventListener('mouseup', this.handlerMouseUp);
    }

    handlerMouseUp() {
        this.start = null;
    }

    handlerMouseDown(e) {
        if (this.state.locked) {
            return;
        }
        this.start = {
            x: e.clientX,
            y: e.clientY
        }
    }

    handlerMouseMove(e) {
        if (this.state.locked) {
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
            this.setState({
                translate: {
                    x: delta.x + this.state.translate.x,
                    y: delta.y + this.state.translate.y
                }
            });
        }
    }

    handlerRegulatorChange(style) {
        this.setState(style, () => {
            const {locked, scale, opacity, translate} = this.state;
            connection.send('setImgStyle', {locked, scale, opacity, translate});
        });
    }

    render() {
        if (this.state.src) {
            return (
                <div className={classnames("vt-content", {
                    "vt-content--locked": this.state.locked
                })}>
                    <div className="vt-content__cover"></div>
                    <div className="vt-content__img-outer" onMouseDown={this.handlerMouseDown} style={{
                        opacity: this.state.opacity / 100,
                        transform: `translate(${this.state.translate.x}px,${this.state.translate.y}px)`
                    }}>
                        <img className="vt-content__img" src={this.state.src}
                             style={{width: windowWidth, transform: `scale(${this.state.scale / 50})`}}/>
                    </div>
                    {this.state.locked ? null : <div className="vt-content__regulator">
                        <Regulator locked={this.state.locked} scale={this.state.scale} opacity={this.state.opacity}
                                   onChange={this.handlerRegulatorChange}/>
                    </div>}
                </div>
            );
        } else {
            return null;
        }
    }
}