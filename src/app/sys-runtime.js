import ExpectTTY from 'app/expect-tty';
import GccOutputParser from 'app/gcc-output-parser';
import * as Jor1k from 'cjs!jor1k/master/master';
import LinuxTerm from 'cjs!jor1k/plugins/terminal-linux';
import { jor1kBaseFsUrl, jor1kWorkerUrl } from 'app/config';
import SysFileSystem from 'app/sys-filesystem';

// Encapsulates the virtual machine interface
class SysRuntime {
    constructor() {
        this.bootFinished = false;
        this.tty0ready = false;
        this.tty1ready = false;

        this.listeners = {};
        this.ttyOutput = '';
        this.captureOutput = false;
        this.compileTicket = 0;

        this.gccOutputCaptureRe = /###GCC_COMPILE###\s*([\S\s]*?)\s*###GCC_COMPILE_FINISHED###/;
        this.gccExitCodeCaptureRe = /GCC_EXIT_CODE: (\d+)/;

        // Set up callbacks
        this.putCharTTY0Listener = (character) => {
            // capture output from tty0
            if (this.captureOutput) {
                this.ttyOutput += character;
            }
            this.notifyListeners('putchar-tty0', character);
        };

        this.putCharTTY1Listener = (character) => {
            this.notifyListeners('putchar-tty1', character);
        };

        var onBootFinished = () => {
            if (this.tty0ready && this.tty1ready) {

                //Attach persistent filesystem
                SysFileSystem.initialize(this.jor1kgui.fs);

                // LiveEdit uses the bootFinished value when sent the ready event,
                // so bootFinished must be updated before broadcasting the event
                this.bootFinished = true;
                this.notifyListeners('ready', true);
            }
        };

        var onTTY0Ready = (completed) => {
            this.tty0ready = completed;
            onBootFinished(); // either tty0 or tty1 can be ready last, so both must call onBootFinished
        };

        var onTTY1Ready = (completed) => {
            this.tty1ready = completed;
            onBootFinished(); // either tty0 or tty1 can be ready last, so both must call onBootFinished
        };

        var onTTY1RootLogin = (completed) => {
            if (completed) {
                this.sendKeys('tty1', 'login -f user\n', '~ $', onTTY1Ready); // login as user
            }
        };

        var onTTY0Login = (completed) => {
            if (completed) {
                this.sendKeys('tty0', 'stty -clocal crtscts -ixoff\necho boot2ready-$?\n', 'boot2ready-0', onTTY0Ready);
            }
        };

        var onTTY1Login = (completed) => {
            if (completed) {
                this.sendKeys('tty1', 'head -c1 /dev/urandom\nstty -clocal crtscts -ixoff\necho boot2ready-$?\n', 'boot2ready-0', onTTY1RootLogin);
            }
        };

        var termTTY0 = new LinuxTerm('tty0');
        var termTTY1 = new LinuxTerm('tty1');

        var jor1kparameters = {
            system: {
                kernelURL: 'vmlinux.bin.bz2', // kernel image
                memorysize: 32, // in MB, must be a power of two
                cpu: 'asm', // short name for the cpu to use
                ncores: 1
            },
            fs: {
                basefsURL: 'basefs-compile.json', // json file with the basic filesystem configuration.
                // json file with extended filesystem informations. Loaded after the basic filesystem has been loaded.
                extendedfsURL: '../fs.json',
                earlyload: [
                    'usr/bin/gcc',
                    'usr/libexec/gcc/or1k-linux-musl/4.9.0/cc1',
                    'usr/libexec/gcc/or1k-linux-musl/4.9.0/collect2',
                    'usr/lib/libbfd-2.24.51.20140817.so',
                    'usr/lib/gcc/or1k-linux-musl/4.9.0/libgcc.a',
                    'usr/bin/as',
                    'usr/include/stdio.h'
                ], // list of files which should be loaded immediately after they appear in the filesystem
                lazyloadimages: [
                ] // list of automatically loaded images after the basic filesystem has been loaded
            },
            terms: [termTTY0, termTTY1],   // canvas ids for the terminals
            statsid: 'vm-stats',  // element id for displaying VM statistics
            memorysize: 32, // in MB, must be a power of two
            path: jor1kBaseFsUrl, // kernelURL and fsURLs are relative to this path
            worker: new Worker(jor1kWorkerUrl),
			relayURL: 'wss://relay.widgetry.org/'
        };

        this.jor1kgui = new Jor1k(jor1kparameters);

        termTTY0.SetCharReceiveListener(this.putCharTTY0Listener);
        termTTY1.SetCharReceiveListener(this.putCharTTY1Listener);

        // Wait for terminal prompts
        this.sendKeys('tty0', '', '~ $', onTTY0Login);
        this.sendKeys('tty1', '', '~ #', onTTY1Login);
        return this;
    }

