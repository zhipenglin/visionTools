import setBrowserActionIcon from './utils/setBrowserActionIcon'

let imgList = [];
let data = {
    "vision_tools_popup": {
        connect: null
    },
    "vision_tools_content": {}
};

function sendTo(port, msg, tabId) {
    function send(connect) {
        connect.postMessage({
            name: msg.name,
            message: msg.message
        })
    }

    if (port === 'vision_tools_popup') {
        send(data[port].connect);
    } else if (port === 'vision_tools_content') {
        if (tabId) {
            data[port][tabId] && send(data[port][tabId].connect);
        } else {
            for (let tabData of data[port]) {
                send(tabData.connect);
            }
        }
    }
}
chrome.extension.onConnect.addListener(function (connect) {
    function send(name, msg) {
        connect.postMessage({
            name, message: msg
        });
    }

    function on(messageBack) {
        connect.onMessage.addListener(function (msg) {
            messageBack[msg.name] && messageBack[msg.name](msg.message);
        });
    }

    if (connect.name == "vision_tools_popup") {
        let popupData = data[connect.name];
        popupData.connect = connect;
        on({
            getInfo() {
                chrome.tabs.getSelected(null, function (tab) {
                    let tabData = data["vision_tools_content"][tab.id], message = {imgList};
                    if (tabData && tabData.img) {
                        message.activeKey = imgList.indexOf(tabData.img);
                        message.locked = tabData.locked;
                        message.scale = tabData.scale;
                        message.opacity = tabData.opacity;
                    }
                    send('getInfo', message);
                });
            },
            setInfo(msg){
                imgList = msg.imgList;
                let img = imgList[msg.activeKey];
                chrome.tabs.getSelected(null, function (tab) {
                    sendTo('vision_tools_content', {
                        name: 'setImg',
                        message: img
                    }, tab.id);
                    sendTo('vision_tools_content', {
                        name: 'setImgStyle',
                        message: {locked: msg.locked, scale: msg.scale, opacity: msg.opacity}
                    }, tab.id);
                    let tabData = data['vision_tools_content'][tab.id];
                    if (tabData) {
                        Object.assign(tabData, {img, locked: msg.locked, scale: msg.scale, opacity: msg.opacity});
                    }
                });
            }
        });
    } else if (connect.name == "vision_tools_content") {
        let tabId = connect.sender.tab.id;
        if (!data[connect.name][tabId]) {
            data[connect.name][tabId] = {};
        }
        let tabData = data[connect.name][tabId];
        tabData.connect = connect;
        on({
            getInfo(){
                if (tabData.img) {
                    send('setImg', tabData.img);
                    send('setImgStyle', {
                        locked: tabData.locked,
                        scale: tabData.scale,
                        opacity: tabData.opacity,
                        translate: tabData.translate
                    });
                }
            },
            setImgStyle(msg){
                Object.assign(tabData, {
                    locked: msg.locked,
                    scale: msg.scale,
                    opacity: msg.opacity,
                    translate: msg.translate
                });
            }
        });
    }
});

chrome.tabs.onSelectionChanged.addListener((tabId) => {
    setBrowserActionIcon(data['vision_tools_content'][tabId] && data['vision_tools_content'][tabId].img);
});