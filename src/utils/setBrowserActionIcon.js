export default function (able) {
    if (!__DEV__) {
        chrome.browserAction.setIcon({
            path: able ? {
                "16": "../icons/16.png",
                "48": "../icons/48.png",
                "128": '../icons/128.png'
            } : {
                "16": "../icons/16-gray.png",
                "48": "../icons/48-gray.png",
                "128": "../icons/128-gray.png"
            }
        });
    }
}