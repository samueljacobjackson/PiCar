module.exports = function(RED) {
    "use strict";
    var fs = require("fs");
    function FileExistsNode(n) {
        RED.nodes.createNode(this,n);
        this.filename = n.filename;
        var node = this;
        this.on("input",function(msg) {
            if(!node.filename || node.filename === ''){
                node.filename = msg.filename?msg.filename:'';
            }
            msg.payload = fs.existsSync(node.filename);
            node.send(msg);
        });
    }
    RED.nodes.registerType("file-exists",FileExistsNode);
}
