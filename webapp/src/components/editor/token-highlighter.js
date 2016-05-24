import ace from 'ace/ace';
var Range = ace.require('ace/range').Range;

class TokenHighlighter {

    constructor(editor, tokens, cb) {
        var self = this;

        self.aceEditor = editor.aceEditor;
        self.tokens = tokens;
        self.eventCallback = cb;

        self.supportedTypes = {
            'identifier': 1,
            'support.function.C99.c': 1
        };

        self.markers = [];
        self.tokenStore = {};
        self.busy = false;

        var updateTimer = null;
        self.aceEditor.on('change', function () {
            clearTimeout(updateTimer);
            if (!self.busy) {
                updateTimer = setTimeout(self.highlightTokens.bind(self), 500);
            }
        });
        var keyShortcutExec = function (aceEditor) {
            var pos = aceEditor.getCursorPosition();
            var token = aceEditor.session.getTokenAt(pos.row, pos.column);
            self.eventHandler(token);
        };
        editor.addKeyboardCommand('tokenHighlightShortcut', {win: 'Ctrl-I', mac: 'Command-I'}, keyShortcutExec);
        self.aceEditor.on('dblclick', self.ondblclick.bind(self));
    }

    highlightTokens() {
        var self = this;

        self.busy = true;

        var session = self.aceEditor.session;
        var docLength = session.getLength();
        var manPageTokens = self.tokens;
        var row = 1;
        var tokenStart = 0;

        self.markers.forEach(function (marker) {
            session.removeMarker(marker);
        });
        self.markers = [];

        var searchAndHighlight = function (token) {
            if (self.supportedTypes[token.type]) {
                manPageTokens.get(token.value, function (results) {
                    var i = 0;
                    if (results.length && results[i].name === token.value) {
                        var result = results[i];
                        while (result && result.section !== 2 && result.section !== 3) {
                            result = results[++i];
                        }
                        if (result) {
                            self.tokenStore[token.value] = result;
                            var range = new Range(row, tokenStart, row, tokenStart + token.value.length);
                            self.markers.push(session.addMarker(range, 'token-highlight', 'text'));
                        }
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
        self.busy = false;
    }

    ondblclick(e) {
        var aceEditor = e.editor;
        var r = aceEditor.renderer;
        var canvasPos = r.rect || (r.rect = r.scroller.getBoundingClientRect());
        var offset = (e.clientX + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
        var row = Math.floor((e.clientY + r.scrollTop - canvasPos.top) / r.lineHeight);
        var column = Math.round(offset);
        var screenPos = {row: row, column: column, side: offset - column > 0 ? 1 : -1};
        var token = aceEditor.session.getTokenAt(screenPos.row, screenPos.column);
        if (token && this.supportedTypes[token.type]) {
            this.eventHandler(token);
        }
    }

    eventHandler(token) {
        if (token && this.tokenStore[token.value]) {
            this.eventCallback(this.tokenStore[token.value]);
        }
    }

    destroy() {
        delete this.aceEditor.TokenHighlighter;
    }
}

export default TokenHighlighter;
