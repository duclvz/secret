var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var fs = require('fs');
var credential = require('./credential.json');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var scopes = [
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.upload'
];

var oauth2Client = new OAuth2(credential.installed.client_id, credential.installed.client_secret, credential.installed.redirect_uris[0]);
console.log(oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
}))

rl.question('Code: ', function(code) {
	oauth2Client.getToken(code, function(err, tokens) {
		if (!err) {
			console.log(tokens)
			credential.installed.refresh_token = tokens.refresh_token;
			fs.writeFile('./credential.json', JSON.stringify(credential), 'utf8', function() {
				console.log('Write Credential to');
				console.log(credential);
			})
		}
	});
	rl.close();
})