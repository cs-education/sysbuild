/* global $, ace, SysViewModel */

window.Editor = (function () {
    'use strict';

    // Counter for generating unique element Ids for an editor
    var editorInstanceCounter = 0;

    function Editor(editorDivId) {
        var self = this;
        self.editorId = editorInstanceCounter;
        editorInstanceCounter += 1;

        self.viewModel = SysViewModel.getInstance();

        self.editorDivId = editorDivId;
        self.aceEditor = ace.edit(editorDivId);
        self.setMode('c_cpp');
        self.aceEditor.getSession().setTabSize(4);
        self.aceEditor.getSession().setUseSoftTabs(true);

        // check if local storage supported
        try {
            self.useLocalStorage = (localStorage !== 'undefined');
        } catch (e) {
            // error accessing local storage (user may have blocked access)
            self.useLocalStorage = false;
        }

        if(self.useLocalStorage) {

            var autoIndent = localStorage.getItem('autoindent');
            var showInvisibles = localStorage.getItem('showinvisibles');
            var highlightLine = localStorage.getItem('highlightline');
            var theme = localStorage.getItem('theme');
            var fontSize = localStorage.getItem('fontsize');

            if(autoIndent !== null) {
                self.backgroundAutoIndent = (autoIndent === 'true');
            }

            if(showInvisibles !== null) {
                self.aceEditor.setShowInvisibles(showInvisibles === 'true');
            }

            if(highlightLine !== null) {
                self.aceEditor.setHighlightActiveLine(highlightLine === 'true');
            }

            if(theme !== null) {
                self.setTheme(theme);
                self.viewModel.aceTheme(theme);
            }

            if(fontSize !== null) {
                self.setFontSize(fontSize + 'px');
                self.viewModel.aceFontSize(fontSize);
            }

        } else {
            // web storage not supported, use default settings
            self.backgroundAutoIndent = true;
            self.setTheme(self.viewModel.aceTheme());
            self.viewModel.aceFontSize(12);
        }

        // automatically change theme upon selection
        self.viewModel.aceTheme.subscribe(function (newTheme) {
            self.setTheme(newTheme);
            if(self.useLocalStorage) {
                localStorage.setItem('theme', newTheme);
            }
        });

        self.viewModel.aceFontSize.subscribe(function (newFontSize) {
            self.setFontSize(newFontSize + 'px');
            if(self.useLocalStorage) {
                localStorage.setItem('fontsize', newFontSize);
            }
        });

        self.viewModel.editorText.subscribe(function (newText) {
            self.setText(newText);
        });

        // https://github.com/angrave/javaplayland/blob/master/web/scripts/playerCodeEditor.coffee#L500
        self.aceEditor.on('change', function () {
            if (self.backgroundAutoIndent) {
                window.clearTimeout(self.reIndentTimer);
                if (!self.reIndenting) {
                    self.reIndentTimer = window.setTimeout(self.autoIndentCode.bind(self), 500);
                }
            }
        });

        self.elementIdPrefix = 'editor' + self.editorId + '-';

        var $editorSettingsPopover = $('<div>').append(
            $('<form>').append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: self.elementIdPrefix + 'autoindent-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Autoindent code')
                    )
                )
            ).append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: self.elementIdPrefix + 'ace-highlight-active-lines-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Highlight Active Line')
                    )
                )
            ).append(
                $('<div>').attr('class', 'checkbox').append(
                    $('<label>').append(
                        $('<input>').attr({id: self.elementIdPrefix + 'ace-show-invisibles-checkbox', type: 'checkbox'})
                    ).append(
                        $('<span>').text('Show invisible characters')
                    )
                )
            )
        );

        // http://stackoverflow.com/a/12128784/2193410 (Contain form within a bootstrap popover?)
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

        $settingsPopover.on('shown.bs.popover', function () {
            $('#' + self.elementIdPrefix + 'autoindent-checkbox').prop('checked', self.backgroundAutoIndent);
            $('#' + self.elementIdPrefix + 'ace-highlight-active-lines-checkbox').prop('checked', self.aceEditor.getHighlightActiveLine());
            $('#' + self.elementIdPrefix + 'ace-show-invisibles-checkbox').prop('checked', self.aceEditor.getShowInvisibles());
        });

        // http://stackoverflow.com/a/22050564/2193410 (Attach event handler to button in twitter bootstrap popover)
        var $body = $('body');
        $body.on('change', '#' + self.elementIdPrefix + 'autoindent-checkbox', function () {
            self.backgroundAutoIndent = this.checked;
            if(self.useLocalStorage) {
                localStorage.setItem('autoindent', this.checked);
            }
        });

        $body.on('change', '#' + self.elementIdPrefix + 'ace-highlight-active-lines-checkbox', function () {
            self.aceEditor.setHighlightActiveLine(this.checked);
            if(self.useLocalStorage) {
                localStorage.setItem('highlightline', this.checked);
            }
        });

        $body.on('change', '#' + self.elementIdPrefix + 'ace-show-invisibles-checkbox', function () {
            self.aceEditor.setShowInvisibles(this.checked);
            if(self.useLocalStorage) {
                localStorage.setItem('showinvisibles', this.checked);
            }
        });

        // The following three click handlers achieve toggling the settings popover when clicking the settings button
        // and hiding it when clicking anywhere outside it.
        $body.on('click', function () {
            $settingsPopover.popover('hide');
        });

        // TODO: The .popover selector will select all popovers,
        // and so a click on any popover in the body with trigger !== 'focus' will call this handler.
        // This works for now, but may create problems in the future.
        $body.on('click', '.popover', function (e) {
            e.stopPropagation();
        });

        $settingsPopover.on('click', function (e) {
            $settingsPopover.popover('toggle');
            e.stopPropagation();
        });
    }

    Editor.prototype.setTheme = function (theme) {
        this.aceEditor.setTheme('ace/theme/' + theme);
    };

    Editor.prototype.getText = function () {
        return this.aceEditor.getSession().getValue();
    };

    Editor.prototype.setText = function (text) {
        return this.aceEditor.getSession().setValue(text);
    };

    /**
     * @param size A valid CSS font size string, for example '12px'.
     */
    Editor.prototype.setFontSize = function (size) {
        document.getElementById(this.editorDivId).style.fontSize = size;
    };

    Editor.prototype.setMode = function (mode) {
        this.aceEditor.getSession().setMode('ace/mode/' + mode);
    };

    Editor.prototype.setAnnotations = function (annotations) {
        this.aceEditor.getSession().setAnnotations(annotations);
    };

    Editor.prototype.resize = function (resizeAfter) {
        var self = this;
        resizeAfter = resizeAfter || 200;

        // We resize after a timeout because when the window resize handler is called,
        // the window may not have resized completely, and hence the calculation below would
        // be made with old values. The timeout helps to make sure the resize is complete before
        // reading size values.
        // TODO: remove reliance on specific div ids, and cache the jQuery selectors
        window.setTimeout(function () {
            $('#' + self.editorDivId).height(
                $('#code-container').height() -
                $('#editor-tabs-bar').height() -
                $('#editor-opts-container').height() -
                $('#compile-opts-container').height() -
                2
            );
            self.aceEditor.resize();
        }, resizeAfter);
    };

    Editor.prototype.addKeyboardCommand = function (cmdName, keyBindings, execFunc, readOnly) {
        // If readOnly param is not passed in, then default to true, else coerce the passed in value to boolean and use
        readOnly = (typeof readOnly === 'undefined') ? true : !!readOnly;

        // http://ace.c9.io/#nav=howto
        this.aceEditor.commands.addCommand({
            name: cmdName,
            bindKey: keyBindings,
            exec: execFunc,
            readOnly: readOnly // false if this command should not apply in readOnly mode
        });
    };

    Editor.prototype.autoIndentCode = function () {
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

                text.insertLines(currentRow, [thisLine]);
                text.removeLines(currentRow + 1, currentRow + 1);

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
    };

    return Editor;
})();
