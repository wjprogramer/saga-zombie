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