/*
 autor @zhongjiajie 2016/5/16
 */
define("ace/mode/logs_highlight_rules", function (require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    var logsHighlightRules = function () {

        var keywords = (
            "BUY"
        );

        var builtinConstants = (
            "SALE"
        );

        var builtinFunctions = (
            ""
        );


        var keywordMapper = this.createKeywordMapper({
            "support.function": builtinFunctions,
            "constant.language": builtinConstants,
            "keyword": keywords
        }, "identifier");


        this.$rules = {
            "start": [{
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },]
        };
    };
    oop.inherits(logsHighlightRules, TextHighlightRules);
    exports.logsHighlightRules = logsHighlightRules;
});

define("ace/mode/logs", function (require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var logsHighlightRules = require("./logs_highlight_rules").logsHighlightRules;
    var logsMode = function () {
        this.HighlightRules = logsHighlightRules;
    };
    oop.inherits(logsMode, TextMode);
    (function () {
        this.$id = "ace/mode/logs"
    }).call(logsMode.prototype),
        exports.Mode = logsMode;
});