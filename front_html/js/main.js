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