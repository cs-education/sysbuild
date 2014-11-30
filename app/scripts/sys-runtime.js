/* global Jor1kGUI, ExpectTTY, GccOutputParser */

// A singleton that encapsulates the virtual machine interface
window.SysRuntime = (function () {
    'use strict';

    function SysRuntime() {

        this.bootFinished = false;
        this.listeners = {};
        this.ttyState = this.BOOT;
        this.ttyOutput = '';
        this.captureOutput = false;
        this.compileTicket = 0;

        this.gccOutputCaptureRe = /###GCC_COMPILE###\s*([\S\s]*?)\s*###GCC_COMPILE_FINISHED###/;
        this.gccExitCodeCaptureRe = /GCC_EXIT_CODE: (\d+)/;

        // Set up callbacks
        this.putCharListener = function (e) {
            if (this.captureOutput) {
                this.ttyOutput += e.detail.character;
            }
            this.notifyListeners('putchar', e);
        }.bind(this);

        var onBootFinished = function (completed) {
            if (completed && this.bootFinished) {
                this.notifyListeners('ready', true);
            }
            this.bootFinished = completed;
        }.bind(this);

        var onTTYLogin1 = function (completed) {
            if (completed) {
                this.sendKeys('tty0', 'stty -clocal crtscts -ixoff\necho boot2ready-$?\n', 'boot2ready-0', onBootFinished);
            }
        }.bind(this);

        var onTTYLogin2 = function (completed) {
            if (completed) {
                this.sendKeys('tty1', 'stty -clocal crtscts -ixoff\necho boot2ready-$?\n', 'boot2ready-0', onBootFinished);
            }
        }.bind(this);

        // Wait for tty to be ready
        document.addEventListener('jor1k_terminal_put_char', this.putCharListener, false);

        this.jor1kgui = new Jor1kGUI('tty0', 'tty1', ['../../bin/vmlinux.bin.bz2', '../../../jor1k_hd_images/hdgcc-mod.bz2'], '');
        this.sendKeys('tty0', '', 'root login on \'ttyS0\'', onTTYLogin1);
        this.sendKeys('tty1', '', 'root login on \'ttyS1\'', onTTYLogin2);
        return this;
    }

    SysRuntime.prototype.ready = function () {
        return this.bootFinished;
    };

    SysRuntime.prototype.startGccCompile = function (code, gccOptions, guiCallback) {
        if (!this.bootFinished) {
            return 0;
        }

        if (this.expecting) {
            this.expecting.cancel();
        }

        this.ttyOutput = '';
        this.captureOutput = true;
        ++this.compileTicket;

        var compileCb = function (completed) {
            var result = null;
            this.expecting = undefined;
            if (completed) {
                this.captureOutput = false;
                var regexMatchArray = this.gccOutputCaptureRe.exec(this.ttyOutput);
                var gccOutput = regexMatchArray[1];
                var gccExitCode = parseInt(this.gccExitCodeCaptureRe.exec(gccOutput)[1]);
                this.ttyOutput = '';

                var stats = {
                    error: 0,
                    warning: 0,
                    info: 0
                };

                var annotations = this.getErrorAnnotations(gccOutput);

                annotations.forEach(function (note) {
                    stats[note.type] += 1;
                });

                result = {
                    exitCode: gccExitCode,
                    stats: stats,
                    annotations: annotations,
                    gccOutput: gccOutput
                };
            }

            guiCallback(result);

        }.bind(this);

        this.sendKeys('tty0', '\x03\ncd ~;rm program.c program 2>/dev/null\n');

        this.sendTextFile('program.c', code);

        var cmd = 'echo \\#\\#\\#GCC_COMPILE\\#\\#\\#;clear;gcc ' + gccOptions +
            ' program.c -o program; echo GCC_EXIT_CODE: $?; echo \\#\\#\\#GCC_COMPILE_FINISHED\\#\\#\\#' +
            this.compileTicket + '.;clear\n';

        this.expecting = this.sendKeys('tty0', cmd, 'GCC_COMPILE_FINISHED###' + this.compileTicket + '.', compileCb);

        return this.compileTicket;
    };

    SysRuntime.prototype.getErrorAnnotations = function (gccOutputStr) {
        var errors = (new GccOutputParser()).parse(gccOutputStr);
        return errors.map(function (error) {
            var aceAnnotationType;

            // Determine the type of editor annotation. ace supports error, warning or info.
            if (error.gccErrorType.toLowerCase().indexOf('error') !== -1) {
                aceAnnotationType = 'error';
            } else if (error.gccErrorType.toLowerCase().indexOf('warning') !== -1) {
                aceAnnotationType = 'warning';
            } else {
                aceAnnotationType = 'info';
            }

            if (typeof error.type === 'undefined') {
                // if the errors are not in program.c, invalidate the row and column so that
                // the editor does not place an annotation
                error.row = error.col = -1;
            }

            return {
                // line numbers in ace start from zero
                row: error.row - 1,
                col: error.col,
                isGccOptsError: error.type === 'gcc',
                type: aceAnnotationType,
                text: error.text
            };
        });
    };

    SysRuntime.prototype.startProgram = function (filename, cmdargs) {
        if (!filename) {
            return;
        }
        if (filename[0] !== '/' && filename[0] !== '.') {
            filename= './' + filename.replace(' ', '\\ ');
        }
        cmdargs = cmdargs.replace('\\', '\\\\').replace('\n','\\n');
        // Don't \x03 ; it interrupts the clear command
        this.sendKeys('tty0', '\n' + filename + ' ' + cmdargs + '\n');
    };

    SysRuntime.prototype.sendTextFile = function(filename, contents) {
        this.sendKeys('tty0', '\nstty raw\ndd ibs=1 of=' + filename + ' count=' + contents.length + '\n'+ contents + '\nstty -raw\n');
    };

    // Used to broadcast 'putchar' and 'ready' events
    SysRuntime.prototype.addListener = function (eventname, fn) {
        var ary = this.listeners[eventname];
        if (ary) {
            ary.push(fn);
        } else {
            this.listeners[eventname] = [fn];
        }
    };

    SysRuntime.prototype.removeListener = function (eventname, fn) {
        var ary = this.listeners[eventname];
        this.listeners[eventname] = ary.filter(function (el) {
            return el !== fn;
        });
    };

    SysRuntime.prototype.notifyListeners = function (eventname, data) {
        var ary = this.listeners[eventname];
        if(!ary) {
            return;
        }
        ary = ary.slice(); // Listeners may be added/removed during this event, so make a copy first
        for(var i = 0; ary && i < ary.length; i++) {
            ary[i](this, data);
        }
    };

    SysRuntime.prototype.sendKeys = function (tty, text, expect, success, cancel) {
        /* jshint bitwise: false */
        var expectResult = null;
        this.jor1kgui.pause(false);

        if(expect) {
            expectResult = new ExpectTTY(this, expect, success, cancel);
        }

        for(var i = 0; i < text.length; i++) {
            this.jor1kgui.sendToWorker(tty, text.charCodeAt(i) >>>0);
        }

        return expectResult;
    };

    var instance;
    return {
        getInstance: function () {
            // http://stackoverflow.com/a/4842961
            if (!instance) {
                instance = new SysRuntime();
                // hide the constructor so the returned object cannot be
                // used to create more instances
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
