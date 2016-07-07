var fs = require('fs');
var youtubedl = require('youtube-dl');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('817888159980-1ms151b09s5amau08cmdu15tb8qdgpqe.apps.googleusercontent.com', 'dBzIWvcQ77YU0wPY-W2sw_FO', 'urn:ietf:wg:oauth:2.0:oob');

var scopes = [
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.upload'
];

var url = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
});

oauth2Client.setCredentials({
	refresh_token: '1/eMSiyvBW-bHA8-krOsGO0EVR9s6QpiKUlemyGK4Ozsw'
});

var Youtube = require('youtube-api');
var lastTime = require("./lastTime.json")

function refresh(callback) {
	oauth2Client.refreshAccessToken(function(err, tokens) {
		Youtube.authenticate({
			type: "oauth",
			refresh_token: tokens.refresh_token,
			client_id: "817888159980-1ms151b09s5amau08cmdu15tb8qdgpqe.apps.googleusercontent.com",
			client_secret: "dBzIWvcQ77YU0wPY-W2sw_FO",
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
		channelId: 'UCrMxXQAHxzQEWVhVhR9oXeQ',
		order: 'date',
		maxResults: 40,
		publishedAfter: lastTime.time
	}, function(err, data) {
		if (!err) {
			console.log(data);
			console.log(new Date().toString());
			for (var i = data.items.length - 1; i >= 0; i--) {
				var tempTime = new Date(data.items[i].snippet.publishedAt);
				tempTime.setTime(tempTime.getTime() + 1000);
				lastTime.time = tempTime.toISOString();
				fs.writeFile('./lastTime.json', JSON.stringify(lastTime), 'utf8', function() {
					console.log('Write lastTime to');
					console.log(lastTime);
				})
				var videoId = data.items[i].id.videoId;
				if (videoId)
					reup(videoId);
			}
		}
	})
}, 180000);

function reup(videoId) {
	setTimeout(function() {
		youtubedl.getInfo('http://www.youtube.com/watch?v=' + videoId, ['-f best'], function(err, info) {
			if (err) throw err;
			var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['-f best']);
			Youtube.videos.insert({
				resource: {
					snippet: {
						title: info.title,
						description: info.description,
						tags: info.tags,
						categoryId: '17'
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
				console.log("Uploaded Video " + info.title);
			});
		})
	}, 180000)
}
