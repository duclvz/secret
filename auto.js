unsafeWindow.playAds = null;
unsafeWindow.timeOut = null;
unsafeWindow.countdown = null;
unsafeWindow.startAuto = null;
unsafeWindow.stopAuto = null;
unsafeWindow.timer = null;
unsafeWindow.countAds = 0;
(function() {
    'use strict';

    unsafeWindow.startAuto = function() {
        var minutes, seconds;
        unsafeWindow.playAds();
        document.querySelector('#autoAds').setAttribute('onclick', 'stopAuto()');
        document.querySelector('#autoAds').setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-destructive');
        document.querySelector('#autoButton').textContent = 'Stop';
        unsafeWindow.countdown = setInterval(function() {
            minutes = parseInt(unsafeWindow.timer / 60, 10);
            seconds = parseInt(unsafeWindow.timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            document.querySelector('#autoTimer').textContent = minutes + ":" + seconds;
            if (--unsafeWindow.timer < 0) {
                unsafeWindow.timer = 0;
            }
        }, 1000);
    };
    unsafeWindow.stopAuto = function() {
        unsafeWindow.timer = 0;
        clearInterval(unsafeWindow.countdown);
        clearTimeout(unsafeWindow.timeOut);
        document.querySelector('#autoAds').setAttribute('onclick', 'startAuto(document.querySelector("#autoTimer"))');
        document.querySelector('#autoAds').setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-default');
        document.querySelector('#autoButton').textContent = 'Auto';
    };
    if (window.location.href.indexOf("live_dashboard") > -1) {
        var div = document.createElement('div');
        div.innerHTML = '<button id="autoAds" onclick="startAuto()" type="button" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default"><span id="autoButton" class="yt-uix-button-content">Auto</span> | <span id="countAds">0</span> | <span id="autoTimer"></span><button>';
        document.querySelector('div.dashboard-control.player-controls-buttons').insertBefore(div.firstChild, document.querySelector('div.dashboard-control.player-controls-buttons').childNodes[0]);
    }
    unsafeWindow.playAds = function() {
        var current = null;
        if (window.location.href.indexOf("live_dashboard") > -1) {
            document.querySelector('div.yt-uix-hovercard.play-ad-button-hovercard > button').click();
            console.log('Played Ads');
            document.querySelector('#countAds').textContent = ++unsafeWindow.countAds;
            current = parseInt(document.querySelector('div.metric-count-viewership.analytics-summary-metric-header-number').innerHTML);
        }
        if (window.location.href.indexOf("live_event_analytics") > -1) {
            document.querySelector('button#submit-ad-button').click();
            console.log('Inserted Ads');
            document.querySelector('#countAds').textContent = ++unsafeWindow.countAds;
            current = parseInt(document.querySelector('#live-rtd-info-button-current-streams-content').innerHTML);
        }
        if (current > 70) {
            unsafeWindow.timeOut = setTimeout(playAds, 180000);
            unsafeWindow.timer = 180;
        }
        else if (current > 0) {
            unsafeWindow.timeOut = setTimeout(playAds, 180000 * 70 / current);
            unsafeWindow.timer = 180 * 70 / current;
        }
    };
})();