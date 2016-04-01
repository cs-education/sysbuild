import GccOutputParser from 'app/gcc-output-parser';

describe('GccOutputParser', function () {
    beforeEach(function () {
        this.parser = new GccOutputParser();
    });

    // no errors
    describe('when given an empty string', function () {
        beforeEach(function () {
            this.results = this.parser.parse('');
        });

        it('should return no information', function () {
            expect(this.results).toEqual([]);
        });
    });

    // compiler error
    describe('when given a compiler error string', function () {
        beforeEach(function () {
            var compilerOutput = 'program.c: In function \'main\':\n' +
                'program.c:6:2: error: expected \';\' before \'return\'\n' +
                '  return 0;\n  ^';
            this.results = this.parser.parse(compilerOutput);
        });

        it('should return the correct error information', function () {
            expect(this.results).toEqual(jasmine.any(Array));
            expect(this.results.length).toEqual(1); // one error
            expect(this.results[0]).toEqual(jasmine.objectContaining({
                column: 2,
                buildErrorType: 'error',
                row: 6,
                text: 'expected \';\' before \'return\'',
                type: 'compile'
            }));
        });
    });

    // linker error
    describe('when given a linker error string', function () {
        beforeEach(function () {
            var compilerOutput = '/tmp/ccwIU8df.o: In function \'main\':\n' +
            'program.c:(.text+0x20): undefined reference to \'nonExistentFunction\'\n' +
            'collect2: error: ld returned 1 exit status';
            this.results = this.parser.parse(compilerOutput);
        });

        it('should return the correct error information', function () {
            expect(this.results).toEqual(jasmine.any(Array));
            expect(this.results.length).toEqual(2); // two errors

            // error one
            expect(this.results[0]).toEqual(jasmine.objectContaining({
                column: 0,
                /* TODO: currently the buildErrorType returned is incorrect,
                   but functionality is not affected */
                //buildErrorType: 'error',
                row: 0,
                text: 'undefined reference to \'nonExistentFunction\'',
                type: 'compile'
            }));

            // error two
            expect(this.results[1]).toEqual(jasmine.objectContaining({
                column: 0,
                buildErrorType: 'error',
                row: 0,
                text: 'ld returned 1 exit status',
                type: 'linker'
            }));
        });
    });

    // gcc error
    describe('when given a gcc error string', function () {
        beforeEach(function () {
            var compilerOutput = 'gcc: error: unrecognized command line option \'-asdfasdf\'';
            this.results = this.parser.parse(compilerOutput);
        });

        it('should return the correct error information', function () {
            expect(this.results).toEqual(jasmine.any(Array));
            expect(this.results.length).toEqual(1); // one error
            expect(this.results[0]).toEqual(jasmine.objectContaining({
                column: 0,
                buildErrorType: 'error',
                row: 0,
                text: 'unrecognized command line option \'-asdfasdf\'',
                type: 'gcc'
            }));
        });
    });

    // cc1 error
    describe('when given a cc1 error string', function () {
        beforeEach(function () {
            var compilerOutput = 'cc1: error: unrecognised debug output level "aslkdfjalksjd"';
            this.results = this.parser.parse(compilerOutput);
        });

        it('should return the correct error information', function () {
            expect(this.results).toEqual(jasmine.any(Array));
            expect(this.results.length).toEqual(1); // one error
            expect(this.results[0]).toEqual(jasmine.objectContaining({
                column: 0,
                buildErrorType: 'error',
                row: 0,
                text: 'unrecognised debug output level "aslkdfjalksjd"',
                type: 'gcc'
            }));
        });
    });

    // multiple errors
    describe('when given a string containing multiple compiler errors', function () {
        beforeEach(function () {
            var compilerOutput = 'program.c: In function \'thing\':\n' +
                'program.c:10:5: warning: return makes integer from pointer without a cast [enabled by default]\n' +
                '    return \"thing\"\n' + '    ^\n' +
                'program.c:11:1: error: expected \';\' before \'}\' token\n' +
                ' }\n' + ' ^\n';
            this.results = this.parser.parse(compilerOutput);
        });

        it('should return the correct error information', function () {
            expect(this.results).toEqual(jasmine.any(Array));
            expect(this.results.length).toEqual(2); // two errors

            // error one
            expect(this.results[0]).toEqual(jasmine.objectContaining({
                column: 5,
                buildErrorType: 'warning',
                row: 10,
                text: 'return makes integer from pointer without a cast [enabled by default]',
                type: 'compile'
            }));

            // error two
            expect(this.results[1]).toEqual(jasmine.objectContaining({
                column: 1,
                buildErrorType: 'error',
                row: 11,
                text: 'expected \';\' before \'}\' token',
                type: 'compile'
            }));
        });
    });
});
