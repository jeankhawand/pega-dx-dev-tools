function dragElement(element, direction, id1, id2)
{
    var   md; 
    const first  = document.getElementById(id1);
    const second = document.getElementById(id2);

    element.onmousedown = onMouseDown;

    function onMouseDown(e)
    {
        md = {e,
              offsetLeft:  element.offsetLeft,
              offsetTop:   element.offsetTop,
              firstWidth:  first.offsetWidth,
              secondWidth: second.offsetWidth
             };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e)
    {
        var delta = {x: e.clientX - md.e.clientX,
                     y: e.clientY - md.e.clientY};

        if (direction === "H" )
        {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                       md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
    }
}


dragElement( document.getElementById("separator"), "H" , "endpoint","details");
dragElement( document.getElementById("separator2"), "H" , "request","response");

var oldId = "";

function showDetails(){
if(oldId != ""){
    document.getElementById("req"+oldId).className="hide";
    document.getElementById("res"+oldId).className="hide";
    document.getElementById(oldId).className="endpointRow";
}
document.getElementById("req"+this.id).className="show";
document.getElementById("res"+this.id).className="show";
document.getElementById(this.id).className="endpointRowSelected";
oldId = this.id;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === "networkdata") {
        console.log(msg);
        const endpointTBody = document.getElementById("endpointTBody");
        const row = document.createElement("tr");
        row.setAttribute("id",msg.id);
        row.setAttribute("class","endpointRow");
        const cell = document.createElement("td");
        const anchorTag = document.createElement("a");
        const cellText = document.createTextNode(msg.details.request.url);
        anchorTag.appendChild(cellText);
        cell.appendChild(anchorTag);
        row.appendChild(cell);
        endpointTBody.appendChild(row);
        const requestTBody = document.getElementById("requestTBody");
        
        const reqRow = document.createElement("tr");
        reqRow.setAttribute("id","req"+msg.id);
        reqRow.setAttribute("class","hide");
        const reqCell = document.createElement("td");
        const ul = document.createElement("ul");  
        const li = document.createElement("li");
        const reqCellText = document.createTextNode("Method : "+msg.details.request.method);
        li.appendChild(reqCellText);
        ul.appendChild(li);

        msg.details.request.headers.map((ele,index)=>{
            const li = document.createElement("li");
            const reqCellText = document.createTextNode(ele.name+":"+ele.value);
            li.appendChild(reqCellText);
            ul.appendChild(li);
        });     
                
        reqCell.appendChild(ul);
        reqRow.appendChild(reqCell);
        requestTBody.appendChild(reqRow);
        const responseTBody = document.getElementById("responseTBody");
        const resRow = document.createElement("tr");
        resRow.setAttribute("id","res"+msg.id);
        resRow.setAttribute("class","hide");
        const resCell = document.createElement("td");
        const rul = document.createElement("ul");  
        const rli = document.createElement("li");
        const resCellText = document.createTextNode("Status Code : "+msg.details.response.status+"-"+msg.details.response.httpVersion);
        rli.appendChild(resCellText);
        rul.appendChild(rli);
        msg.details.response.headers.map((ele,index)=>{
            const li = document.createElement("li");
            const resCellText = document.createTextNode(ele.name+":"+ele.value);
            li.appendChild(resCellText);
            rul.appendChild(li);
        });
        resCell.appendChild(rul);
        const bodyCell = document.createElement("p");
        const bodyTextNode = document.createTextNode("ResponseBody : "+msg.body);
        bodyCell.appendChild(bodyTextNode);
        resCell.appendChild(bodyCell)
        resRow.appendChild(resCell);
        responseTBody.appendChild(resRow);
        document.getElementById(msg.id).addEventListener("click", showDetails);
     
    }
  });