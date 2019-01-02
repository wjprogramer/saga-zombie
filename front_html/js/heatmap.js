/* Get Data */
var date = Date();
var current_hour_progress = 0; // 取得今天的進度 ex: 正午12:00，為0.5
var heatmap = new Array();

var heatmap_fetch_days = 84;

for (var i = 0; i < 7; i++) {
  heatmap[i] = new Array();
}

function createHeatMap() {
	date = new Date();
	current_hour_progress = (date.getMinutes() * 60 + date.getSeconds()) / 86400;

  resetHeatmapArray();

	// 取得距離i天前的資料
	request();
}

function request() {
	var url;
	url = "https://ptt.imyz.tw/query/get_pushes_by_username?username=" + username + "&beginning_day=" + heatmap_fetch_days + "&ending_day=0";

	var users_pushes_count_obj;
	var users_pushes_count_json;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    loadingGif();
		if (this.readyState == 4 && this.status == 200) {
        console.log("success");

	  		users_pushes_count_obj = JSON.parse(this.responseText);
		    users_pushes_count_json = JSON.stringify(users_pushes_count_obj);

		    for (index in users_pushes_count_json)
		    {
          if (users_pushes_count_obj[index] == undefined){
            continue;
          }

          var push_date = new Date(parseInt(users_pushes_count_obj[index]["date_time"]) * 1000);
          heatmap[push_date.getDay()][push_date.getHours()]++;
		    }
	  	}
	};
  xmlhttp.addEventListener("load", function(e){
    draw();
    analysis();
  });

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function loadingGif() {
  while (document.getElementById('heatmap').firstChild) {
    document.getElementById('heatmap').removeChild(document.getElementById('heatmap').firstChild);
  }
  var img = document.createElement('img');
  img.src = "img/loading2.gif";
  img.alt = "Loading...";
  img.title = "Loading..."; 
  img.className = "w3-image";
  img.style.cssText = "display: block; margin:120px auto auto auto;";

  document.getElementById('heatmap').appendChild(img);
}

function resetHeatmapArray() {
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 24; j++) {
      heatmap[i][j]=0;
    }
  } 
}

function getDay(i) {
	var day = (date.getDay() + 7 - i) % 7;
	return day;
}

function getHour(i) {
  var hour = (date.getHours() + 24 - i) % 24;
  return hour;
}

/* PIXI */
var heatmap_colors = [0xbbbbbb, 0xFFFFD9, 0xEDF8B1, 0xC7E9B4, 0x7FCDBB, 0x41B6C4, 0x1D91C0, 0x225EA8, 0x253494, 0x081D58];
var heatmap_lower_bound = [0, 1, 2, 4, 5, 7, 26, 62, 99, 135];

function getColor(value) {
  for (var i = 0; i < 10; i++) {
    if ( i == 9) {
      return heatmap_colors[i];
    }
    if ( value >= heatmap_lower_bound[i] && value < heatmap_lower_bound[i+1]) {
      return heatmap_colors[i];
    }
  }
  return heatmap_colors[0];
}

// Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}
PIXI.utils.sayHello(type)

//Create a Pixi Application
let app;

function draw() {
  app = new PIXI.Application({
      width: 1400,         // default: 800
      height: 512,        // default: 600
      antialias: true,    // default: false
      transparent: true, // default: false 透明度
      resolution: 1,      // default: 1
      preserveDrawingBuffer: true
    }
  );
  app.interactive = true;
  app.stage.interactive = true;
  // app.renderer.backgroundColor = 0xF3F3F3; // 061639

  while (document.getElementById('heatmap').firstChild) {
      document.getElementById('heatmap').removeChild(document.getElementById('heatmap').firstChild);
  }
  document.getElementById('heatmap').appendChild(app.view);
  setup();
}

