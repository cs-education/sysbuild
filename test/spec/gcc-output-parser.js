/* global describe, it */

(function () {
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
                assert.typeOf(results, 'Array');
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
            it('should return the correct error information', function () {
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

        // gcc error
        describe('when given a gcc error string', function () {
            var compilerOutput = "gcc: error: unrecognized command line option '-asdfasdf'";
            var results = parser.parse(compilerOutput);
            it('should return the correct error information', function () {
                assert.typeOf(results, 'Array');
                assert.lengthOf(results, 1); // one error
                var error = results[0];
                assert.propertyVal(error, 'column', 0);
                assert.propertyVal(error, 'gccErrorType', 'error');
                assert.propertyVal(error, 'row', 0);
                assert.propertyVal(error, 'text', "unrecognized command line option '-asdfasdf'");
                assert.propertyVal(error, 'type', 'gcc');
            });
        });

        // cc1 error
        describe('when given a cc1 error string', function () {
            var compilerOutput = "cc1: error: unrecognised debug output level \"aslkdfjalksjd\"";
            var results = parser.parse(compilerOutput);
            it('should return the correct error information', function () {
                assert.typeOf(results, 'Array');
                assert.lengthOf(results, 1); // one error
                var error = results[0];
                assert.propertyVal(error, 'column', 0);
                assert.propertyVal(error, 'gccErrorType', 'error');
                assert.propertyVal(error, 'row', 0);
                assert.propertyVal(error, 'text', "unrecognised debug output level \"aslkdfjalksjd\"");
                assert.propertyVal(error, 'type', 'gcc');
            });
        });

        // multiple errors
        describe('when given a string containing multiple compiler errors', function () {
            var compilerOutput = "program.c: In function 'thing':\n" +
            "program.c:10:5: warning: return makes integer from pointer without a cast [enabled by default]\n" +
            "    return \"thing\"\n" + "    ^\n" +
            "program.c:11:1: error: expected ';' before '}' token\n" +
            " }\n" + " ^\n";
            var results = parser.parse(compilerOutput);
            it('should return the correct error information', function () {
                assert.typeOf(results, 'Array');
                assert.lengthOf(results, 2); // two errors

                // error one
                var error = results[0];
                assert.propertyVal(error, 'column', '5');
                assert.propertyVal(error, 'gccErrorType', 'warning');
                assert.propertyVal(error, 'row', '10');
                assert.propertyVal(error, 'text', "return makes integer from pointer without a cast [enabled by default]");
                assert.propertyVal(error, 'type', 'compile');

                // error two
                var error = results[1];
                assert.propertyVal(error, 'column', '1');
                assert.propertyVal(error, 'gccErrorType', 'error');
                assert.propertyVal(error, 'row', '11');
                assert.propertyVal(error, 'text', "expected ';' before '}' token");
                assert.propertyVal(error, 'type', 'compile');
            });
        });
    });
})();
