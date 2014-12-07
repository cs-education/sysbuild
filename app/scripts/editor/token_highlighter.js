/* global ace */
'use strict';

var oop = ace.require('ace/lib/oop');
var aceEvent = ace.require('ace/lib/event');
var Range = ace.require('ace/range').Range;
var Tooltip = ace.require('ace/tooltip').Tooltip;

function TokenHighlighter(editor, manPageTokens, clickCallback) {
    editor = editor.aceEditor;
    if (editor.TokenHighlighter) {
        return;
    }
    Tooltip.call(this, editor.container);
    editor.TokenHighlighter = this;
    this.editor = editor;
    this.manPageTokens = manPageTokens;
    this.clickCallback = clickCallback;

    this.highlightTokens = this.highlightTokens.bind(this);
    this.update = this.update.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    aceEvent.addListener(editor.renderer.content, 'mouseout', this.onMouseOut);
    editor.on('change', this.update);
}

oop.inherits(TokenHighlighter, Tooltip);

(function () {
    var self = this;
    this.token = {};
    this.markers = [];
    this.range = new Range();

    this.highlightTokens = function () {
        this.$timer = null;

        var r = this.editor.renderer;
        if (this.lastT - (r.timeStamp || 0) > 1000) {
            r.rect = null;
            r.timeStamp = this.lastT;
            this.maxHeight = window.innerHeight;
            this.maxWidth = window.innerWidth;
        }

        var session = this.editor.session;
        var docLength = session.getLength();
        var manPageTokens = this.manPageTokens;
        var row = 1;
        var tokenStart = 0;
        console.log(r);
        var searchAndHighlight = function(token){
            if(token.type === 'identifier'){
                manPageTokens.get(token.value, function(results){
                    if(results.length && results[0].name === token.value){
                        var range = new Range(row, tokenStart, row, tokenStart+token.value.length);
                        self.markers.push(session.addMarker(range, 'token-highlight', 'text'));
                        console.log(self.markers);
                    }
                });
            }
            tokenStart += token.value.length;
        };

        for (row = 1; row <= docLength; row++) {
            var tokens = session.getTokens(row);
            tokenStart = 0;
            tokens.forEach(searchAndHighlight);
        }
    };

    this.update = function () {
        var session = this.editor.session;

        if(!this.$timer){
            self.markers.forEach(function(marker){
                session.removeMarker(marker);
            });
            self.markers = [];
            this.$timer = setTimeout(this.highlightTokens, 100);
        }
        /*
        var tokenText = token.type;
        manPageTokens.get();
        if (token.state) {
            tokenText += '|' + token.state;
        }
        if (token.merge) {
            tokenText += '\n  merge';
        }
        if (token.stateTransitions) {
            tokenText += '\n  ' + token.stateTransitions.join('\n  ');
        }

        if (this.tokenText !== tokenText) {
            this.setText(tokenText);
            this.width = this.getWidth();
            this.height = this.getHeight();
            this.tokenText = tokenText;
        }

        this.show(null, this.x, this.y);

        this.token = token;
        session.removeMarker(this.marker);
        this.range = new Range(docPos.row, token.start, docPos.row, token.start + token.value.length);
        this.marker = session.addMarker(this.range, 'ace_bracket', 'text');*/
    };

    this.onMouseOut = function (e) {
        if (e && e.currentTarget.contains(e.relatedTarget)) {
            return;
        }
        this.hide();
        this.editor.session.removeMarker(this.marker);
        this.$timer = clearTimeout(this.$timer);
    };

    this.setPosition = function (x, y) {
        if (x + 10 + this.width > this.maxWidth) {
            x = window.innerWidth - this.width - 10;
        }
        if (y > window.innerHeight * 0.75 || y + 20 + this.height > this.maxHeight) {
            y = y - this.height - 30;
        }
        Tooltip.prototype.setPosition.call(this, x + 10, y + 20);
    };

    this.destroy = function () {
        this.onMouseOut();
        aceEvent.removeListener(this.editor.renderer.scroller, 'mousemove', this.onMouseMove);
        aceEvent.removeListener(this.editor.renderer.content, 'mouseout', this.onMouseOut);
        delete this.editor.TokenHighlighter;
    };

}).call(TokenHighlighter.prototype);
