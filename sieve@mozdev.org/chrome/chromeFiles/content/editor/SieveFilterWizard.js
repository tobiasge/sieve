
function onTest()
{
  
    var str = document.getElementById("txtScript").value;  
    var dom  = new SieveDom("0");
    dom.parse(str);
    
    document.getElementById("txtScript2").value = dom.toString();
    
    document.getElementById("divContext").innerHTML = dom.toXUL();
}

function onExit()
{
  close();
}

function onParse()
{
  var aBox = document.getElementById("wizard");
  var button = document.createElement("button");
  button.setAttribute("label","A new Button");
//  "onParse()");
  aBox.appendChild(button);
  button.addEventListener("command", this.blubb, false);
//  button.oncommand = this.blubb;
  
  var s = "test";
  test(s)
  alert(s);
}

function test(s)
{
   s = "null";
}

function blubb()
{
  alert("blubb");
}

//window.openDialog("chrome://sieve/content/editor/SieveFilterWizard.xul", "FilterEditor", "chrome,titlebar,resizable,centerscreen");