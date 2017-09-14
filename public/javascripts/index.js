$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
 //---------yanji start 1/2------------
  
  //20170913
  var pm10Data = [],
      pm25Data = [];
 // android 20170912 23:29
  var humilength = humidityData.length;
  // 20170913
  var templength = temperatureData.length;
  var pm10length = pm10Data.length;
  var pm25length = pm25Data.length;
  
  //---------yanji end 1/2------------
  
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Val',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Val(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.params.Temperature) {
        return;
      }
      document.getElementById("pm2").innerHTML = "pm2.0 : " + obj.pm2;
  		document.getElementById("pm10").innerHTML = "pm10 : " + obj.pm10;
      timeData.push(obj.time);
      temperatureData.push(obj.params.Temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 10;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.params.Humidity) {
        humidityData.push(obj.params.Humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
      
 //---------yanji start 2/2------------
  //20170913 pm Data push    
      pm10Data.push(obj.params.pm10);
      pm25Data.push(obj.params.pm2);
    
      //android 20170912 23:29
      if(humilength==0 || templength == 0 || pm10length ==0 || pm25length ==0){
           
          }else{
            humilength = humidityData.length;
            templength = temperatureData.length;
            pm10length = pm10Data.length;
            pm25length = pm25Data.length;
           insertDatas(pm25Data[pm25length],humidityData[humilength],temperatureData[templength],humidityData[humilength]);
        }
      //20170913
//       if(templength<temperatureData.length || templength == temperatureData.length){
//            tempPrint();
//           }else if(templength == 0){
//            tempNull();
//         }
//       if(pm10length<pm10Data.length || pm10length == pm10Data.length){
//            pm10Print();
//           }else if(pm10length == 0){
//            pm10Null();
//         }
//       if(pm25length<pm25Data.length || pm25length == pm25Data.length){
//            pm25Print();
//           }else if(pm25length == 0){
//            pm25Null();
//         }
      
      //android 20170912 23:29
      function insertDatas(p2,p1,t,h){
         Ao.showResult(p2,p1,t,h);
      }
      
     
//---------yanji end 2/2------------
      
    } catch (err) {
      console.error(err);
    }
  }
});
