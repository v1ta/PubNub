// Depecencies
var express = require('express'),
    request = require('request'),
    Twitter = require('twitter'),
    Promise = require('es6-promise').Promise,
    pubnub = require("pubnub")({
        ssl           : false,
        publish_key   : ,//PUBNUB KEYS
        subscribe_key : //GO HERE
    }),
    credentials = { // Twitter dev credentials
        consumer_key: ,//YOUR
        consumer_secret: ,//TWITTER
        access_token_key: ,//DEV
        access_token_secret: //KEYS
    },
    client = new Twitter(credentials);

// Async Twitter APIs, get trends by locaiton, stream 7 of them through pubnub
module.exports = function() {
    return new Promise((resolve,reject) => {
        // GET request for trends by WOEID
        client.get('trends/place',{id: 1}, (error, tweets, response) => {
            if(error) return reject(error)

            //small hack, due to these APIs not being maintained anymore
            Twitter = require('ntwitter');
            client = new Twitter(credentials);

            // The radar graph takes 7 data sources
            var hashtags = tweets[0]['trends'].map((curr) => {
                return curr['name'];
            }).slice(0,7);

            getTrends(hashtags)
            return resolve(hashtags);
        });
    });
};

function getTrends(hashtags) {
    client.stream('statuses/filter', {track: hashtags}, (stream) => {
        hashtags.forEach((elem,i,arr) => {
            if (elem[0] == '#') hashtags[i] = elem.slice(1);
        })
        stream.on('data', (tweet) => {

            // Twitter's api will occasionally send undefined or partially defined tweets
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
                            restore: true,
                            callback: (m) => {console.log(m.data);}
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
