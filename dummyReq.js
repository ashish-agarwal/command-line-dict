const nock = require('nock')

var DUMMY_URL = "https://dummy.com/api/v1";
var faker = require('faker');

nock(DUMMY_URL)
    .get('/random')
    .reply(200, {
        word: (Date.now() % 2) === 0 ? faker.hacker.verb() : faker.hacker.ingverb() // for randomness
    })