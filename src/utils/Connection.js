export default class Connect {
    constructor(port) {
        this.port = port;
        this.eventList = {};
        if (__DEV__) {
            console.warn('开发环境无法监听到事件');
        } else {
            this.connect = chrome.extension.connect({name: this.port});
            this._init();
        }
    }

    on(name, callback) {
        if (!this.eventList[name]) {
            this.eventList[name] = [];
        }
        this.eventList[name].push(callback);
        return this;
    }

    off(name) {
        delete this.eventList[name];
        return this;
    }

    send(name, msg) {
        let message = {
            name, message: msg
        };
        if (__DEV__) {
            console.log(message);
            return;
        }
        this.connect.postMessage(message);
        return this;
    }

    _init() {
        this.connect.onMessage.addListener((msg) => {
            let callbackList = this.eventList[msg.name];
            if (callbackList && callbackList.length > 0) {
                callbackList.forEach((callback) => {
                    callback(msg.message);
                });
            }
        });
    }
}