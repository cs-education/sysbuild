class ExpectTTY {
    constructor(runtime, tty, expectstring, callbackFn) {
        this.output = '';
        this.callback = callbackFn;
        this.putCharEventName = 'putchar-' + tty;
        this.expect = expectstring;
        this.sys = runtime;
        this.found = false;
        this.expectPutCharListener = (sys, character) => {
            this.output = this.output.substr(this.output.length === this.expect.length ? 1 : 0) + character;
            if (this.output === this.expect) {
                this.cleanup();
                this.callback(true);
            }
        };

        this.sys.addListener(this.putCharEventName, this.expectPutCharListener);
    }

    cleanup() {
        this.sys.removeListener(this.putCharEventName, this.expectPutCharListener);
    }

    cancel() {
        this.cleanup();
        this.callback(false);
    }
}

export default ExpectTTY;
