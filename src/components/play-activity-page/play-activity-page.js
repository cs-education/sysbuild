import ko from 'knockout';
import templateMarkup from 'text!./play-activity-page.html';
import Preferences from 'app/preferences';
import * as SysGlobalObservables from 'app/sys-global-observables';

class PlayActivityPage {
    constructor(params) {
        this.activityData = params.activityData;
        this.setEditorParams();
        this.setCompilerParams();
        this.setVmParams();
        this.setupCompileCallbacks();
        if (this.activityData) {
            this.setParamsFromActivity(this.activityData.activity);
        } else {
            this.setParamsFromDefaults();
        }
    }

    setParamsFromActivity(playActivity) {
        this.editorParams.initialEditorText = playActivity.code;
        this.compilerParams.gccOptions(playActivity.gccOptions || '');
        this.compilerParams.programArgs(playActivity.programCommandLineArgs || '');

        if (playActivity.docFile) {
            this.doc = {
                url: 'https://cs-education.github.io/sysassets/' + playActivity.docFile,
                format: 'markdown'
            }
        } else {
            this.doc = {
                text: playActivity.doc || '',
                format: 'markdown'
            }
        }
    }

    setParamsFromDefaults() {
        this.editorParams.initialEditorText = '/*Write your C code here*/\n' +
            '#include <stdio.h>\n' +
            '\n' +
            'int main() {\n' +
            '    printf("Hello world!\\n");\n' +
            '    return 0;\n' +
            '}\n' +
            '';

        this.compilerParams.gccOptions('-lm -Wall -fmax-errors=10 -Wextra');
        this.compilerParams.programArgs('');

        this.doc = {
            text: '# Welcome\n' +
                'Welcome to this tiny but fast linux virtual machine. ' +
                'Write C code on the left and press the run button, or simply have fun with the linux command line below! Some things to try:\n' +
                '* Play battleship (type `bs` then enter), Solitaire (type `blue` then enter) or the famous Tower of Hanoi game (type `hanoi` then enter) in the terminal\n' +
                '* Destroy the system! Type `su`, press enter then type `rm -rf /` and watch the chaos! (Don\'t worry, it\'s safe. Simply refresh the page to start over)\n' +
                '\nOnce you are done playing, learn C and system programming! Go to the lessons page by clicking the link in the top navigation bar.',
            format: 'markdown'
        }
    }

    setEditorParams() {
        var editorPrefs = Preferences.getPreferenceManager('editor');

        var autoIndent = ko.observable(editorPrefs.getItem('autoindent', 'true') === 'true');
        autoIndent.subscribe((newSetting) => editorPrefs.setItem('autoindent', newSetting));

        var highlightLine = ko.observable(editorPrefs.getItem('highlightline', 'true') === 'true');
        highlightLine.subscribe((newSetting) => editorPrefs.setItem('highlightline', newSetting));

        var showInvisibles = ko.observable(editorPrefs.getItem('showinvisibles', 'false') === 'true');
        showInvisibles.subscribe((newSetting) => editorPrefs.setItem('showinvisibles', newSetting));

        var theme = ko.observable(editorPrefs.getItem('theme', 'monokai'));
        theme.subscribe((newSetting) => editorPrefs.setItem('theme', newSetting));

        var fontSize = ko.observable(editorPrefs.getItem('fontsize', 12));
        fontSize.subscribe((newSetting) => editorPrefs.setItem('fontsize', newSetting));

        this.editorParams = {
            annotations: SysGlobalObservables.editorAnnotations,
            autoIndent: autoIndent,
            highlightLine: highlightLine,
            showInvisibles: showInvisibles,
            theme: theme,
            fontSize: fontSize,
            keyboardShortcuts: []
        };
    }

    setCompilerParams() {
        this.compilerParams = {
            gccOptions: SysGlobalObservables.gccOptions,
            programArgs: SysGlobalObservables.programArgs,
            compileStatus: SysGlobalObservables.compileStatus,
            lastGccOutput: SysGlobalObservables.lastGccOutput,
            gccOptsError: SysGlobalObservables.gccOptsError,
            gccErrorCount: SysGlobalObservables.gccErrorCount,
            gccWarningCount: SysGlobalObservables.gccWarningCount
        };
    }

    setupCompileCallbacks() {
        var compileShortcut = {
            win: 'Ctrl-Return',
            mac: 'Command-Return'
        };

        var platform = (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase(); // from ace editor
        var shortcut = platform === 'mac' ? compileShortcut.mac.replace('Command', '\u2318') : compileShortcut.win;
        this.compilerParams.compileBtnTooltip = `Compile and Run (${shortcut} in code editor)`;

        // the editor will set the value of this observable to a function which returns the editor text
        this.editorParams.editorTextGetter = ko.observable(() => '');

        var compile = () => {
            var code = (this.editorParams.editorTextGetter())();
            var gccOptions = this.compilerParams.gccOptions();
            (SysGlobalObservables.runCode())(code, gccOptions);
        };

        this.compilerParams.compileCallback = compile;

        this.editorParams.keyboardShortcuts.push([
            'compileAndRunShortcut',
            compileShortcut,
            compile,
            true // the compile command should work in readOnly mode
        ]);
    }

    setVmParams() {
        this.vmParams = {
            vmState: SysGlobalObservables.vmState
        }
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlayActivityPage, template: templateMarkup };
