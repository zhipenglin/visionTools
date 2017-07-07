import merge from 'lodash.merge'
import setBrowserActionIcon from './utils/setBrowserActionIcon'
import {POPUP_PORT_NAME, CONTENT_PORT_NAME} from './utils/CONSTANT'

const DATA = {
    imgList:[],
    [POPUP_PORT_NAME]: {},
    [CONTENT_PORT_NAME]: {}
};

class Content{
    static getTab(id){
        return DATA[CONTENT_PORT_NAME][id]||{};
    }
    static getConnect(id){
        return Content.getTab(id).connect;
    }
    static getContent(id){
        let connect=Content.getConnect(id);
        return new Content(id,connect);
    }
    static getBrowserActionIconState(id){
        let content=new Content(id);
        return content.getImg()||content.getRuleData().show;
    }
    constructor(tabId,connect){
        this.id=tabId;
        this.portName=CONTENT_PORT_NAME;
        this.connect=connect;
        this.eventList={};
        this.init();
    }
    init(){
        if(!this.connect){
            console.warn('tab的connect还未建立');
            return;
        }
        this.setConnect(this.connect);
        this.connect.onMessage.addListener((msg)=>{
            this.eventList[msg.name]&&this.eventList[msg.name].forEach((callback)=>{
                callback(msg.message);
            });
        });
    }
    getData(){
        return Object.assign({},DATA[this.portName][this.id]);
    }
    getSendData(){
        return {
            imgData:Object.assign({},this.getImgStyleData()),
            imgSrc:this.getImg(),
            ruleData:this.getRuleData()
        }
    }
    getImgData(){
        return Object.assign({},this.getData().imgData);
    }
    getImgStyleData(){
        let ImgData=this.getImgData();
        delete ImgData.selectIndex;
        return ImgData;
    }
    getRuleData(){
        return Object.assign({},this.getData().ruleData);
    }
    getImg(){
        let imgData=this.getImgData();
        return DATA.imgList[imgData.selectIndex]||'';
    }
    setData(data={}){
        DATA[this.portName][this.id]=merge({},this.getData(),data);
        return this;
    }
    setImgData(imgData={}){
        this.setData(merge({},this.getData(),{imgData}));
        return this;
    }
    setRuleData(ruleData={}){
        this.setData(merge({},this.getData(),{ruleData}));
        return this;
    }
    setConnect(connect){
        if(!connect){
            return this;
        }
        this.setData(merge({},this.getData(),{connect}));
        return this;
    }
    send(name,message){
        this.connect&&this.connect.postMessage({name,message});
        return this;
    }
    on(name,callback){
        if(!this.eventList[name]) {
            this.eventList[name] = [];
        }
        this.eventList[name].push(callback);
        return this;
    }
}

class PopUp{
    constructor(connect){
        this.connect=connect;
        this.eventList={};
        this.init();
    }
    init(){
        this.connect.onMessage.addListener((msg)=>{
            this.eventList[msg.name]&&this.eventList[msg.name].forEach((callback)=>{
                callback(msg.message);
            });
        });
    }
    send(name,message){
        this.connect&&this.connect.postMessage({name,message});
        return this;
    }
    on(name,callback){
        if(!this.eventList[name]) {
            this.eventList[name] = [];
        }
        this.eventList[name].push(callback);
        return this;
    }
}

chrome.tabs.onSelectionChanged.addListener((tabId) => {
    setBrowserActionIcon(Content.getBrowserActionIconState(tabId));
});

chrome.extension.onConnect.addListener(function (connect) {
    if(connect.name==CONTENT_PORT_NAME){
        let content=new Content(connect.sender.tab.id,connect);
        content.on('initData',()=>{
            content.send('initData',content.getSendData());
        }).on('dataChange',({imgData,ruleData})=>{
            content.setData({imgData,ruleData});
        });
    }else if(connect.name==POPUP_PORT_NAME){
        let popup=new PopUp(connect);
        popup.on('initData',()=>{
            chrome.tabs.getSelected(null, function ({id}) {
                let content=Content.getContent(id);
                popup.send('initData',{
                    imgData:Object.assign({},content.getImgData(),{list:DATA.imgList}),
                    ruleData:content.getRuleData()
                }).on('dataChange',({imgData,ruleData})=>{
                    DATA.imgList=imgData.list;
                    delete imgData.list;
                    content.setData({imgData,ruleData});
                    content.send('dataChange',content.getSendData());
                });
            });
        });
    }
});

