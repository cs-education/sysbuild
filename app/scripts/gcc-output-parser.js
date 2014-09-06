window.GccOutputParser = (function () {
    'use strict';

    var gccOutputParseRe = /(?:program\.c|gcc|collect2):\s*(.+)\s*:\s*(.+)\s*/;
    var gccRowColTypeParseRe = /(\d+):(\d+):\s*(.+)/;
    var gccOutputTypeTextSplitRe = /\s*(.+)\s*:\s*(.+)\s*/;


    function GccOutputParser() {
    }

    GccOutputParser.prototype.parse = function (gccOutputStr) {
        var match, lineColTypeMatch, typeTextSplitMatch, row, col, gccErrorType, aceAnnotationType, text, errors = [];

        gccOutputStr.split('\n').forEach(function (errorLine) {
            match = gccOutputParseRe.exec(errorLine);

            if (match) {
                lineColTypeMatch = gccRowColTypeParseRe.exec(match[1]);

                if (lineColTypeMatch) {
                    // line numbers in ace start from zero
                    row = lineColTypeMatch[1] - 1;
                    col = lineColTypeMatch[2];
                    typeTextSplitMatch = gccOutputTypeTextSplitRe.exec(lineColTypeMatch[3]);
                    if (typeTextSplitMatch) {
                        gccErrorType = typeTextSplitMatch[1];
                        text = typeTextSplitMatch[2] + ': ' + match[2];
                    } else {
                        gccErrorType = lineColTypeMatch[3];
                        text = match[2];
                    }
                } else {
                    // some gcc output without line info
                    row = col = 0;
                    typeTextSplitMatch = gccOutputTypeTextSplitRe.exec(match[1]);
                    if (typeTextSplitMatch) {
                        gccErrorType = typeTextSplitMatch[1];
                        text = typeTextSplitMatch[2] + ': ' + match[2];
                    } else {
                        gccErrorType = match[1];
                        text = match[2];
                    }
                }

                // Determine the type of editor annotation. ace supports error, warning or info.
                // This annotation type is also used to determine success of the compilation process.
                if (gccErrorType.toLowerCase().indexOf('error') !== -1) {
                    aceAnnotationType = 'error';
                } else if (gccErrorType.toLowerCase().indexOf('warning') !== -1) {
                    aceAnnotationType = 'warning';
                } else {
                    aceAnnotationType = 'info';
                }

                errors.push({
                    row: row,
                    column: col,
                    type: aceAnnotationType,
                    text: text
                });
            }
        });

        return errors;
    };

    return GccOutputParser;
})();
