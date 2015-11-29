import ko from 'knockout';
import templateMarkup from 'text!./playground-term-pane.html';
import 'jquery-fullscreen';

class PlaygroundTermPane {
    constructor(params) {
        this.ttyContainers = [$('#tty-container'), $('#tty-container-two')];
        this.ttys = ['tty0', 'tty1'];
        this.activeTerminal = ko.observable(0);
        this.ttySwitchBtnClass = ko.pureComputed(() =>
            'glyphicon glyphicon-chevron-' + (this.activeTerminal() == 0 ? 'right' : 'left'));

        // https://github.com/kayahr/jquery-fullscreen-plugin#querying-fullscreen-mode
        this.fullScreenSupported = this.currentFullScreenState() !== null;
        this.isFullScreenActive = ko.observable(false);
        $(document).bind('fullscreenchange', () => {
            var currentState = !!this.currentFullScreenState(); // coerce to boolean
            this.isFullScreenActive(currentState);
            this.focusTerminal(this.activeTerminal());
        });
        this.fullScreenToggleBtnClass = ko.pureComputed(() =>
            'glyphicon glyphicon-resize-' + (this.isFullScreenActive() ? 'small' : 'full'));

        this.displayTerminalElements();
    }

    displayTerminalElements() {
        /* Jor1k is initialized at application startup. During initialization, its terminal
           expects the DOM elements to be present in the document. However, this component
           is shown only when the playground is displayed. So, as a workaround, the
           main HTML file (index.html) contains the canvas elements for the terminals
           inside a hidden DIV. When this component is constructed, these elements are
           moved inside the respective ttyContainers to be shown on the screen. When this
           component is disposed, the elements are moved back into the hidden DIV (using
           the hideTerminalElements function), ready to be moved back if and when this
           component is constructed again at some point. */
        for (var i = 0; i < 2; i++) {
            this.ttyContainers[i].append($(`#tty${i}`));
        }
    }

    hideTerminalElements() {
        // See the comment inside the displayTerminalElements function for details
        // about this function.
        var $hiddenTermContainer = $('#hidden-term-container');
        for (var i = 0; i < 2; i++) {
            $hiddenTermContainer.append($(`#tty${i}`));
        }
    }

    currentTerminalContainer() {
        return this.ttyContainers[this.activeTerminal()];
    }

    currentFullScreenState() {
        return this.currentTerminalContainer().fullScreen();
    }

    toggleFullScreen() {
        this.currentTerminalContainer().toggleFullScreen();
    }

    switchTerminal() {
        var current = this.activeTerminal(),
            other = 1 - current;
        this.ttyContainers[current].hide();
        this.activeTerminal(other);
        this.ttyContainers[other].show();
        this.focusTerminal(other);
    }

    focusTerminal(n) {
        // TODO
        //SysRuntime.getInstance().focusTerm(this.ttys[n]);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        this.hideTerminalElements();
    }
}

export default { viewModel: PlaygroundTermPane, template: templateMarkup };
