/* Get Data */
var date = Date();
var current_hour_progress = 0; // 取得今天的進度 ex: 正午12:00，為0.5
var heatmap = new Array();
var complete_number = 0;

for (var i = 0; i < 7; i++) {
  heatmap[i] = new Array();
}

for (var i = 0; i < 7; i++) {
  for (var j = 0; j < 24; j++) {
    heatmap[i][j]=0;
  }
}

function createHeatMap() {
	date = new Date();
	current_hour_progress = (date.getMinutes() * 60 + date.getSeconds()) / 86400;
  complete_number = 0;

	// 取得距離i天前的資料
	for (i = 0; i < 7; i++) {
    for(j = 0; j < 24; j++) {
      request(i, j);
    }
	}
}

function request(day, hour) {
	var url;
	url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=" + (current_hour_progress + ((hour + 1) / 24) + day) + "&ending_day=" + (current_hour_progress + (hour / 24) + day);

	// url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=" + 1 + "&ending_day=" + 0;

	var users_pushes_count_obj;
	var users_pushes_count_json;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
        complete_number++
        console.log(complete_number);

	  		users_pushes_count_obj = JSON.parse(this.responseText);
		    users_pushes_count_json = JSON.stringify(users_pushes_count_obj);
		    for (index in users_pushes_count_json)
		    {
		    	if (users_pushes_count_obj[index] == undefined) {
		    		continue;
		    	}
	        if (users_pushes_count_obj[index]["username"] == document.getElementById('search').value) {
	        	var d = getDay(day);
            var h = getHour(hour);
            heatmap[d][h] = users_pushes_count_obj[index]["count"];
            console.log("" + d + "/" + h + ":" + heatmap[d][h]);
	        	break;
	        }
		    }
	  	}
	};
  xmlhttp.addEventListener("load", function(e){
    if (complete_number == 7 * 24) 
      draw();
    else if (complete_number == 1) {
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
  });

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
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


