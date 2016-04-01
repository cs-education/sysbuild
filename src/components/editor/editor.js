/*global Bloodhound:false, saveAs:false*/
import ko from 'knockout';
import templateMarkup from 'text!./editor.html';
import ace from 'ace/ace';
import 'bloodhound';
import TokenHighlighter from 'components/editor/token-highlighter';
import 'Blob';
import 'FileSaver';
import * as SysGlobalObservables from 'app/sys-global-observables';

class Editor {
    constructor(params) {
        // all the preferences are ko observables
        var prefs = {};
        prefs.backgroundAutoIndent = params.autoIndent;
        prefs.highlightLine = params.highlightLine;
        prefs.showInvisibles = params.showInvisibles;
        prefs.theme = params.theme;
        prefs.fontSize = params.fontSize;
        this.prefs = prefs;

        this.currentFileName = SysGlobalObservables.currentFileName;

        this.availableThemes = ko.observableArray(['monokai', 'terminal', 'tomorrow', 'xcode']);

        this.annotations = params.annotations;
        this.keyboardShortcuts = params.keyboardShortcuts;

        this.editorId = 0;
        this.elementIdPrefix = 'editor' + this.editorId + '-';

        this.initAce('code');
        this.initSettingsDialog();

        this.openManPage = params.openManPage;
        this.initTokenHighlighting();

        this.setAceText(params.initialEditorText);

        // Prevent page navigation when hitting enter/return inside the font size box
        $('#editor-opts-container').find('form').submit((e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        $('#download-file-btn').click(() => {
            var text = this.getText();
            var blob = new Blob([text]);
            saveAs(blob, SysGlobalObservables.currentFileName());
        });

        $('#autoindent-code-btn').click(() => {
            this.autoIndentCode();
        });

        this.resize();
        $(window).resize(this.resize.bind(this));

        params.editorTextGetter(this.getText.bind(this));

        SysGlobalObservables.Editor = this;
    }

    initAce(editorDivId) {
        this.editorDivId = editorDivId;
        this.aceEditor = ace.edit(editorDivId);

        // Fix for the following Ace warning:
        // "Automatically scrolling cursor into view after selection change this will be disabled
        // in the next version set editor.$blockScrolling = Infinity to disable this message"
        this.aceEditor.$blockScrolling = Infinity;

        this.setAceMode('c_cpp');
        this.aceEditor.getSession().setTabSize(4);
        this.aceEditor.getSession().setUseSoftTabs(false);

        this.setAceTheme(this.prefs.theme());
        this.prefs.theme.subscribe((newTheme) => { this.setAceTheme(newTheme); });

        this.setAceFontSize(this.prefs.fontSize() + 'px');
        this.prefs.fontSize.subscribe((newFontSize) => { this.setAceFontSize(newFontSize + 'px'); });

        this.setAceHighlightActiveLine(this.prefs.highlightLine());
        this.prefs.highlightLine.subscribe((newVal) => { this.setAceHighlightActiveLine(newVal); });

        this.setAceShowInvisbles(this.prefs.showInvisibles());
        this.prefs.showInvisibles.subscribe((newVal) => { this.setAceShowInvisbles(newVal); });

        this.setAceAnnotations(this.annotations());
        this.annotations.subscribe((newVal) => { this.setAceAnnotations(newVal); });

        this.keyboardShortcuts.forEach((shortcutArgs) => this.addKeyboardCommand(...shortcutArgs));

        
        //TODO Disabling auto indenting until it can be fixed (removes annotations and indents non C files)
        //this.enableAutoIndentTimer();
    }

    initSettingsDialog() {
        var $editorSettingsPopover = $('<div>').append(
            $('<form>').append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: this.elementIdPrefix + 'autoindent-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Autoindent code')
                    )
                )
            ).append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: this.elementIdPrefix + 'ace-highlight-active-lines-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Highlight Active Line')
                    )
                )
            ).append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: this.elementIdPrefix + 'ace-show-invisibles-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Show invisible characters')
                    )
                )
            )
        );

        // https://stackoverflow.com/a/12128784/2193410 (Contain form within a bootstrap popover?)
        var $settingsPopover = $('#editor-settings-btn');
        $settingsPopover.popover({
            title: function () {
                return 'Editor settings';
            },
            content: function () {
                return $editorSettingsPopover.html();
            }
        });

        // Should use KnockoutJS for the following bindings but event binding in popovers is tricky,
        // since the popover content is static.
        $settingsPopover.on('shown.bs.popover', () => {
            $('#' + this.elementIdPrefix + 'autoindent-checkbox').prop('checked', this.prefs.backgroundAutoIndent());
            $('#' + this.elementIdPrefix + 'ace-highlight-active-lines-checkbox').prop('checked', this.prefs.highlightLine());
            $('#' + this.elementIdPrefix + 'ace-show-invisibles-checkbox').prop('checked', this.prefs.showInvisibles());
        });

        // https://stackoverflow.com/a/22050564/2193410 (Attach event handler to button in twitter bootstrap popover)
        var $body = $('body');
        $body.on('change', '#' + this.elementIdPrefix + 'autoindent-checkbox', (e) => {
            this.prefs.backgroundAutoIndent(e.currentTarget.checked);
        });

        $body.on('change', '#' + this.elementIdPrefix + 'ace-highlight-active-lines-checkbox', (e) => {
            this.prefs.highlightLine(e.currentTarget.checked);
        });

        $body.on('change', '#' + this.elementIdPrefix + 'ace-show-invisibles-checkbox', (e) => {
            this.prefs.showInvisibles(e.currentTarget.checked);
        });

        // The following three click handlers achieve toggling the settings popover when clicking the settings button
        // and hiding it when clicking anywhere outside it.
        $body.on('click', () => {
            $settingsPopover.popover('hide');
        });

        // TODO: The .popover selector will select all popovers,
        // and so a click on any popover in the body with trigger !== 'focus' will call this handler.
        // This works for now, but may create problems in the future.
        $body.on('click', '.popover', (e) => {
            e.stopPropagation();
        });

        $settingsPopover.on('click', (e) => {
            $settingsPopover.popover('toggle');
            e.stopPropagation();
            e.preventDefault();
        });
    }

    initTokenHighlighting() {
        var manPageTokens = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 10,
            prefetch: {
                url: 'https://cs-education.github.io/sysassets/man_pages/sys_man_page_index.min.json'
            }
        });
        manPageTokens.initialize();
        this.tokenHighlighter = new TokenHighlighter(this, manPageTokens, this.openManPage);
    }

    enableAutoIndentTimer(){
        // https://github.com/angrave/javaplayland/blob/master/web/scripts/playerCodeEditor.coffee#L500
        this.aceEditor.on('change', () => {
            if (this.prefs.backgroundAutoIndent()) {
                window.clearTimeout(this.reIndentTimer);
                if (!this.reIndenting) {
                    this.reIndentTimer = window.setTimeout(this.autoIndentCode.bind(this), 500);
                }
            }
        });
    }

    disableAutoIndentTimer(){
        this.aceEditor.on('change', () => {window.clearTimeout(this.reIndentTimer);});
    }

    /**
     * @param size A valid CSS font size string, for example '12px'.
     */
    setAceFontSize(size) {
        document.getElementById(this.editorDivId).style.fontSize = size;
    }

    setAceTheme(theme) {
        this.aceEditor.setTheme('ace/theme/' + theme);
    }

    setAceMode(mode) {
        this.aceEditor.getSession().setMode('ace/mode/' + mode);
    }

    setAceText(text) {
        return this.aceEditor.getSession().setValue(text);
    }

    setAceHighlightActiveLine(val) {
        this.aceEditor.setHighlightActiveLine(val);
    }

    setAceShowInvisbles(val) {
        this.aceEditor.setShowInvisibles(val);
    }

    setAceAnnotations(annotations) {

        this.anno = annotations;

        var currFile = SysGlobalObservables.currentFileName();
        var currPath = SysGlobalObservables.currentFilePath();

        var currAnnotations = $.grep(annotations, function(e) { return e.workingDir + '/' + e.file == currPath; });

        this.aceEditor.getSession().setAnnotations(annotations);
    }
    
    getText() {
        return this.aceEditor.getSession().getValue();
    }

    setFile(path, filename, text) {
        this.disableAutoIndentTimer();

        var session = this.aceEditor.getSession();

        session.setValue(text);
        if (this.anno) {
            var currAnnotations = $.grep(this.anno, function(e) { return e.workingDir + '/' + e.file == path; });
            session.setAnnotations(currAnnotations);
        }

        this.enableAutoIndentTimer();

        return;
    }

    resize() {
        // We resize after a timeout because when the window resize handler is called,
        // the window may not have resized completely, and hence the calculation below would
        // be made with old values. The timeout helps to make sure the resize is complete before
        // reading size values.
        // TODO: remove reliance on specific div ids, and cache the jQuery selectors
        window.setTimeout(() => {
            $('#' + this.editorDivId).height(
                $('#code-container').height() -
                $('#editor-tabs-bar').height() -
                $('#editor-opts-container').height() -
                $('#compile-opts-container').height() -
                2
            );
            this.aceEditor.resize();
        }, 500);
    }

    addKeyboardCommand(cmdName, keyBindings, execFunc, readOnly) {
        // If readOnly param is not passed in, then default to true, else coerce the passed in value to boolean and use
        readOnly = (typeof readOnly === 'undefined') ? true : !!readOnly;

        // https://ace.c9.io/#nav=howto
        this.aceEditor.commands.addCommand({
            name: cmdName,
            bindKey: keyBindings,
            exec: execFunc,
            readOnly: readOnly // false if this command should not apply in readOnly mode
        });
    }

    autoIndentCode() {
        // Implementation taken from the javaplayland project
        // https://github.com/angrave/javaplayland/blob/master/web/scripts/playerCodeEditor.coffee#L618

        var currentRow,
            thisLineIndent,
            thisLine,
            currentIndent,
            editor = this.aceEditor,
            position = editor.getCursorPosition(),
            editSession = editor.getSession(),
            text = editSession.getDocument(),
            mode = editSession.getMode(),
            length = editSession.getLength();

        this.reIndenting = true;

        for (currentRow = 0; currentRow < length; currentRow++) {
            if (currentRow !== 0) {
                thisLineIndent = mode.getNextLineIndent(
                    editSession.getState(currentRow - 1),
                    editSession.getLine(currentRow - 1),
                    editSession.getTabString()
                );

                thisLine = editSession.getLine(currentRow);
                currentIndent = /^\s*/.exec(thisLine)[0];
                if (currentIndent !== thisLineIndent) {
                    thisLine = thisLineIndent + thisLine.trim();
                }

                text.insertFullLines(currentRow, [thisLine]);
                text.removeFullLines(currentRow + 1, currentRow + 1);

                mode.autoOutdent(
                    editSession.getState(currentRow),
                    editSession,
                    currentRow
                );
            }
        }

        editor.moveCursorToPosition(position);
        editor.clearSelection();

        this.reIndenting = false;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: Editor, template: templateMarkup };
