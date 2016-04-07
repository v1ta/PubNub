// Graph
var myLiveChart =  {}

// Pubnub setup
var pubnub = PUBNUB.init({
    ssl           : false,
    publish_key   : "pub-c-a8de46c1-8872-451a-b4d0-1a80a875f37b",
    subscribe_key : "sub-c-ae145106-fc3e-11e5-b552-02ee2ddab7fe",
});

// Open socket with server
var socket = io.connect('http://localhost:3000', pubnub);

socket.on('connect', (message) => {
    console.log('Connected to server...');
})

socket.on('message', (message) => {
    drawGraph(message);
    message.forEach((key, index, array) => {
        if (key[0] == '#') key = key.slice(1);
        myLiveChart.scale.labels[index].value = key;
        let i = index;
        let channel = key
        let updateFlag = false;
        pubnub.subscribe({
            channel: `${channel}`,
            message: (m) => {
                myLiveChart.datasets[0].points[i].value += 1;
                //$('#tweet-stream').append(m.data); depending on the hashtag this can get expensive :)
            },
            connect: (e) => {
                pubnub.publish({
                    channel: `${channel}`,
                    message: `Client connected to ${channel}`,
                    callback: () => {updateFlag = true;}
                });
            }
        });
        setInterval(() => {
            if (updateFlag) {
                var oldRate = myLiveChart.datasets[1].points[i].value;
                var oldCount = myLiveChart.datasets[1].points[i].value * frame;
                var newCount = myLiveChart.datasets[0].points[i].value;
                frame += 5
                oldRate -= oldRate / frame;
                oldRate += (newCount - oldCount) / frame;
                myLiveChart.datasets[1].points[index].value = (oldRate * 12)
                myLiveChart.update();
            }
        }, 5000);
    });
})

function drawGraph(fields) {
    var canvas = document.getElementById('updating-chart'),
        ctx = canvas.getContext('2d'),
        startingData = {
          labels: fields,
          datasets: [
              {
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  data: [0, 0, 0, 0, 0, 0, 0]
              },
              {
                  fillColor: "rgba(151,187,205,0.2)",
                  strokeColor: "rgba(151,187,205,1)",
                  pointColor: "rgba(151,187,205,1)",
                  pointStrokeColor: "#fff",
                  data: [0, 0, 0, 0, 0, 0, 0]
              }
          ]
        };
        myLiveChart= new Chart(ctx).Radar(startingData, {animationSteps: 15}),
            frame = 0;
}
