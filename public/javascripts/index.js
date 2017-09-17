$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];

//---------joonseo start 1/5----------

	var pm2Data = [],
		pm10Data = [];

//---------joonseo end 1/5------------


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
        label: 'Temperature',
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

//---------joonseo start 2/5-------

	 var data2 = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
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

//---------joonseo end 2/5------------

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


//---------joonseo start 3/5----------

var basicOption2 = {
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

//---------joonseo end 3/5------------

  //Get the context of the canvas element we want to select
//  var ctx = document.getElementById("myChart").getContext("2d");
//  var optionsNoAnimation = { animation: false }
//  var myLineChart = new Chart(ctx, {
//    type: 'line',
//    data: data,
//    options: basicOption
//  });

//---------joonseo start 4/5----------

  var ctx2 = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation2 = { animation: false }
  var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: data2,
    options: basicOption2
  });

//---------joonseo end 4/5------------

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
	  //to check pm data in p type tag
      //document.getElementById("pm2").innerHTML = "pm2.5 : " + obj.params.pm2;
  	  //document.getElementById("pm10").innerHTML = "pm10 : " + obj.params.pm10;
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


//---------joonseo start 5/5----------

	if(obj.params.pm2){
		pm2Data.push(obj.params.pm2);
	}
	if(pm2Data.length>maxLen){
		pm2Data.shift();
	}
	if(obj.params.pm10){
		pm10Data.push(obj.params.pm10);
	}
	if(pm10Data.length>maxLen){
		pm10Data.shift();
	}

//---------joonseo end 5/5------------


      
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
