var env = process.argv.slice(2, process.argv.length);
var API_ID = "17dd95b2";
var API_KEY = "6ec8b1e24bfbb5399cc7554a685a3cf1";
var OXFORD_URL = "https://od-api.oxforddictionaries.com/api/v1";
var DUMMY_URL = "https://dummy.com/api/v1";
var action = env[0];
require('./dummyReq')

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
return Promise.resolve()
    .then(function () {
        switch (action) {
            case 'def':
                return getDefinition(env[1]);
            case 'syn':
                return getSynonyms(env[1]);
            case 'ant':
                return getAntonyms(env[1]);
            case "ex":
                return getExamples(env[1]);
            case 'dict':
                return getDefinition(env[1])
                    .then(getSynonyms(env[1]))
                    .then(getAntonyms(env[1]))
                    .then(getExamples(env[1]));

            default:
                if (env[0]) {
                    return getDefinition(env[0])
                        .then(getSynonyms(env[0]))
                        .then(getAntonyms(env[0]))
                        .then(getExamples(env[0]));
                } else {
                    return getRandomWord()
                        .then(function (word) {
                            return getDefinition(word)
                                .then(getSynonyms(word))
                                .then(getAntonyms(word))
                                .then(getExamples(word));
                        })
                }
        }
    }).catch(function (err) {
        console.log(err);
    })


function getRandomWord() {
    return getDataFromAPI({ uri: '/random', baseUrl: DUMMY_URL })
        .then(function (s) {
            return Promise.resolve(s.word);
        })

}
function getExamples(word) {
    return getDataFromAPI({
        uri: "entries/en/" + word + "/sentences"
    }).then(function (res) {
        console.log("Examples of", word, "\n");
        var i = 0;
        if (res.results && res.results[0]) {
            res.results[0].lexicalEntries.forEach(function (entry) {
                entry.sentences.length > 0 && entry.sentences.forEach(function (sentence) {
                    console.log((++i) + ')', sentence.text, '\n');
                });
            });
        } else {
            console.log("Result not found");
        }
    })

}

function getSynonyms(word) {
    return getDataFromAPI({
        uri: "entries/en/" + word + "/synonyms"
    }).then(function (res) {
        console.log("synonyms of", word, "\n");
        var i = 0;
        if (res.results && res.results[0]) {
            res.results[0].lexicalEntries.forEach(function (obj) {
                obj.entries.length > 0 && obj.entries.forEach(function (entry) {
                    entry.senses.length > 0 && entry.senses.forEach(function (sense) {
                        sense.synonyms.length > 0 && sense.synonyms.forEach(function (synonym) {
                            console.log((++i) + ')', synonym.text, '\n');
                        })
                    })
                });
            });
        } else {
            console.log("Result not found");
        }
    });
}

function getAntonyms(word) {
    return getDataFromAPI({
        uri: "entries/en/" + word + "/antonyms"
    }).then(function (res) {
        console.log("Antonyms of", word, "\n");
        var i = 0;
        if (res.results && res.results[0]) {
            res.results[0].lexicalEntries.forEach(function (obj) {
                obj.entries.length > 0 && obj.entries.forEach(function (entry) {
                    entry.senses.length > 0 && entry.senses.forEach(function (sense) {
                        sense.antonyms.length > 0 && sense.antonyms.forEach(function (antonym) {
                            console.log((++i) + ')', antonym.text, '\n');
                        })
                    })
                });
            });
        } else {
            console.log("Result not found");
        }
    });
}
function getDefinition(word) {
    return getDataFromAPI({
        uri: '/entries/en/' + word + '/regions=us'
    }).then(function (res) {
        console.log("Meaning of", word, "\n");
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
    });
}


function getDataFromAPI(obj) {
    options.uri = obj.uri;
    options.baseUrl = obj.baseUrl || OXFORD_URL;
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) return reject(error);
            else return resolve(body)
        });

    })
}