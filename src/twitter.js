// Depecencies
var Twitter = require('twitter'),
    keys = require('./keys.js'), // YOUR KEYS HERE
    Promise = require('es6-promise').Promise,
    pubnub = require("pubnub")({
        ssl           : false,
        publish_key   : keys['pubnub_publish_key'],
        subscribe_key : keys['pubnub_subscribe_key']
    }),
    credentials = { // Twitter dev credentials
        consumer_key: keys['twitter_consumer_key'],
        consumer_secret: keys['twitter_consumer_secret'],
        access_token_key: keys['twitter_access_token_key'],
        access_token_secret: keys['twitter_access_token_secret']
    },
    client = new Twitter(credentials);

// Async Twitter APIs, get trends by locaiton, stream 7 of them through pubnub
module.exports = function() {
    return new Promise((resolve,reject) => {
        // GET request for trends by WOEID
        client.get('trends/place',{id: 2459115}, (error, tweets, response) => {
            if(error) return reject(error)

            //small hack, due to these APIs not being maintained anymore
            Twitter = require('ntwitter');
            client = new Twitter(credentials);

            // The radar graph takes 7 data sources
            var hashtags = tweets[0]['trends'].map((curr) => {
                return curr['name'];
            }).slice(2,9);

            getTrends(hashtags)
            return resolve(hashtags);
        });
    });
};

// Get stream of tweets from selected trends
function getTrends(hashtags) {
    client.stream('statuses/filter', {track: hashtags}, (stream) => {
        hashtags.forEach((elem,i,arr) => {
            if (elem[0] == '#') hashtags[i] = elem.slice(1);
        })

        // Filter out undefined or partially defined tweets from the API, publish w/PubNub
        stream.on('data', (tweet) => {
            if (tweet.text !== undefined) {
                if (tweet.entities.hashtags.length > 0) {
                    if (hashtags.indexOf(tweet.entities.hashtags[0].text) > -1) {
                        console.log(tweet.text);
                        pubnub.publish({
                            channel: tweet.entities.hashtags[0].text,
                            message: {
                                name: 'tweet',
                                data: tweet.text
                            },
                            restore: true
                        });
                    }
                }
            }
        });

        stream.on('error', (error)  => {
            return console.error(error);
        });
    })
}
