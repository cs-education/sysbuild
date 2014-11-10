/* global describe, it */

(function (GccOutputParser) {
    'use strict';

    describe('GccOutputParser', function () {
        var parser = new GccOutputParser();

        describe('when given an empty string', function(){
            var results = parser.parse("");
            it('should return no information', function(){
                assert.lengthOf(results, 0);
            });
        });
    });
})(window.GccOutputParser);
