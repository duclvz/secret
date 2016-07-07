var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var credential = {
	client_id: '817888159980-1ms151b09s5amau08cmdu15tb8qdgpqe.apps.googleusercontent.com',
	client_secret: 'dBzIWvcQ77YU0wPY-W2sw_FO',
	redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
};
var oauth2Client = null;
var scopes = [
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/youtube.upload'
];

oauth2Client = new OAuth2(credential.client_id, credential.client_secret, credential.redirect_uri);
console.log(oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
}))
getRT();

function getRT() {
	rl.question('Code: ', function(code) {
		oauth2Client.getToken(code, function(err, tokens) {
			if (!err) {
				console.log(tokens)
			}
		});
		rl.close();
	})
}
