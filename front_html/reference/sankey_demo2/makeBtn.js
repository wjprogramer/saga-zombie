function makeBtn(){
		var getNode = document.getElementById("make");
		var putNode = document.createElement("DIV");

		var input = "<input type='button' value='顯示區域圖' onclick='g_doSankey()'>"
		putNode.className ="changeBlock";
		putNode.innerHTML= input;
		 if(getNode.hasChildNodes() ) {
      while (getNode.firstChild) {
          getNode.removeChild(getNode.firstChild);
      }
    }

		getNode.appendChild(putNode);
	}
function deleBtn(){
	var getNode = document.getElementById("make");
	if(getNode.hasChildNodes() ) {
      while (getNode.firstChild) {
          getNode.removeChild(getNode.firstChild);
      }
    }
}