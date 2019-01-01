var username = "";

// onload
function init() {
	// -- init variable
	// - load username via url
	var url = location.search;
	var Request = new Object();
	if(url.indexOf("?")!=-1) {
		var str = url.substr(1)　//去掉?号
		strs = str.split("&");
		for(var i=0;i<strs.length;i++){
			Request[strs[i ].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}

	legend();

	username = Request["username"];
	$("#analysis_result").html("查詢對象: " + username);

	// -- search
	document.getElementById("search").value = username;
	search('id');
}

/**
	in sankey/control.js
	function searchIP(), searchID(), getName()
	
	in heatmap.js
	createHeatMap()

	@param username: used for result.html
	@param userName: used for sankey (fun getName2)
*/
function search(option) {
	if (option == "ip") {
		searchIP(); 
	} else {
		createHeatMap();
		searchID();
		username = getName2();
		personal_wordcloud(username);
	}
}

// switch: ip / id search
function changeText(){
	if(document.getElementById("changeBut").value=="以IP進行找尋")
	{
	  document.getElementById("changeBut").value = "以ID進行找尋";
	  document.getElementById("changeBut").innerHTML = "以ID進行找尋";
	  document.getElementById("search").placeholder="eg:163.13.111.111";
	  document.getElementById("ipBtn").style.display="inline-block";
	  document.getElementById("idBtn").style.display="none";
	}
	else
	{
	  document.getElementById("changeBut").value="以IP進行找尋";
	  document.getElementById("changeBut").innerHTML = "以IP進行找尋";
	  document.getElementById("search").placeholder="eg:abc123123";
	  document.getElementById("ipBtn").style.display="none";
	  document.getElementById("idBtn").style.display="inline-block";
	}
}

function changeRamenHeight() {
	// if ($("#sankey").height() == 500) {
	// 	$("#sankey").height("1000px");
	// } else {
	// 	$("#sankey").height("500px");
	// }
}

// 處理動畫
(function($){
  	$(function(){
	    var carouselPlay = false;
	    //滾動到特定位置觸發動畫
	    $(window).scroll(function(){
	    	var windowHeight = $(window).height();
	    	var scrollTop = $(this).scrollTop();
			$('.animate-fade-in').each(function(){
				if(scrollTop + windowHeight - $(this).offset().top > 0 && scrollTop < $(this).offset().top)
					if(!$(this).hasClass("scrolled"))
						$(this).addClass("scrolled");
			})
		});
  }); // end of document ready
})(jQuery); // end of jQuery name space

// 處理圖例
function legend() {
	var legend_app = new PIXI.Application({
		  width: 700,         // default: 800
		  height: 30,        // default: 600
		  antialias: true,    // default: false
		  transparent: true, // default: false 透明度
		  resolution: 1,      // default: 1
		  preserveDrawingBuffer: true,
		  backgroundColor: 0x000000
		}
	);

	var legend_x = 0;
	var legend_y = 0;
	var legned_text_y = legend_y + 17;
	var legend_width = 60;
	var legend_height = 15;

	for(i = 0; i < 10; i++) {
		let rectangle = new Graphics();
		rectangle.beginFill(heatmap_colors[i]) // 填充顏色
		// rectangle.lineStyle(4, 0xFF3300, 1); // 寬度4 alpha為1
		rectangle.drawRect(legend_x, legend_y, legend_width, legend_height);
		rectangle.endFill(); // 結束繪製
		legend_app.stage.addChild(rectangle);

		var legned_message = new Text(heatmap_lower_bound[i], {fontSize: 10});
		legned_message.position.set(legend_x, legned_text_y);
	    legend_app.stage.addChild(legned_message);

	    legend_x += legend_width;
	}

	document.getElementById('legend').appendChild(legend_app.view);
}

// 顯示文字雲
function personal_wordcloud (username) {
$.ajax({  
      url: "https://ptt.imyz.tw/query/get_user_pushes_words_freq?username="+username,   //存取Json的網址
      type: "GET",
      dataType: 'json',
      success: function (data) {
            var yee_k = Object.keys(data);
            console.log(yee_k);
            var yee_v = Object.values(data);
            console.log(yee_v);
            yee = new Array();
            for(var i = 0; i < yee_v.length; i++){
              yee.push([yee_k[i],yee_v[i]]);
            }
              console.log(yee);

     
var options = {
        "list" : yee,
        "gridSize": 30, // size of the grid in pixels
        "weightFactor": 10, // number to multiply for size of each word in the list
        "fontWeight": 'normal', // 'normal', 'bold' or a callback
        "fontFamily": 'Times, serif', // font to use
        "color": 'random-light', // 'random-dark' or 'random-light'
        "backgroundColor": '#757575', // the color of canvas
        "rotateRatio": 1 // probability for the word to rotate. 1 means always rotate
      };
      // data.gridSize = 600;
      // data.weightFactor = 10;
      // data.fontWeight = 'normal';
      // data.fontFamily = 'Times, serif';
      // data.color = 'random-light';
      // data.backgroundColor = '#333';
      // data.rotateRatio = 'rotateRatio';
      // console.log(data);
      WordCloud.minFontSize = "15px";
      WordCloud(document.getElementById('word_cloud'), options );
    }

  });
};

