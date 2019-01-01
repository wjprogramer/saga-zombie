function loadUserList() {
	console.log("loadUserList");
	var url;
	url = "https://ptt.imyz.tw/query/get_users_pushes_count?beginning_day=" + 0.5 + "&ending_day=" + 0;

	var users_pushes_count_obj;
	var users_pushes_count_json;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	  		users_pushes_count_obj = JSON.parse(this.responseText);
		    users_pushes_count_json = JSON.stringify(users_pushes_count_obj);

		    for (index in users_pushes_count_json)
		    {
		    	if (users_pushes_count_obj[index] == undefined) {
		    		continue;
		    	}

		    	var para = document.createElement("p");
				var text = document.createTextNode(users_pushes_count_obj[index]["username"]);

				para.className = "item";
				// para.classList.add("");
				para.onclick = function() { window.location.href = "result.html?username=" + this.innerHTML; };
				para.appendChild(text);

				document.getElementById("user_list").appendChild(para);
		    }
	  	}
	};


	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

loadUserList();

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
