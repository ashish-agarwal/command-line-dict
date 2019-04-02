var env = process.argv.slice(2, process.argv.length);
var API_ID = "17dd95b2";
var API_KEY = "6ec8b1e24bfbb5399cc7554a685a3cf1";
var OXFORD_URL = "https://od-api.oxforddictionaries.com/api/v1";
var http = require('http');
var action = env[0];

var request = require("request");

var options = {
    method: 'GET',
    baseUrl: OXFORD_URL,
    json: true,
    headers:
    {
        app_key: API_KEY,
        app_id: API_ID
    }
};

switch (action) {
    case 'def':
        return getDefinition(env[1]);
    case 'syn':
        return getSynonyms(env[1])
}
function getDefinition(word) {
}
function getDefinition(word) {
    console.log("Meaning of", word, "\n")
    return getDataFromAPI({
        uri: '/entries/en/' + word + '/regions=us'
    }).then(function (res) {
        var i = 0;
        if (res.results && res.results[0]) {
            res.results[0].lexicalEntries.forEach(function (obj) {
                obj.entries.length > 0 && obj.entries.forEach(function (entry) {
                    entry.senses.length > 0 && entry.senses.forEach(function (sense) {
                        console.log((++i) + ')', sense.definitions.join('\n'));
                    })
                });
            });
        } else {
            console.log("Result not found");
        }
    })
}

function getDataFromAPI(obj) {
    options.uri = obj.uri;
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) return reject(error);
            else return resolve(body)
        });

    })
}