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
	} else if (option == "id") {
		createHeatMap();
		searchID();
		username = getName2();
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

// 顯示文字雲
$(function () {
  $.ajax({
          url: "https://ptt.imyz.tw/query/get_words_freq?beginning_day=8&ending_day=0",   //存取Json的網址
          type: "GET",
          dataType: 'json',
          success: function (data) {
                console.log(data.statistic);
                console.log(data.statistic[0]);
                data.statistic.forEach(function (element){
                element[1] = element[1]/100;
                console.log(element[1]);
          });
  var options = {
            "list" : data.statistic,
            "gridSize": 30, // size of the grid in pixels
            "weightFactor": 2, // number to multiply for size of each word in the list
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
  });
