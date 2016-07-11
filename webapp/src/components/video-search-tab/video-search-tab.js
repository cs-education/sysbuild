/* global Bloodhound:false */
import ko from 'knockout';
import templateMarkup from 'text!./video-search-tab.html';
import videojs from 'videojs';
import 'typeahead-jquery';
import 'bloodhound';

class VideoSearchTab {
    constructor(params) {
        this.initBloodhound();
        this.initTypeahead();
    }

    initBloodhound() {
        this.videoSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'snippet'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 10,
            prefetch: {
                url: 'https://cs-education.github.io/sysassets/transcriptions/transcription_index.min.json'
            }
        });
        this.videoSearch.initialize();
    }

    initTypeahead() {
        let resultVideo = null;
        $('#video-search-typeahead').children('.typeahead').typeahead({
            highlight: true
        }, {
            displayKey: 'title',
            source: this.videoSearch.ttAdapter(),
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'unable to find any video lessons that match the current query',
                    '</div>'
                ].join('\n'),
                // Typeahead Docs (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets):
                // "Note a precompiled template is a function that takes a JavaScript object as its first argument and returns a HTML string."
                // So instead of using some templating library, using a simple function to act as a compiled template
                suggestion: (context) => {
                    return [
                        '<div>',
                            '<p><strong>' + context.title + '</strong><span class="pull-right"> Time ' + context.startTime + '</span>' + '</p>',
                            '<p>' + context.snippet + '</p>',
                        '</div>'
                    ].join('\n');
                }
            }
        }).on('typeahead:selected typeahead:autocompleted', (e, suggestion) => {
            resultVideo = suggestion;
            // For now suggestion is a time for proof of concept purposes
            // eventually it'll suggest an actual line from the transcripts
        }).keypress((e) => {
            if (e.which === 13) {
                // Enter key pressed
                this.loadVideo(resultVideo);
            } else {
                // User typed in something
                // Discard the last selected man page because it should be saved only when
                // the user autocompleted the typeahead hint or used a suggestion
                resultVideo = null;
            }
        }).keydown((e) => {
            if (e.which === 8) {
                // Backspace pressed
                // keypress does not fire for Backspace in Chrome
                // (https://stackoverflow.com/questions/4690330/jquery-keypress-backspace-wont-fire)
                resultVideo = null;
            }
        });

        $('#video-search-btn').click(() => {
            this.loadVideo(resultVideo);
        });
    }

    stopVideo() {
        if ($('#search-video').length > 0) {
            videojs('search-video').dispose();
        }
    }

    loadVideo(resultVid) {
        const $video = $('<video>').attr('id', 'search-video').
            addClass('video-js vjs-default-skin vjs-big-play-centered');
        this.stopVideo();
        $('#search-video-container').width(640).append($video);
        const vid = videojs('search-video', {
                    controls: true,
                    preload: 'none',
                    width: 640,
                    height: 264,
                    poster: ''
                });
        vid.ready(() => {
            const videoURL = 'https://cs-education.github.io/sysassets/mp4/' + resultVid.source;
            this.configurePlayer(vid, videoURL, resultVid.source);
        });
        vid.currentTime(resultVid.startTime);
        vid.play();
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

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: VideoSearchTab, template: templateMarkup };
