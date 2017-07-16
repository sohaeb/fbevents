var request = require("request");

let accessToken = 'access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU'
var param = 'events?fields=name,start_time,cover,end_time,place,description&since=now&' + accessToken;
var url = 'https://graph.facebook.com'

request(  url + '/uwindsormsa/' + param, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body)); // Show the JSON for the Star Wars Character
    }
});
console.log("Running Now");
