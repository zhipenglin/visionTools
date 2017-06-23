import React, {PureComponent} from 'react'
import classnames from 'classnames'
import UpdateButton from './UpdateButton'
import Button from './Button'
import Regulator from './Regulator'
import Connection from '../utils/Connection'
import setBrowserActionIcon from '../utils/setBrowserActionIcon'
import './style.scss'

const connection = new Connection("vision_tools_popup");
class ImgItem extends PureComponent {
    state = {
        active: false
    };

    constructor() {
        super();
        this.handlerClick = this.handlerClick.bind(this);
    }

    handlerClick() {
        const {id, onClick} = this.props;
        onClick && onClick(id);
    }

    render() {
        const {src, active} = this.props;
        return (
            <Button className={classnames("vt-popup__item", {
                "vt-popup__item--active": active
            })} onClick={this.handlerClick}>
                <img className="vt-popup__item-img" src={src}/>
            </Button>
        );
    }
}

export default class extends PureComponent {
    state = {
        activeKey: -1,
        scale: 50,
        opacity: 60,
        locked: false,
        imgList: []
    };

    constructor() {
        super();
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerItemClick = this.handlerItemClick.bind(this);
        this.handlerRegulatorChange = this.handlerRegulatorChange.bind(this);
    }

    componentWillMount() {
        connection.send('getInfo');
        connection.on('getInfo', (msg) => {
            let newState = {};

            if (Number.isInteger(msg.activeKey)) {
                newState.activeKey = msg.activeKey;
            }

            if (Array.isArray(msg.imgList)) {
                newState.imgList = msg.imgList;
            }

            if (msg.scale) {
                newState.scale = msg.scale;
            }

            if (msg.locked) {
                newState.locked = msg.locked;
            }

            if (msg.opacity) {
                newState.opacity = msg.opacity;
            }

            this.setState(newState, () => {
                setBrowserActionIcon(this.state.activeKey !== -1);
            });
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.activeKey !== nextState.activeKey) {
            setBrowserActionIcon(nextState.activeKey !== -1);
        }
        connection.send('setInfo', {
            activeKey: nextState.activeKey,
            imgList: nextState.imgList,
            scale: nextState.scale,
            opacity: nextState.opacity,
            locked: nextState.locked
        });
    }

    handlerChange(file) {
        const {imgList} = this.state;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            let newImgList = imgList.slice(0);
            newImgList.push(e.target.result);
            this.setState({imgList: newImgList});
        };
    }

    handlerItemClick(value) {
        if (value !== this.state.activeKey) {
            this.setState({activeKey: value});
        } else {
            this.setState({activeKey: -1});
        }
    }

    handlerRegulatorChange(value) {
        this.setState(value);
    }

    render() {
        return (
            <div className="vt-popup">
                <div className="vt-popup__options">
                    <UpdateButton className="vt-popup__btn-add" onChange={this.handlerChange}></UpdateButton>
                </div>
                {this.state.imgList.length > 0 && this.state.imgList[this.state.activeKey] ?
                    <div className="vt-popup__regulator">
                        <Regulator opacity={this.state.opacity} scale={this.state.scale} locked={this.state.locked}
                                   onChange={this.handlerRegulatorChange}/>
                    </div> : null}
                <div className="vt-popup__list">
                    {this.state.imgList.map((value, key) => <ImgItem onClick={this.handlerItemClick}
                                                                     active={key === this.state.activeKey} src={value}
                                                                     id={key} key={key}/>)}
                </div>
            </div>
        );
    }
}