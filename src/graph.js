import React from 'react';
import ReactDOM from 'react-dom';
import CurrencyChart from '../views/index.jsx';

let chartData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

ReactDOM.render(<CurrencyChart data={chartData}/>, document.getElementById("graph"));



/*
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});

pubnub.subscribe({
   channel: 'my_channel',
   message: function(m){console.log(m)},
   error: function (error) {
     // Handle error here
     console.log(JSON.stringify(error));
   }
});
*/
