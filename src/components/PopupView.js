import React, {PureComponent} from 'react'
import classnames from 'classnames'
import merge from 'lodash.merge'
import UpdateButton from './UpdateButton'
import Button from './Button'
import ImagePreview from './ImagePreview'
import ImageOption from './ImageOption'
import RuleOption from './RuleOption'
import {POPUP_PORT_NAME} from '../utils/CONSTANT'
import setBrowserActionIcon from '../utils/setBrowserActionIcon'
import Connection from '../utils/Connection'
import './popup.scss'

const connection = new Connection(POPUP_PORT_NAME);

export default class extends PureComponent {
    static displayName = 'PopupView';
    state = {
        imgData: {
            selectIndex: -1,
            list: [],
            scale: 100,
            opacity: 60,
            locked: false
        },
        ruleData: {
            show: false,
            locked: false,
            angle: true,
            coordinate: true,
            degree: true
        }
    };

    constructor() {
        super();
        this.setImgData = this.setImgData.bind(this);
        this.addImage = this.addImage.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.setRuleData = this.setRuleData.bind(this);
    }

    componentWillMount() {
        connection
            .on('initData', (data) => {
                this.setState(merge({}, this.state, data));
            }).on('dataChange',(data)=>{
                this.setState(merge({}, this.state, data));
            }).send('initData');
    }

    setImgData(newData) {
        this.setState({
            imgData: Object.assign({}, this.state.imgData, newData)
        }, () => {
            this.sendDataChangeMessage();
        });
    }

    addImage(img) {
        let list = this.state.imgData.list.slice(0);
        list.push(img);
        this.setImgData({list});
    }

    selectImage(selectIndex) {
        this.setImgData({selectIndex});
    }

    setRuleData(newData) {
        this.setState({
            ruleData: Object.assign({}, this.state.ruleData, newData)
        }, () => {
            this.sendDataChangeMessage();
        });
    }

    sendDataChangeMessage() {
        setBrowserActionIcon(this.state.imgData.list[this.state.imgData.selectIndex] || this.state.ruleData.show);
        connection.send('dataChange', this.state);
    }

    render() {
        return (
            <div className="vt-popup">
                <div className="vt-popup__btns">
                    <UpdateButton className="vt-popup__btn-add" onChange={this.addImage}/>
                    <Button className={classnames({
                        "vt-popup__btn-rule": !this.state.ruleData.show,
                        "vt-popup__btn-rule--active": this.state.ruleData.show
                    })} onClick={this.setRuleData.bind(this, {show: !this.state.ruleData.show})}/>
                </div>
                <div className="vt-popup__options">
                    {this.state.ruleData.show ? <RuleOption onChange={this.setRuleData} data={this.state.ruleData}/> : null}
                    {this.state.imgData.list[this.state.imgData.selectIndex]?<ImageOption onChange={this.setImgData} data={this.state.imgData}/>:null}
                </div>
                <div className="vt-popup__preview">
                    <ImagePreview list={this.state.imgData.list}
                                  selectIndex={this.state.imgData.selectIndex}
                                  onChange={this.selectImage}/>
                </div>
            </div>
        );
    }
}