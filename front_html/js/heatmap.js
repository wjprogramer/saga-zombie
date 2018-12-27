/* Get Data */
var date;

var heatmap = [
    // 日
    [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,  70,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 一
    [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 二
    [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 三
    [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 四
    [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 五
    [   0, 135,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, ],
    // 六
    [   0,   0,  90,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,  80,   0,   0,   0,   0,   0,   0,   0,   0,   0, ]
]

function createHeatMap() {
	date = new Date();

	var xmlhttp = new XMLHttpRequest();
	var push_count_of_week = [0, 0, 0, 0, 0, 0, 0,]; // sunday to saturday
	for (var count in push_count_of_week) {

	}
	var users_pushes_count_obj;
	var users_pushes_count_json;
	var today_progess = 0; // 取得今天的進度 ex: 正午12:00，為0.5
	today_progess = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) / 86400;

	var url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=7&ending_day=0";

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	  		// 取得星期日到六的資料
		  	for (i = 0; i < 7; i++) {
		  		if (i == 0) {
					url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=" + today_progess + "&ending_day=" + 0;
		  		} else {
		  			url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=" + (i+1) + "&ending_day=" + i;
		  		}
		  		console.log(url);

		  		users_pushes_count_obj = JSON.parse(this.responseText);
			    users_pushes_count_json = JSON.stringify(users_pushes_count_obj);
			    for (index in users_pushes_count_json)
			    {
			        if (users_pushes_count_obj[index]["username"] == document.getElementById('search').value) {
			        	var day = getDay(i);
			        	console.log("day: --- " + day);
			        	push_count_of_week[day] = users_pushes_count_obj[index]["count"];
			        	break;
			        }
			    }
		  	}
		  	console.log(push_count_of_week);
	  	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function getDay(i) {
	var day = (date.getDay() + 7 - i) % 7;
	return day;
}

/* PIXI */
var heatmap_colors = [0xFFFFD9, 0xEDF8B1, 0xC7E9B4, 0x7FCDBB, 0x41B6C4, 0x1D91C0, 0x225EA8, 0x253494, 0x081D58]

function getColor(value) {
  if (value < 2) {
    return heatmap_colors[0];
  } else if (value < 4) {
    return heatmap_colors[1];
  } else if (value < 5) {
    return heatmap_colors[2];
  } else if (value < 7) {
    return heatmap_colors[3];
  } else if (value < 26) {
    return heatmap_colors[4];
  } else if (value < 62) {
    return heatmap_colors[5];
  } else if (value < 99) {
    return heatmap_colors[6];
  } else if (value < 135) {
    return heatmap_colors[7];
  } else {
    return heatmap_colors[8]
  }
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
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application({
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

document.getElementById('heatmap').appendChild(app.view);

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
setup();
