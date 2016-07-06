###Twitter Trending Radar Graph
Radar Chart from [Chartjs](http://www.chartjs.org/) which plots 7 trends by total tweets and tweets per minute in real time.
* [pubnub](https://www.npmjs.com/package/pubnub)
* [ntwitter](https://www.npmjs.com/package/ntwitter)


###Installation
 ```bash
 git clone https://github.com/v1ta/Twitter-Trending-Radar-Graph.git
 cd Twitter-Trending-Radar-Graph
 npm install
 ```

The app requires [Twitter](https://dev.twitter.com/) credentials in src/twitter.js and [PubNub](https://www.pubnub.com/) channel information in views/js/chart.js, and src/twitter.js. After supplying the pre-requisite information:

```bash
node app.js
```
[http://localhost:3000](http://localhost:3000)
