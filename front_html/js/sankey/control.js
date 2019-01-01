	
var userIp;
var userAmount ;
var userName;

function searchID(){
	userIp = new Array();
	userAmount = new Array();
	userName = document.getElementById("search").value;

	clearSankey();
	
	if(userName =="")
		alert("Enter a legal ID");
	else
	{
		finduserName(userName);
   		doSankey();
	}
    
}
function searchIP(){
	userName = new Array();
	userAmount = new Array();
	userIp = document.getElementById("search").value;

	clearSankey();

	if(userIp =="")
		alert("Enter a legal IP");
	else
	{
		finduserIp(userIp);
   		doSankey2();
	}
    
}
function clearSankey() {
	document.getElementById("sankey").innerHTML = ''
}
function finduserName(userName){
	
	var userCount = 0;
	for(var i=0;i<data.length;i++){
		if(data[i][1]==userName)
		{
			userIp[userCount] = data[i][0];
			userAmount[userCount] = data[i][2];
			userCount++;
		}
	}

}
function finduserIp(userIp){
	
	var userCount = 0;
	for(var i=0;i<data.length;i++){
		if(data[i][0]==userIp)
		{
			
			userName[userCount] = data[i][1];
			userAmount[userCount] = data[i][2];
			userCount++;
		}
	}

}
function doSankey(){
	var sankey = new Sankey();
	sankey.stack(0,[getName(userName)]);
	sankey.stack(1,getIp());
	sankey.setData(getSlide());
	
	sankey.draw();
}
function doSankey2(){
	var sankey = new Sankey();
	sankey.stack(0,[getIp2(userIp)]);
	sankey.stack(1,getName2());
	sankey.setData(getSlide2());
	
	sankey.draw();
}
function getName(userName){
	return userName;
}
function getName2(){
	return userName;
}
function getIp(){
	return userIp;
}
function getIp2(userIp){
	return userIp;
}
function getSlide(){
	
	var slide  = new Array();
	for(var i=0;i<userIp.length;i++)
	{
		slide[i] = new Array();
		slide[i][0] = userName;
		slide[i][1] = userAmount[i];
		slide[i][2] = userIp[i];
	}
	return slide
}
function getSlide2(){
	
	var slide  = new Array();
	for(var i=0;i<userName.length;i++)
	{
		slide[i] = new Array();
		slide[i][0] = userIp;
		slide[i][1] = userAmount[i];
		slide[i][2] = userName[i];
	}
	return slide
}
