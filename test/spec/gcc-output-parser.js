/* global describe, it */

(function (GccOutputParser) {
    'use strict';

    describe('GccOutputParser', function () {
        var parser = new GccOutputParser();

        // no errors
        describe('when given an empty string', function () {
            var results = parser.parse("");
            it('should return no information', function () {
                assert.typeOf(results, 'Array');
                assert.lengthOf(results, 0);
            });
        });

        // compiler error
        describe('when given a compiler error string', function () {
            var compilerOutput = "program.c: In function ‘main’:\n" +
                "program.c:6:2: error: expected ‘;’ before ‘return’\n" +
                "  return 0;\n  ^";
            var results = parser.parse(compilerOutput);
            it('should return the correct error information', function () {
                assert.lengthOf(results, 1); // one error
                var error = results[0];
                assert.propertyVal(error, 'column', '2');
                assert.propertyVal(error, 'gccErrorType', 'error');
                assert.propertyVal(error, 'row', '6');
                assert.propertyVal(error, 'text', "expected ‘;’ before ‘return’");
                assert.propertyVal(error, 'type', 'compile');
            });
        });

        // linker error
        describe('when given a linker error string', function () {
            var compilerOutput = "libcygwin.a(libcmain.o): In function `main':\n" +
               "libcmain.c:39: undefined reference to `WinMain'\n" +
               "collect2: error: ld returned 1 exit status";
            var results = parser.parse(compilerOutput);
            it('shouold return the correct error information', function () {
                assert.typeOf(results, 'Array');
                assert.lengthOf(results, 1); // one error
                var error = results[0];
                assert.propertyVal(error, 'column', 0);
                assert.propertyVal(error, 'gccErrorType', 'error');
                assert.propertyVal(error, 'row', 0);
                assert.propertyVal(error, 'text', "ld returned 1 exit status");
                assert.propertyVal(error, 'type', 'linker');
            });
        });
    });
})(window.GccOutputParser);
