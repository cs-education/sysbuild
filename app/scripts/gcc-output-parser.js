window.GccOutputParser = (function () {
    'use strict';

    var gccOutputParseRe = /(.+?):\s*(.+)\s*:\s*(.+)\s*/;
    var gccRowColTypeParseRe = /(\d+):(\d+):\s*(.+)/;
    var gccOutputTypeTextSplitRe = /\s*(.+)\s*:\s*(.+)\s*/;
    var errorTypeMap = {
        'program.c': 'compile',
        'gcc': 'gcc',
        'cc1': 'gcc',
        'collect2': 'linker'
    };

    function GccOutputParser() {
    }

    GccOutputParser.prototype.parse = function (gccOutputStr) {
        var match, lineColTypeMatch, typeTextSplitMatch, row, col, gccErrorType, text, errors = [];

        gccOutputStr.split('\n').forEach(function (errorLine) {
            match = gccOutputParseRe.exec(errorLine);

            if (match) {
                lineColTypeMatch = gccRowColTypeParseRe.exec(match[2]);

                if (lineColTypeMatch) {
                    row = lineColTypeMatch[1];
                    col = lineColTypeMatch[2];
                    typeTextSplitMatch = gccOutputTypeTextSplitRe.exec(lineColTypeMatch[3]);
                    if (typeTextSplitMatch) {
                        gccErrorType = typeTextSplitMatch[1];
                        text = typeTextSplitMatch[2] + ': ' + match[3];
                    } else {
                        gccErrorType = lineColTypeMatch[3];
                        text = match[3];
                    }
                } else {
                    // some gcc output without line info
                    row = col = 0;
                    typeTextSplitMatch = gccOutputTypeTextSplitRe.exec(match[2]);
                    if (typeTextSplitMatch) {
                        gccErrorType = typeTextSplitMatch[1];
                        text = typeTextSplitMatch[2] + ': ' + match[3];
                    } else {
                        gccErrorType = match[2];
                        text = match[3];
                    }
                }

                errors.push({
                    row: row,
                    column: col,
                    type: errorTypeMap[match[1]],
                    gccErrorType: gccErrorType,
                    text: text
                });
            }
        });

        return errors;
    };

    return GccOutputParser;
})();
