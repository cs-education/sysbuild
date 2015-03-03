window.ExpectTTY = (function () {
    'use strict';

    function ExpectTTY(runtime, expectstring, callbackFn) {
        this.output = '';
        this.callback = callbackFn;
        this.expect = expectstring;
        this.sys = runtime;
        this.found = false;
        this.expectPutCharListener = function (sys, e) {
            this.output = this.output.substr(this.output.length === this.expect.length ? 1 : 0) + e.detail.character;
            if (this.output === this.expect) {
                this._cleanup();
                this.callback(true);
            }
        }.bind(this);

        this.sys.addListener('putchar', this.expectPutCharListener);
    }

    ExpectTTY.prototype._cleanup = function () {
        this.sys.removeListener('putchar', this.expectPutCharListener);
    };

    ExpectTTY.prototype.cancel = function () {
        this._cleanup();
        this.callback(false);
    };

    return ExpectTTY;
})();
