/**
 * Created by heavenduke on 17-1-15.
 */

var Jimp = require("jimp");
var Histogram = require('./Histogram');

var Clevernails = {};

Clevernails.defaults = {
    size: [50, 50]
};

Clevernails.const = {
    HORIZONTAL: 1,
    VERTICAL: 0,
    EPSILON: 1e-10
};

Clevernails.getGreyscaleImage = function (image) {
    var result = image.clone();
    result.greyscale();
    return result;
};

Clevernails.getMeanImage = function (image) {
    var result = image.clone();
    result.blur(1);
    return result;
};

Clevernails.resize = function (image, size) {
    var result = image.clone();
    var tWidth = size[0], tHeight = size[1];
    var scale = Math.max( tWidth / result.bitmap.width, tHeight / result.bitmap.height);
    var nWidth = scale * result.bitmap.width, nHeight = scale * result.bitmap.height;
    result.resize(nWidth, nHeight);
    return result;
};

Clevernails.checkInput = function (options, callback) {
    if (options instanceof Function) {
        options(new Error("please provide correct configuration"));
        return false;
    }
    else if (!options || !(options instanceof Object)) {
        if (callback instanceof Function) {
            callback(new Error("please provide correct configuration"));
            return false;
        }
        else {
            throw new Error("please provide correct configuration");
        }
    }
    else if(!options.hasOwnProperty("input")
        || !options.hasOwnProperty("output")) {
        if (callback instanceof Function) {
            callback(new Error("please provide correct input or output path"));
            return false;
        }
        else {
            throw new Error("please provide correct input or output path");
        }
    }
    else {
        return true;
    }
};

Clevernails.parseSize = function (size, callback) {
    if (!size) {
        return this.defaults.size;
    }
    else if (size instanceof Array) {
        if (size.length >= 2) {
            if (!isNaN(parseInt(size[0])) && !isNaN(parseInt(size[1]))) {
                return [parseInt(size[0]), parseInt(size[1])];
            }
        }
        else if (size.length == 1) {
            if (!isNaN(parseInt(size[0]))) {
                return [parseInt(size[0]), parseInt(size[0])];
            }
        }
    }
    else if (!isNaN(parseInt(size))) {
        return [parseInt(size), parseInt(size)];
    }
    callback(new TypeError("please provide correct size"));
    return null;
};

Clevernails.process = function (options, callback) {

    var that = this;
    if (!that.checkInput(options, callback)) {
        return;
    }

    var size = that.parseSize(options.size, callback);
    if (!size) {
        return;
    }

    Jimp.read(options.input, function (err, image) {
        if (err) {
            return callback(err);
        }

        // 步骤1：将原图转化为灰度图。
        var gray = that.getGreyscaleImage(image);

        // 步骤2：将图像转化到其中一个维度满足目标尺寸。
        image = that.resize(image, size);
        gray = that.resize(gray, size);

        // 步骤3：基于图像构建平均图
        var blurred = that.getMeanImage(image);

        // 步骤4：计算初始的熵值
        var histogram = new Histogram();

        gray.scan(0, 0, size[0], size[1], function (x, y, idx) {
            var valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
            histogram.update(valueR, valueB, 1);
        });

        // 步骤5：初始化迭代参数
        var max = histogram.entropy();
        var mLeft = 0, mTop = 0;
        var iteration = gray.bitmap.width - size[0], direction = that.const.HORIZONTAL;
        if (gray.bitmap.height - size[1] > that.const.EPSILON) {
            direction = that.const.VERTICAL;
            iteration = gray.bitmap.height - size[1];
        }

        // 步骤5：循环更新，直到获得最优的区块
        for(var i = 1; i < iteration; i++) {
            if (direction == that.const.HORIZONTAL) {
                gray.scan(i - 1, 0, 1, size[1], function (x, y, idx) {
                    var valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
                    histogram.update(valueR, valueB, -1);
                });
                gray.scan(i + size[0], 0, 1, size[1], function (x, y, idx) {
                    var valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
                    histogram.update(valueR, valueB, 1);
                });
            }
            else {
                gray.scan(0, i - 1, size[0], 1, function (x, y, idx) {
                    var valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
                    histogram.update(valueR, valueB, -1);
                });
                gray.scan(0, i + size[1], size[0], 1, function (x, y, idx) {
                    var valueR = this.bitmap.data[idx], valueB = blurred.bitmap.data[idx];
                    histogram.update(valueR, valueB, 1);
                });
            }

            var entropy = histogram.entropy();
            if (max < entropy) {
                max = entropy;
                mLeft = direction == that.const.HORIZONTAL ? i : 0;
                mTop = i - mLeft;
            }
        }

        image.crop(mLeft, mTop, size[0], size[1]).write(options.output);

        if (callback && callback instanceof Function) {
            callback(null, "success");
        }
    });
};

module.exports = Clevernails;

var option = {
    input: "./fixtures/test.jpg",
    output: "./output/output-1.jpg",
    size: [500, 500]
};