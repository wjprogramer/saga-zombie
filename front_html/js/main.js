function loadUserList() {
	console.log("loadUserList");
	var url;
	url = "https://ptt.imyz.tw/query/get_users_activities_hours?beginning_day=" + 8 + "&ending_day=" + 0;

	var users_pushes_count_obj;
	var users_pushes_count_json;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	  		users_pushes_count_obj = JSON.parse(this.responseText);
		    users_pushes_count_json = JSON.stringify(users_pushes_count_obj);

        for (user_obj in users_pushes_count_obj[0]) {
          var flag = true;
          var count_of_week = new Array();

          for (var i = 0; i < 7; i++) {
            count_of_week[i] = 0;
          }

          count_of_week[0] = users_pushes_count_obj[0][user_obj];

          for (index in users_pushes_count_json) {
            if (users_pushes_count_obj[index] == undefined) {
              continue;
            }

            if (flag) {
              flag = false;
              continue;
            }

            for (test_obj in users_pushes_count_obj[index]) {
              if (users_pushes_count_obj[index] == undefined) { continue; }
              if (test_obj == undefined ) { continue; }
              if (test_obj == user_obj) {
                count_of_week[index] = users_pushes_count_obj[index][user_obj];
                break;
              }
            }
          }

          console.log("count_of_week: " + count_of_week);

          var item_container = document.createElement("div");
          item_container.onclick = function() { window.location.href = "result.html?username=" + this.innerHTML; };
          item_container.className = "item";

          var para = document.createElement("p");
          var text = document.createTextNode(user_obj);
          // para.classList.add("");
          para.appendChild(text);

          var count_info = document.createElement("p");
          count_info.style.cssText = "display: block; margin-right: 0px;";
          count_info.className = "w3-right";

          var count_text = "";
          for (i = 0; i < 7; i++) {
            if (i == 0) {
              count_text += count_of_week[i];
            } else {
              count_text += " / " + count_of_week[i];
            }
          }
          var count_text_node = document.createTextNode(count_text);
          count_info.appendChild(count_text_node);

          document.getElementById("item_container").appendChild(para);
          document.getElementById("item_container").appendChild(count_info);



          document.getElementById("user_list").appendChild(item_container);
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