    ready() {
        return this.bootFinished;
    }

    focusTerm(tty) {
        this.jor1kgui.FocusTerm(tty);
    }

    startBuild(buildCmd, guiCallback) {
        if (!this.bootFinished) {
            return 0;
        }

        if (this.expecting) {
            this.expecting.cancel();
        }

        this.ttyOutput = '';
        this.captureOutput = true;
        ++this.compileTicket;

        var compileCb = (completed) => {
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

                annotations.forEach((note) => {
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

        };

        var cmd = 'echo \\#\\#\\#GCC_COMPILE\\#\\#\\#;clear;pwd;'+ buildCmd +'; echo GCC_EXIT_CODE: $?; echo \\#\\#\\#GCC_COMPILE_FINISHED\\#\\#\\#' +
            this.compileTicket + '.;clear\n';

        this.expecting = this.sendKeys('tty0', cmd, 'GCC_COMPILE_FINISHED###' + this.compileTicket + '.', compileCb);

        return this.compileTicket;
    }

    getErrorAnnotations(buildOutputStr) {
        var workingDir = buildOutputStr.substr(0, buildOutputStr.indexOf('\n'));
        if(workingDir.indexOf('/home/user') == 0)
            workingDir = workingDir.substr(10, workingDir.length);
        else
            workingDir = '';

        var errors = (new GccOutputParser()).parse(buildOutputStr);
        return errors.map((error) => {
            var aceAnnotationType;

            // Determine the type of editor annotation. ace supports error, warning or info.
            if (error.buildErrorType.toLowerCase().indexOf('error') !== -1) {
                aceAnnotationType = 'error';
            } else if (error.buildErrorType.toLowerCase().indexOf('warning') !== -1) {
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
                workingDir: workingDir,
                row: error.row - 1,
                col: error.col,
                isBuildCmdError: (error.type === 'gcc') || (error.type == 'make'),
                type: aceAnnotationType,
                text: error.text,
                file: error.file
            };
        });
    }

    sendExecCmd(cmd) {
        if (!cmd) {
            return;
        }
        if (cmd[0] !== '/' && cmd[0] !== '.') {
            cmd = './' + cmd.replace(' ', '\\ ');
        }
        cmd = cmd.replace('\\', '\\\\').replace('\n', '\\n');
        // Don't \x03 ; it interrupts the clear command
        this.sendKeys('tty0', '\n' + cmd + '\n');
    }

    // Used to broadcast 'putchar' and 'ready' events
    addListener(eventname, fn) {
        var ary = this.listeners[eventname];
        if (ary) {
            ary.push(fn);
        } else {
            this.listeners[eventname] = [fn];
        }
    }

    removeListener(eventname, fn) {
        var ary = this.listeners[eventname];
        this.listeners[eventname] = ary.filter((el) => {
            return el !== fn;
        });
    }

    notifyListeners(eventname, data) {
        var ary = this.listeners[eventname];
        if (!ary) {
            return;
        }
        ary = ary.slice(); // Listeners may be added/removed during this event, so make a copy first
        for (var i = 0; ary && i < ary.length; i++) {
            ary[i](this, data);
        }
    }

    sendKeys(tty, text, expect, success, cancel) {
        var expectResult = null;
        var data = text.split('').map((c) => {
            /* jshint bitwise: false */
            return c.charCodeAt(0) >>> 0;
        });
        this.jor1kgui.Pause(false);
        if (expect) {
            expectResult = new ExpectTTY(this, tty, expect, success, cancel);
        }
        this.jor1kgui.message.Send(tty, data);
        return expectResult;
    }
}

// SysRuntime is meant to be used as a singleton
export default (new SysRuntime());
