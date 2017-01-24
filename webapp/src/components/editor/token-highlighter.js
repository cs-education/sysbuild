/* eslint-disable no-mixed-operators */
import ace from 'ace/ace';

const Range = ace.require('ace/range').Range;

class TokenHighlighter {

    constructor(editor, tokens, cb) {
        const self = this;

        self.aceEditor = editor.aceEditor;
        self.tokens = tokens;
        self.eventCallback = cb;

        self.supportedTypes = {
            identifier: 1,
            'support.function.C99.c': 1
        };

        self.markers = [];
        self.tokenStore = {};
        self.busy = false;

        let updateTimer = null;
        self.aceEditor.on('change', () => {
            clearTimeout(updateTimer);
            if (!self.busy) {
                updateTimer = setTimeout(self.highlightTokens.bind(self), 500);
            }
        });
        const keyShortcutExec = aceEditor => {
            const pos = aceEditor.getCursorPosition();
            const token = aceEditor.session.getTokenAt(pos.row, pos.column);
            self.eventHandler(token);
        };
        editor.addKeyboardCommand('tokenHighlightShortcut', { win: 'Ctrl-I', mac: 'Command-I' }, keyShortcutExec);
        self.aceEditor.on('dblclick', self.ondblclick.bind(self));
    }

    highlightTokens() {
        const self = this;

        self.busy = true;

        const session = self.aceEditor.session;
        const docLength = session.getLength();
        const manPageTokens = self.tokens;
        let row = 1;
        let tokenStart = 0;

        self.markers.forEach(marker => {
            session.removeMarker(marker);
        });
        self.markers = [];

        const searchAndHighlight = token => {
            if (self.supportedTypes[token.type]) {
                manPageTokens.get(token.value, (results) => {
                    let i = 0;
                    if (results.length && results[i].name === token.value) {
                        let result = results[i];
                        while (result && result.section !== 2 && result.section !== 3) {
                            result = results[++i];
                        }
                        if (result) {
                            self.tokenStore[token.value] = result;
                            const range = new Range(row, tokenStart, row, tokenStart + token.value.length);
                            self.markers.push(session.addMarker(range, 'token-highlight', 'text'));
                        }
                    }
                });
            }
            tokenStart += token.value.length;
        };

        for (row = 1; row <= docLength; row++) {
            const tokens = session.getTokens(row);
            tokenStart = 0;
            tokens.forEach(searchAndHighlight);
        }
        self.busy = false;
    }

    ondblclick(e) {
        const aceEditor = e.editor;
        const r = aceEditor.renderer;
        const canvasPos = r.rect || (r.rect = r.scroller.getBoundingClientRect());
        const offset = (e.clientX + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
        const row = Math.floor((e.clientY + r.scrollTop - canvasPos.top) / r.lineHeight);
        const column = Math.round(offset);
        const screenPos = { row: row, column: column, side: offset - column > 0 ? 1 : -1 };
        const token = aceEditor.session.getTokenAt(screenPos.row, screenPos.column);
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
