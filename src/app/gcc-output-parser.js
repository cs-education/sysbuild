const gccOutputParseRe = /(.+?):\s*(.+)\s*:\s*(.+)\s*/;
const gccRowColTypeParseRe = /(\d+):(\d+):\s*(.+)/;
const gccOutputTypeTextSplitRe = /\s*(.+)\s*:\s*(.+)\s*/;
const errorTypeMap = {
    'program.c': 'compile',
    'gcc': 'gcc',
    'cc1': 'gcc',
    'collect2': 'linker'
};

class GccOutputParser {
    constructor() {
        // empty
    }

    parse(gccOutputStr) {
        var match, lineColTypeMatch, typeTextSplitMatch, row, col, gccErrorType, text, errors = [];

        gccOutputStr.split('\n').forEach((errorLine) => {
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
    }
}

export default GccOutputParser;
