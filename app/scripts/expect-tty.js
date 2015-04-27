window.ExpectTTY = (function () {
    'use strict';

    function ExpectTTY(runtime, tty, expectstring, callbackFn) {
        this.output = '';
        this.callback = callbackFn;
        this.putCharEventName = 'putchar-' + tty;
        this.expect = expectstring;
        this.sys = runtime;
        this.found = false;
        this.expectPutCharListener = function (sys, character) {
            this.output = this.output.substr(this.output.length === this.expect.length ? 1 : 0) + character;
            if (this.output === this.expect) {
                this._cleanup();
                this.callback(true);
            }
        }.bind(this);

        this.sys.addListener(this.putCharEventName, this.expectPutCharListener);
    }

    ExpectTTY.prototype._cleanup = function () {
        this.sys.removeListener(this.putCharEventName, this.expectPutCharListener);
    };

    ExpectTTY.prototype.cancel = function () {
        this._cleanup();
        this.callback(false);
    };

    return ExpectTTY;
})();
