var fs = require('fs');
var youtubedl = require('youtube-dl');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('197517672022-vm8g45cqp92oa8tfue1cklkgqfjg05rt.apps.googleusercontent.com', 'cmYoue69Ao6jvSodhgWQPMBs', 'urn:ietf:wg:oauth:2.0:oob');

var scopes = [
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.upload'
];

var url = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
});

oauth2Client.setCredentials({
	refresh_token: '1/5b_zmQw-XUNcM2BR9pmSZJ_L2Bvzl8cnsWdoKxMWt1E'
});

var Youtube = require('youtube-api');
var lastTime = require("./lastTime.json")

function refresh(callback) {
	oauth2Client.refreshAccessToken(function(err, tokens) {
		Youtube.authenticate({
			type: "oauth",
			refresh_token: tokens.refresh_token,
			client_id: "197517672022-vm8g45cqp92oa8tfue1cklkgqfjg05rt.apps.googleusercontent.com",
			client_secret: "cmYoue69Ao6jvSodhgWQPMBs",
			token: tokens.access_token
		});
		callback();
	});
}
var handler = setInterval(function() {
	refresh(function() {
		Youtube.search.list({
			part: 'id,snippet',
			channelId: 'UC6k9UtD4jMgs3C3JwbviN0Q',
			order: 'date',
			maxResults: 5,
			publishedAfter: lastTime.time
		}, function(err, data) {
			if(!err) {
				console.log(data)
				for (var i=data.items.length-1;i>=0;i--) {
					var tempTime = new Date(data.items[i].snippet.publishedAt);
					tempTime.setTime(tempTime.getTime()+1000);
					lastTime.time=tempTime.toISOString();
					fs.writeFile('./lastTime.json', JSON.stringify(lastTime),'utf8', function(){
						console.log('Write lastTime to');
						console.log(lastTime);
					})
					reup(data.items[i].id.videoId)
				}
			}
		})
	})
}, 15000);

function reup(videoId) {
	var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['-f best'], {
		cwd: './'
	});
	var size = 0;
	video.on('info', function(info) {
		console.log('Downloading video: http://www.youtube.com/watch?v=' + videoId);
		console.log('Filename: ' + info._filename);
		console.log('Size: ' + info.size);
		size = info.size;
		video.pipe(fs.createWriteStream(videoId+'.mp4'));
	});
	var pos = 0;
	video.on('data', function data(chunk) {
		pos += chunk.length;
		if (size) {
			var percent = (pos / size * 100).toFixed(2);
			process.stdout.cursorTo(0);
			process.stdout.clearLine(1);
			process.stdout.write(percent + '%');
		}
	});
	video.on('end', function end() {
		console.log('\nDownload Done');
		upload()
	});

	function upload() {
		youtubedl.getInfo('http://www.youtube.com/watch?v=' + videoId, function(err, info) {
			if (err) throw err;
			var req = Youtube.videos.insert({
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
					body: fs.createReadStream(videoId+'.mp4')
				}
			}, function (err, data) {
				console.log("Uploaded");
				fs.unlink('./'+videoId+'.mp4',function(){
					console.log('Deleted video file!')
				})
			});
		})
	}
}
