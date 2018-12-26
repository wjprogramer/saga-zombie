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