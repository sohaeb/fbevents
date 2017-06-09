var request = require("request");

request('https://graph.facebook.com/uwindsormsa/events?fields=name,picture&limit=10&access_token=301801280168696|FDzuXZs_Mio_vtBjPvH-fYcBglU', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body)); // Show the JSON for the Star Wars Character
    }
});
