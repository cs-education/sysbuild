import ko from 'knockout';
import templateMarkup from 'text!./play-activity-page.html';

class PlayActivityPage {
    constructor(params) {
        this.activityData = params.activityData;
        this.editorParams = {
            autoindent: ko.observable(true),
            highlightLine: ko.observable(true),
            showInvisibles: ko.observable(false),
            theme: ko.observable('monokai'),
            fontSize: ko.observable(12)
        };

        this.compilerParams = {
            gccOptsError: ko.observable(''),
            gccOptions: ko.observable(''),
            programArgs: ko.observable(''),
            compileStatus: ko.observable('Waiting'),
            compileBtnTooltip: ko.observable('')
        };

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

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlayActivityPage, template: templateMarkup };
