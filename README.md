# clevernails
An intelligent thumbnail generator that gets the most important part of a image based on shannon entropy.

## Install

```plain
npm install --save clevernails
```

## Basic Usage

```javascript
var clevernails = require('clevernails');
var option = {
    input: "./test.jpg", // input image path
    output: "./output.jpg",  // output image path
    size: [500, 500]    // output image size
};
clevernails.process(option, function (err, result) {
    if (err) {
        throw err;
    }
    else {
        console.log(result);
    }
});
```

**Notice**: Input and output path is required.

## output size

The following configuration about size is accepted:

**Format 1:** Two dimension array:
```javascript
var option = {
    input: "./test.jpg", // input image path
    output: "./output.jpg",  // output image path
    size: [500, 500]    // output image size
};
```

**Format 2:** One dimension array:
```javascript
var option = {
    input: "./test.jpg", // input image path
    output: "./output.jpg",  // output image path
    size: [500]    // output image size
};
```
size will be interpreted as ```[500, 500]```in this example.

**Format 3:** A single number:
```javascript
var option = {
    input: "./test.jpg", // input image path
    output: "./output.jpg",  // output image path
    size: 500    // output image size
};
```
size will be intepreted as ```[500, 500]```in this example.

**Format 4:** multiple dimension array (dimension > 2):
```javascript
var option = {
    input: "./test.jpg", // input image path
    output: "./output.jpg",  // output image path
    size: [300, 400, 500]    // output image size
};
```
size will be intepreted as ```[300, 400]```in this example.

## Contributors
* [HeavenDuke](https://github.com/HeavenDuke)

## License
[MIT](https://opensource.org/licenses/MIT)