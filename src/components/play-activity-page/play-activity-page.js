import ko from 'knockout';
import templateMarkup from 'text!./play-activity-page.html';
import Preferences from 'app/preferences';

class PlayActivityPage {
    constructor(params) {
        this.activityData = params.activityData;
        this.setEditorParams();
        this.setCompilerParams();
        this.setVmParams();
        if (this.activityData) {
            this.setParamsFromActivity(this.activityData.activity);
        } else {
            this.setDefaultPlaygroundParams();
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

    setDefaultPlaygroundParams() {
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
        var editorAnnotations = ko.observableArray([]); // TODO: Wire this with the VM/Runtime

        var editorPrefs = Preferences.getPreferenceManager('editor');

        var autoIndent = ko.observable(editorPrefs.getItem('autoindent', 'true'));
        autoIndent.subscribe((newSetting) => editorPrefs.setItem('autoindent', newSetting));

        var highlightLine = ko.observable(editorPrefs.getItem('highlightline', 'true'));
        highlightLine.subscribe((newSetting) => editorPrefs.setItem('highlightline', newSetting));

        var showInvisibles = ko.observable(editorPrefs.getItem('showinvisibles', 'false'));
        showInvisibles.subscribe((newSetting) => editorPrefs.setItem('showinvisibles', newSetting));

        var theme = ko.observable(editorPrefs.getItem('theme', 'monokai'));
        theme.subscribe((newSetting) => editorPrefs.setItem('theme', newSetting));

        var fontSize = ko.observable(editorPrefs.getItem('fontsize', 12));
        fontSize.subscribe((newSetting) => editorPrefs.setItem('fontsize', newSetting));

        this.editorParams = {
            annotations: editorAnnotations,
            autoIndent: autoIndent,
            highlightLine: highlightLine,
            showInvisibles: showInvisibles,
            theme: theme,
            fontSize: fontSize
        };
    }

    setCompilerParams() {
        // TODO: Wire these with the VM/Runtime
        var gccOptions = ko.observable('');
        var programArgs = ko.observable('');
        var compileStatus = ko.observable('Waiting');
        var lastGccOutput = ko.observable('');
        var gccOptsError =  ko.observable('');
        var gccErrorCount = ko.observable(0);
        var gccWarningCount = ko.observable(0);

        this.compilerParams = {
            gccOptions: gccOptions,
            programArgs: programArgs,
            compileStatus: compileStatus,
            lastGccOutput: lastGccOutput,
            gccOptsError: gccOptsError,
            gccErrorCount: gccErrorCount,
            gccWarningCount: gccWarningCount,
            compileBtnTooltip: ko.observable('')
        };
    }

    setVmParams() {
        // TODO: Wire this with the VM/Runtime
        var vmState = ko.observable('Booting');
        this.vmParams = {
            vmState: vmState
        }
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlayActivityPage, template: templateMarkup };
