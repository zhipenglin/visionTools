const defaults = {
    maxWidth: 1366
};

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString
        , mimestring
    if (dataURI.split(',')[0].indexOf('base64') !== -1) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }
    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }
    try {
        return new Blob([new Uint8Array(content)], {type: mimestring});
    } catch (e) {
        return e;
    }

}

export default function (file, options) {
    options = Object.assign({}, defaults, options);
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            resolve(e.target.result);
        }
    }).then((res) => {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.src = res;
            img.onload = function () {
                var degree = options.maxWidth / img.width;
                canvas.width = img.width * degree;
                canvas.height = img.height * degree;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setTimeout(() => {
                    var res = dataURItoBlob(canvas.toDataURL('image/jpeg'), file.name);
                    if (res instanceof Error) {
                        reject(res);
                    } else {
                        resolve(res);
                    }
                }, 0);
            };
        });
    }).catch(() => {
        return Promise.resolve(file);
    });
}