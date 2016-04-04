// Depecencies
var express = require('express'),
    request = require('request'),
    Twitter = require('twitter'),
    q = require('q');

// Global Vars
var router = express.Router(),
    trends = {},
    log = console.log;

// Data Source
var client = new Twitter({
    consumer_key: 'JKq5e2myijbX72Nv6rkFBkAGE',
    consumer_secret: 'oD5PWgWviYAks2oxoMSpzsWfOIw8NKdPeBHJYWOWb3dIwIAhu6',
    access_token_key: '355523513-yY1EQW0Px1p41UEDAOR2f4ce9Il3YSxsbiwpkqne',
    access_token_secret: 'PhjJ7lHPEdsnFhUw507ubSPGpLHiBu9rGkGA0e4kJsxBv'
})

// Trends
client.get('trends/place',{id:1}, function(error, tweets, response){
    if(error) return console.log(error);
    callback(tweets)
});

function callback(tweets) {
    tweets[0]['trends'].reduce((prev, curr) => {
        if (curr['tweet_volume'] > 0) return trends[curr['name']] = curr['tweet_volume']
    },trends)
    console.log(trends)
}
/*
client.stream('statuses/filter', {track: 'chivas'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    throw error;
  });
});
*/
