var g_userName;
		var g_userIp;
		var g_slide;
		var count;
		var tempIp;
		var position;
		function g_doSankey(){
			//check();
			getUserName();
			var g_sankey = new Sankey();

			g_sankey.stack(0,g_getName());
			g_sankey.stack(1,g_getIp());
			g_sankey.setData(g_getSlide());
			
			g_sankey.draw();
			
			count = 0;
		}
		function getUserName(){
			for(var i=0;i<data_g.length;i++){
				for(var j=0;j<data_g[i][0].length;j++){
					if(data_g[i][0][j]==userName)
						position = i;

				}
			}
		}
		
		function g_getName(){
			g_userName = new Array();
			 for(var i=0;i<data_g[position][0].length;i++){
			 	g_userName[i] = data_g[position][0][i];
			}

			return g_userName;
		}
		function g_getIp(){
			g_userIp = new Array();
			for(var i=0;i<data_g[position][1].length;i++){
			 	g_userIp[i] = data_g[position][1][i];
			}
			
			return g_userIp;
		}
		function g_getSlide(){
			g_slide = new Array();
			tempIp = new Array();
			count =0;
			g_slide[count] = new Array();
			for(var i=0;i<g_userName.length;i++){
			 	
			 	for(var k=0;k<data_i.length;k++){
			 		if(g_userName[i]==data_i[k][1]){
				 		g_slide[count][0] = g_userName[i];
				 		g_slide[count][2] = data_i[k][0];
				 		g_slide[count][1] = data_i[k][2];
				 		count++;
				 		g_slide[count] = new Array();
			 		}

			 	}
			 	
			}
			return g_slide;
		}
		