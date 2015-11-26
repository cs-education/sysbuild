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
    }
}

export default { viewModel: PlaygroundTermPane, template: templateMarkup };