function setup() {
  // ** set y-axis - day of week
  var day_x = 15;
  var day_y = 55;
  var day = ["日", "月", "火", "水", "木", "金", "土"]
  let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 15,
    fill: "black"
  });

  for (i = 0; i < 7; i++) {
    let message = new Text(day[i], style);
    message.position.set(day_x, day_y);
    app.stage.addChild(message);

    day_y += 55;
  }

  // ** set x-axis - time
  var time_x = 0;
  var time_y = 10;
  var time_gap = 55;

  for (i = 1; i <= 12; i++) {
    time_x += time_gap;

    let message = new Text(i+"a", style);
    message.position.set(time_x, time_y);
    app.stage.addChild(message);
  }

  for (i = 1; i <= 12; i++) {
    time_x += time_gap;

    let message = new Text(i+"p", style);
    message.position.set(time_x, time_y);
    app.stage.addChild(message);
  }

  // ** rects
  var init_x = 40;
  var x = init_x;
  var y = 40;
  var width = 50;
  var height = 50;
  var gap = 5;

  for (i = 1; i <= 7; i++) {
    for (j = 1; j <= 24; j++) {
      let rectangle = new Graphics();
      rectangle.beginFill(getColor(heatmap[i - 1][j - 1])) // 填充顏色
      // rectangle.lineStyle(4, 0xFF3300, 1); // 寬度4 alpha為1
      rectangle.drawRoundedRect(x, y, width, height, 4);
      rectangle.endFill(); // 結束繪製

      rectangle.interactive = true;
      rectangle.hitArea = new PIXI.Circle(50, 50, 50);

      rectangle.mouseover = function(mouseData) {
        this.alpha = 1;
      }

      rectangle.mouseout = function(mouseData) {
        this.alpha = 0;
      }

      // rectangle.on('mouseout', function (event) {
        
      // });
      // rectangle.on('mousemove', function (event) {

      // });

      app.stage.addChild(rectangle);

      x += width + gap;
    }
    x = init_x;
    y += height + gap;
  }  
} // end setup

// 分析
var concentrated_value = new Array();

for (i = 0; i < 7; i++) {
  concentrated_value[i] = new Array();
  for (j = 0; j < 24; j++)
    concentrated_value[i][j] = 0;
}



function analysis() {
  console.log(concentrated_value);

  var analysis_text = "";
  calcAllConcentratedValues();
  for (var i = 0; i < 7; i++) {
    analysis_text += "" + i + "---";
    for (var j = 0; j < 24; j++) {
      analysis_text += concentrated_value[i][j] + " ";
    }
    analysis_text += "<br>";
  }

  $("#concentrated_values").html(analysis_text)

  var test_output_text = "";
  var concentrated_sum = 0.0;

  var concentrated_mean_value = new Array();

  for (var i = 0; i < 7; i++) {  
    concentrated_mean_value[i] = getConcentratedMean(i);
    concentrated_sum += concentrated_mean_value[i];
  }

  for (var i = 0; i < 7; i++) {
    var percent_concentrated_mean = (concentrated_mean_value[i] / concentrated_sum ); //.toFixed(0) * 100.0
    test_output_text += i + ": " + concentrated_mean_value[i] + "<br>";
  }
  $("#test_output").html(test_output_text);
}

// 計算所有集中值
// 集中值的改善: 如果某值高於比例20%或其他比例，可能代表使用者特定時間內使用推噓過多。
//              或是count過低也沒什麼參考價值
function calcAllConcentratedValues() {
  for (var i = 0; i < 7; i++) {
    var percent_value = 0;
    var sum = 0;

    for (var j = 0; j < 24; j++) {
      sum += heatmap[i][j];
    }

    percent_value = sum / 24.0;

    for (var j = 0; j < 24; j++) {
      concentrated_value[i][j] = getConcentratedValue(i, j, percent_value);
    }
  }
}

/**
  * @percent_value: ( 1 / 一個星期的總推文數 ) => count以比例來計算 讓所有人的count總數都為1
  */
function getConcentratedValue(day, hour, percent_value) { // 計算heatmap(i,j)集中程度值
  var result = 0;
  var base_value = 13;
  var isChecked = new Array();

  for (i = 0; i < 24; i++) {
    isChecked[i] = false;
  }

  result += heatmap[day][hour] * percent_value * base_value;

  // 算右邊
  for (i = 1; i < 13; i++) {
    var tmp_hour = (hour + i) % 23;
    result += heatmap[day][tmp_hour] * percent_value * (base_value - i);
  }

  // 算左邊
  for (i = 1; i < 12; i++) {
    var tmp_hour = (hour - i + 23) % 23;
    result += heatmap[day][tmp_hour] * percent_value * (base_value - i);
  }

  return result.toFixed(2);
}

function getConcentratedMean(day) {
  var output = 0.0;
  var sum = 0;
  for (var i = 0; i < 24; i++) {
    console.log(sum);
    sum += parseFloat(concentrated_value[day][i]);
  }
  output = sum / 24;
  return output.toFixed(0);
  // output.toFixed(2)
}

function calcStandardDeviation() { // standard_deviation

}

function mean(i) { // 星期i -> 算一個星期的平均值
  var sum = 0;
  var mean = 0;
  
  for (j = 0; j < 24; j++) {
    sum += heatmap[i][j];
  }

  mean = sum / 24;
  return mean;  
}