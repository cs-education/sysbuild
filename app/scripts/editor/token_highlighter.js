/* global ace */
'use strict';

var Range = ace.require('ace/range').Range;

function TokenHighlighter(editor, manPageTokens, clickCallback) {
    editor = editor.aceEditor;
    if (editor.TokenHighlighter) {
        return;
    }
    editor.TokenHighlighter = this;
    this.editor = editor;
    this.manPageTokens = manPageTokens;
    this.clickCallback = clickCallback;

    this.highlightTokens = this.highlightTokens.bind(this);
    this.onClick = this.onClick.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
    var updateTimer = null;
    editor.on('change', function(){
        clearTimeout(updateTimer);
        if(!editor.TokenHighlighter.highlightingTokens){
            updateTimer = setTimeout(editor.TokenHighlighter.highlightTokens, 500);
        }
    });
    editor.commands.addCommand({
        name: 'manPageShortcut',
        bindKey: {win: 'Ctrl-I', mac: 'Command-M'},
        exec: function(editor){
            var pos = editor.getCursorPosition();
            var token = editor.session.getTokenAt(pos.row, pos.column);
            editor.TokenHighlighter.eventHandler(token);
        }
    });
    editor.on('click', this.onClick);
}

(function () {
    var self = this;
    self.markers = [];
    self.tokenStore = {};

    this.highlightTokens = function () {
        this.highlightingTokens = true;

        var session = this.editor.session;
        var docLength = session.getLength();
        var manPageTokens = this.manPageTokens;
        var row = 1;
        var tokenStart = 0;

        var searchAndHighlight = function(token){
            if(token.type === 'identifier'){
                manPageTokens.get(token.value, function(results){
                    var i = 0;
                    if(results.length && results[i].name === token.value){
                        var result = results[i];
                        while(result && result.section !== 2 && result.section !== 3){
                            result = results[++i];
                        }
                        if(result){
                            self.tokenStore[token.value] = result;
                            var range = new Range(row, tokenStart, row, tokenStart+token.value.length);
                            self.markers.push(session.addMarker(range, 'token-highlight', 'text'));
                        }
                    }
                });
            }
            tokenStart += token.value.length;
        };
        self.markers.forEach(function(marker){
            session.removeMarker(marker);
        });
        self.markers = [];

        for (row = 1; row <= docLength; row++) {
            var tokens = session.getTokens(row);
            tokenStart = 0;
            tokens.forEach(searchAndHighlight);
        }
        this.highlightingTokens = false;
    };

    this.onClick = function (e) {
        var editor = e.editor;
        var r = editor.renderer;
        var canvasPos = r.rect || (r.rect = r.scroller.getBoundingClientRect());
        var offset = (e.clientX + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
        var row = Math.floor((e.clientY + r.scrollTop - canvasPos.top) / r.lineHeight);
        var column = Math.round(offset);
        var screenPos = {row: row, column: column, side: offset - column > 0 ? 1 : -1};
        var token = editor.session.getTokenAt(screenPos.row, screenPos.column);
        if(token && token.type === 'identifier') {
            this.eventHandler(token);
        }
    };

    this.eventHandler = function(token){
        if(self.tokenStore[token.value]){
            this.clickCallback(self.tokenStore[token.value]);
        }
    };

    this.destroy = function () {
        delete this.editor.TokenHighlighter;
    };

}).call(TokenHighlighter.prototype);
