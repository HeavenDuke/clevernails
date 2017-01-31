/**
 * Created by heavenduke on 17-1-31.
 */

var assert = require('assert');
var jimp = require('jimp');
var clevernails = require('../');

describe('Clevernails', function () {

    describe('should successfully get thumbnails', function () {
        it('with params and callback', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-1.jpg",
                size: [500, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size[0], image.bitmap.width);
                    assert.equal(option.size[1], image.bitmap.height);
                    done();
                });
            });
        });

        it('with params, without callback', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-2.jpg",
                size: [500, 500]
            };
            clevernails.process(option);
            setTimeout(function () {
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size[0], image.bitmap.width);
                    assert.equal(option.size[1], image.bitmap.height);
                    done();
                });
            }, 1500);
        });

        it('with missing size', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-3.jpg"
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(clevernails.defaults.size[0], image.bitmap.width);
                    assert.equal(clevernails.defaults.size[1], image.bitmap.height);
                    done();
                });
            });
        });

        it('with size of only a number', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-4.jpg",
                size: 233
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size, image.bitmap.width);
                    assert.equal(option.size, image.bitmap.height);
                    done();
                });
            });
        });

        it('with size of two dimensions', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-5.jpg",
                size: [800, 600]
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size[0], image.bitmap.width);
                    assert.equal(option.size[1], image.bitmap.height);
                    done();
                });
            });
        });

        it('with size of more than two dimensions)', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output-6.jpg",
                size: [300, 200, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size[0], image.bitmap.width);
                    assert.equal(option.size[1], image.bitmap.height);
                    done();
                });
            });
        });

        it('with size of only one dimension', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output.jpg",
                size: [233]
            };
            clevernails.process(option, function (err, info) {
                assert.equal(null, err);
                assert.equal("success", info);
                jimp.read(option.output, function (err, image) {
                    assert.equal(null, err);
                    assert.equal(option.size[0], image.bitmap.width);
                    assert.equal(option.size[0], image.bitmap.height);
                    done();
                });
            });
        });

    });


    describe('should throw error', function () {
        it('without params and functions', function (done) {
            try {
                clevernails.process();
            } catch(e) {
                assert.equal("Error", e.name);
                assert.equal("please provide correct configuration", e.message);
                done();
            }
        });

        it('without params with functions', function (done) {
            clevernails.process(function (err, info) {
                assert.equal("Error", err.name);
                assert.equal("please provide correct configuration", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

        it('with missing input', function (done) {
            var option = {
                output: "./test/output.jpg",
                size: [500, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal("Error", err.name);
                assert.equal("please provide correct input or output path", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

        it('with missing output', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                size: [500, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal("Error", err.name);
                assert.equal("please provide correct input or output path", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

        it('with non-existing input path', function (done) {
            var option = {
                input: "./test/fixtures/test-233.jpg",
                output: "./test/output.jpg",
                size: [500, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal("Error", err.name);
                assert.notEqual(-1, err.message.indexOf("ENOENT: no such file or directory, open"));
                assert.equal(undefined, info);
                done();
            });
        });

        it('with non-existing output directory', function (done) {
            var option = {
                input: "./test/fixtures/test-233.jpg",
                output: "./test/output-non-existing/output.jpg",
                size: [500, 500]
            };
            clevernails.process(option, function (err, info) {
                assert.equal("Error", err.name);
                assert.notEqual(-1, err.message.indexOf("ENOENT: no such file or directory, open"));
                assert.equal(undefined, info);
                done();
            });
        });

        it('with incorrect size (not an array)', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output.jpg",
                size: {}
            };
            clevernails.process(option, function (err, info) {
                assert.equal("TypeError", err.name);
                assert.equal("please provide correct size", err.message);
                assert.equal(undefined, info);
                done();
            });
        });


        it('with incorrect size (two dimension but one is not a number)', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output.jpg",
                size: [500, 'a']
            };
            clevernails.process(option, function (err, info) {
                assert.equal("TypeError", err.name);
                assert.equal("please provide correct size", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

        it('with incorrect size (one dimension and is not a number)', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output.jpg",
                size: ['a']
            };
            clevernails.process(option, function (err, info) {
                assert.equal("TypeError", err.name);
                assert.equal("please provide correct size", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

        it('with incorrect size of a empty array', function (done) {
            var option = {
                input: "./test/fixtures/test.jpg",
                output: "./test/output.jpg",
                size: []
            };
            clevernails.process(option, function (err, info) {
                assert.equal("TypeError", err.name);
                assert.equal("please provide correct size", err.message);
                assert.equal(undefined, info);
                done();
            });
        });

    });

});