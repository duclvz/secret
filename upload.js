var fs = require('fs');
var request = require('request');
var youtubedl = require('youtube-dl');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var credential = require('./credential.json');
var oauth2Client = new OAuth2(credential.installed.client_id, credential.installed.client_secret, credential.installed.redirect_uris[0]);

oauth2Client.setCredentials({
	refresh_token: credential.installed.refresh_token
});

var Youtube = require('youtube-api');

function refresh() {
	oauth2Client.refreshAccessToken(function(err, tokens) {
		Youtube.authenticate({
			type: "oauth",
			refresh_token: tokens.refresh_token,
			client_id: credential.installed.client_id,
			client_secret: credential.installed.client_secret,
			token: tokens.access_token
		});
	});
}

refresh();
setInterval(function() {
	refresh();
}, 3500000)

var handler = setInterval(function() {
	Youtube.search.list({
		part: 'id,snippet',
		channelId: 'UC7zhwOWu8rRl9VEg50uSXNA',
		order: 'date',
		maxResults: 50,
		publishedAfter: credential.installed.lastTime
	}, function(err, data) {
		if (!err) {
			console.log(data)
			console.log(new Date().toString());
			for (var i = data.items.length - 1; i >= 0; i--) {
				var tempTime = new Date(data.items[i].snippet.publishedAt);
				tempTime.setTime(tempTime.getTime() + 1000);
				credential.installed.lastTime = tempTime.toISOString();
				fs.writeFile('./credential.json', JSON.stringify(credential), 'utf8', function() {
					console.log('[Change lastTime] Write Credential to');
					console.log(credential);
				})
				var videoId = data.items[i].id.videoId;
				if (videoId)
					reup(videoId);
			}
		}
	})
}, 300000);

function reup(videoId) {
	youtubedl.getInfo('http://www.youtube.com/watch?v=' + videoId, ['-f best'], function(err, info) {
		if (err) throw err;
		upload(videoId, info);
	})
}

function upload(videoId, info) {
	var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['-f best']);
	Youtube.videos.insert({
		resource: {
			snippet: {
				title: info.title,
				description: info.description,
				tags: info.tags,
				categoryId: '25'
			},
			status: {
				privacyStatus: "public"
			}
		},
		part: "snippet,status",
		media: {
			body: video
		}
	}, function(err, data) {
		if (err) return console.log("Upload failed " + info.title);
		console.log("Uploaded Video " + info.title);
		if (data)
			setThumb(info, data.id);
	});
}

function setThumb(info, newVideoId) {
	request({
		url: info.thumbnail,
		encoding: null
	}, function(err, res, body) {
		Youtube.thumbnails.set({
			videoId: newVideoId,
			media: {
				body: body
			}
		}, function(err, data) {
			if (!err)
				console.log("Setted up thumbnail of " + info.title)
		});
	});
}