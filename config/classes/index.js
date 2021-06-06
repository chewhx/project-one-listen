exports.File = require("./File");
const Node = require("./Node");
const Queue = require("./Queue");

exports.parserQueue = new Queue("parserQueue");
exports.audioQueue = new Queue("audioQueue");
exports.parserNode = new Node("parserNode");
exports.audioNode = new Node("audioNode");
