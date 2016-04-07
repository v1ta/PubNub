// Depecencies
var express = require('express'),
    request = require('request'),
    Twitter = require('twitter'),
    Promise = require('es6-promise').Promise,
    q = require('q').defer(),
    pubnub = require("pubnub")({
        ssl           : false,
        publish_key   : "pub-c-a8de46c1-8872-451a-b4d0-1a80a875f37b",
        subscribe_key : "sub-c-ae145106-fc3e-11e5-b552-02ee2ddab7fe"
    }),
    credentials = { // Twitter dev credentials
        consumer_key: 'JKq5e2myijbX72Nv6rkFBkAGE',
        consumer_secret: 'oD5PWgWviYAks2oxoMSpzsWfOIw8NKdPeBHJYWOWb3dIwIAhu6',
        access_token_key: '355523513-yY1EQW0Px1p41UEDAOR2f4ce9Il3YSxsbiwpkqne',
        access_token_secret: 'PhjJ7lHPEdsnFhUw507ubSPGpLHiBu9rGkGA0e4kJsxBv'
    },
    client = new Twitter(credentials);

// Async Twitter API, get trends by locaiton, stream 7 of them through pubnub
module.exports = function() {
    return new Promise((resolve,reject) => {
        // GET request for trends by WOEID
        client.get('trends/place',{id: 1}, (error, tweets, response) => {
            if(error) {
                console.log('GET ERROR: ',error)
                return reject(error)
            }
            Twitter = require('ntwitter'); //small hack, these APIs aren't maintained anymore
            client = new Twitter(credentials);

            // The radar graph takes 7 data sources
            var hashtags = tweets[0]['trends'].map((curr) => {
                return curr['name'];
            }).slice(0,7);
        var hashtags = ['#RogueOne','#NationalBeerDay','#BeijarNosNaoBeija','#4YearsWithEXO','Mashable','Ernie Els', 'Nicki'];
        //    console.log(hashtags);
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
            console.log(tweet.text);
            if (tweet.text !== undefined) {
                // check the tweet can be categorized (API doesn't do this)
                if (tweet.entities.hashtags.length > 0) {
                    if (hashtags.indexOf(tweet.entities.hashtags[0].text) > -1) {
                        console.log('Channel name',tweet.entities.hashtags[0].text)
                        // Channel Name = hashtag
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
            console.log('STREAM ERROR: ',error)
            return;
        });
    })
}
