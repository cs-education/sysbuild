/* jshint ignore:start */

ace.define('ace/mode/c_cpp_sys', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/c_cpp_highlight_rules', 'ace/mode/matching_brace_outdent', 'ace/range', 'ace/mode/behaviour/cstyle', 'ace/mode/folding/cstyle'], function (require, exports) {
    'use strict';

    var oop = require('../lib/oop');
    var textMode = require('./text').Mode;
    var cppHighlightRules = require('./c_cpp_highlight_rules').c_cppHighlightRules;
    var MatchingBraceOutdent = require('./matching_brace_outdent').MatchingBraceOutdent;
    var CstyleBehaviour = require('./behaviour/cstyle').CstyleBehaviour;
    var CStyleFoldMode = require('./folding/cstyle').FoldMode;

    var Mode = function () {
        this.HighlightRules = cppHighlightRules;

        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();

        this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, textMode);

    (function () {
        this.lineCommentStart = '//';
        this.blockComment = {start: '/*', end: '*/'};

        this.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);

            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            //var tokens = tokenizedLine.tokens;
            var endState = tokenizedLine.state;

            /*if (tokens.length && tokens[tokens.length-1].type == "comment") {
             return indent;
             }*/

            var match = line.match(/^.*[\{\(\[][\s]*[^\}\]\)]*$/);
            if (state === 'start') {
                if (match) {
                    indent += tab;
                }
            } else if (state === 'doc-start') {
                if (endState === 'start') {
                    return '';
                }
                match = line.match(/^\s*(\/?)\*/);
                if (match) {
                    if (match[1]) {
                        indent += ' ';
                    }
                    indent += '* ';
                }
            }

            return indent;
        };

        this.checkOutdent = function (state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };

        this.autoOutdent = function (state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };

        this.$id = 'ace/mode/c_cpp_sys';
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
/* jshint ignore:end */

