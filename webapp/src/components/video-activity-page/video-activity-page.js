import ko from 'knockout';
import templateMarkup from 'text!./video-activity-page.html';
import marked from 'marked';
import videojs from 'videojs';

class VideoActivityPage {
    constructor(params) {
        this.activityData = params.activityData;
        const videoActivity = this.activityData.activity;
        const videoUrlPrefix = 'https://cs-education.github.io/sysassets/' + videoActivity.file;
        const videoName = videoActivity.file.replace('mp4/', '');

        this.topics = videoActivity.topics || '';
        this.doc = ko.observable(marked(videoActivity.doc || ''));
        if (videoActivity.docFile) {
            $.get('https://cs-education.github.io/sysassets/' + videoActivity.docFile, (data) => {
                this.doc(marked(data));
            });
        }

        const $video = $('<video>').attr('id', 'lesson-video').
            addClass('video-js vjs-default-skin vjs-big-play-centered');

        $('#lesson-video-container').width(960).append($video);

        this.player = videojs('lesson-video', {
            controls: true,
            preload: 'none',
            width: 960,
            height: 540,
            poster: ''
        });

        this.player.ready(() => {
            // add the text track to the video
            this.configurePlayer(this.player, videoUrlPrefix, videoName);
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        if ($('#lesson-video').length > 0) {
            this.player.dispose();
        }
    }

    configurePlayer(player, videoURL, videoName) {
        player.src([
            { type: 'video/mp4', src: videoURL + '.mp4' },
            { type: 'video/webm', src: videoURL + '.webm' },
            { type: 'video/ogg', src: videoURL + '.ogv' }
        ]);

        // It's very important that you wait for the video player to load before
        // adding remote text tracks. Source:
        // https://docs.brightcove.com/en/video-cloud/brightcove-player/guides/adding-captions-to-videos.html
        player.on('loadstart', () => {
            const trackLabel = 'English';
            player.addRemoteTextTrack({
                kind: 'captions',
                language: 'en',
                label: trackLabel,
                src: 'https://cs-education.github.io/sysassets/transcriptions/' + videoName + '.webvtt'
            });

            // now I want to activate the track I just added
            // unfortunately, there's no good way to do that (as of 2015-04-03)
            // so, let's use a hack!
            // get the text track options in the DOM of the video player
            $('div.video-js > div.vjs-control-bar > div.vjs-captions-button > div.vjs-control-content > ' +
                'div.vjs-menu > ul.vjs-menu-content > li.vjs-menu-item').each((index, element) => {
                // find the option for our text track
                if (element.innerHTML === trackLabel) {
                    // click the caption option in the DOM
                    element.click();
                }
            });
        });
    }
}

export default { viewModel: VideoActivityPage, template: templateMarkup };
