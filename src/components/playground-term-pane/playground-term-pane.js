import ko from 'knockout';
import templateMarkup from 'text!./playground-term-pane.html';
import 'jquery-fullscreen';

class PlaygroundTermPane {
    constructor(params) {
        this.ttyContainer = $('#tty-container');
        this.ttyContainerTwo = $('#tty-container-two');
        this.currentTTYContainer = this.ttyContainer;
        this.fullScreenSupported = this.currentTTYContainer.fullScreen() !== null;
        this.ttyFullScreen = ko.observable(false);

        this.ttyFullScreen.subscribe(function () {
            //SysRuntime.getInstance().focusTerm(self.isPrimaryTTY() ? 'tty0' : 'tty1');
        });

        $(document).bind('fullscreenchange', () => {
            this.ttyFullScreen(!!this.currentTTYContainer.fullScreen()); // coerce to boolean
        });

        this.isPrimaryTTY = ko.observable(true);
        this.isPrimaryTTY.subscribe((newFrontTTY) => {
            this.currentTTYContainer.hide();
            if (newFrontTTY) {
                this.currentTTYContainer = this.ttyContainer;
                //SysRuntime.getInstance().focusTerm('tty0');
            } else {
                this.currentTTYContainer = this.ttyContainerTwo;
                //SysRuntime.getInstance().focusTerm('tty1');
            }
            this.currentTTYContainer.show();
        });

        this.ttyToggleBtnClass = ko.pureComputed(() => {
            return 'glyphicon ' + (this.ttyFullScreen() ? 'glyphicon-resize-small' : 'glyphicon-resize-full');
        });

        this.ttySwitchBtnClass = ko.pureComputed(() => {
            return 'glyphicon ' + (this.isPrimaryTTY() ? 'glyphicon-chevron-right' : 'glyphicon-chevron-left');
        });
    }

    toggleFullScreen() {
        this.currentTTYContainer.toggleFullScreen();
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlaygroundTermPane, template: templateMarkup };
