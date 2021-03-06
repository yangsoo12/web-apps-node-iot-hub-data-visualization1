$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [],
  pm2Data = [],
  pm10Data = [];
 //---------yanji start 1/2------------
  
  //20170913
  var pm10Data = [],
      pm25Data = [];
  var result;
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
        label: 'pm2.5',
        yAxisID: 'pm2.5',
        borderColor: "rgba(255, 131, 131, 1)",
        pointBoarderColor: "rgba(255, 131, 131, 1)",
        backgroundColor: "rgba(255, 131, 131, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 131, 131, 1)",
        pointHoverBorderColor: "rgba(255, 131, 131, 1)",
        data: pm2Data
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & pm2.5 Real-time Data',
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
          id: 'pm2.5',
          type: 'linear',
          scaleLabel: {
            labelString: 'pm2.5(ug/m3)',
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
      document.getElementById("pm2").innerHTML = "pm2.0 : " + obj.params.pm2;
  		document.getElementById("pm10").innerHTML = "pm10 : " + obj.params.pm10;
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
	  if (obj.params.pm2) {
		  pm2Data.push(obj.params.pm2);
	  }
	  if (pm2Data.length > maxLen)
	  {
		  pm2Data.shift();
	  }
    if(obj.params.pm2>100){
  document.getElementById("pm2state").innerHTML = "아주나쁨";
}else if(obj.params.pm2>50){
  document.getElementById("pm2state").innerHTML = "나쁨";
}else if(obj.params.pm2>15){
  document.getElementById("pm2state").innerHTML = "보통";
}else if(obj.params.pm2>0){
  document.getElementById("pm2state").innerHTML = "좋음";
}
if(obj.params.pm10>150){
  document.getElementById("pm10state").innerHTML = "아주나쁨";
}else if(obj.params.pm2>80){
  document.getElementById("pm10state").innerHTML = "나쁨";
}else if(obj.params.pm2>30){
  document.getElementById("pm10state").innerHTML = "보통";
}else if(obj.params.pm2>0){
  document.getElementById("pm10state").innerHTML = "좋음";
}
      myLineChart.update();

 
      
 //---------yanji start 2/2------------
  //20170913 pm Data push    
      pm10Data.push(obj.params.pm10);
      pm25Data.push(obj.params.pm2);
    
      //android 20170912 23:29
//       if(humilength==0 || templength == 0 || pm10length ==0 || pm25length ==0){
           
//            }
//           }else{
//             humilength = humidityData.length;
//             templength = temperatureData.length;
//             pm10length = pm10Data.length;
//             pm25length = pm25Data.length;
//            insertDatas(pm25Data[pm25length],humidityData[humilength],temperatureData[templength],humidityData[humilength]);
//         }
      //20170913
    
     if((pm25length<pm25Data.length || pm25length == pm25Data.length)&&(pm10length<pm10Data.length || pm10length == pm10Data.length)&&(templength<temperatureData.length || templength == temperatureData.length)&&(humilength<humidityData.length || humilength == humidityData.length)){
          pm25length = pm25Data.length;
          pm10length = pm10Data.length;
          humilength = humidityData.length;
          templength = temperatureData.length;
          
          insertDatas(pm25Data[pm25length-1],pm10Data[pm10length-1],temperatureData[templength-1],humidityData[humilength-1]);
                          
          }
     
      
      //android 20170912 23:29
      function insertDatas(p2,p1,t,h){
         var p2State;
         f(p2<16){
           p2State = "좋음";
         }else if(p2<51){
           p2State = "보통";
         }else if(p2<101){
           p2State = "나쁨";
         }else{
           p2State = "매우나쁨";
         }
         Ao.showResult(p2,p1,t,h,p2State);
      }
      
     
//---------yanji end 2/2------------
      
    } catch (err) {
      console.error(err);
    }
  }
});
