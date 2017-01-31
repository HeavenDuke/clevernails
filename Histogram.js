/**
 * Created by heavenduke on 17-1-15.
 */


var Histogram = function () {
    this.space = 256;
    this.data = new Array(this.space);
    this.total = 0;
    for(var i = 0; i < this.space; i++) {
        this.data[i] = new Array(this.space);
        for(var j = 0; j < this.space; j++) {
            this.data[i][j] = 0;
        }
    }
    this.update = function (g1, g2, offset) {
        this.data[g1][g2] += offset;
        this.total += offset;
    };
    this.entropy = function () {
        var sum = 0.;
        for(var i = 0; i < this.space; i++) {
            for(var j = 0; j < this.space; j++) {
                if (this.data[i][j] != 0) {
                    var p = this.data[i][j] / this.total;
                    sum += -p * Math.log(p);
                }
            }
        }
        return sum;
    }
};

module.exports = Histogram;