/* global $ */

window.videoPlayerConfig = (function () {
    'use strict';

    function configure(player, videoURL, videoName) {
        var trackLabel = 'English';
        player.addRemoteTextTrack({
            kind: 'captions',
            language: 'en',
            label: trackLabel,
            src: 'http://cs-education.github.io/sysassets/transcriptions/' + videoName + '.webvtt'
        });

        // now I want to activate the track I just added
        // unfortunately, there's no good way to do that (as of 2015-04-03)
        // so, let's use a hack!
        // get the text track options in the DOM of the video player
        $('div.video-js > div.vjs-control-bar > div.vjs-captions-button > div.vjs-control-content > ' +
            'div.vjs-menu > ul.vjs-menu-content > li.vjs-menu-item').each(function (index, element) {
            // find the option for our text track
            if (element.innerHTML === trackLabel) {
                // click the caption option in the DOM
                element.click();
            }
        });

        player.src([
            { type: 'video/mp4', src: videoURL + '.mp4' },
            { type: 'video/webm', src: videoURL + '.webm' },
            { type: 'video/ogg', src: videoURL + '.ogv' }
        ]);
    }

    return {
        configure: configure
    };
})();
