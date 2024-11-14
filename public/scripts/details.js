// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ncrId = parseInt(urlParams.get('id'));

async function getData(){

    const response = await fetch(`http://localhost:5500/AllInfo?id=${ncrId}`);
    const data = await response.json();

    
    const table = document.getElementById("displayTable");

    data.forEach(element =>{
        for (let item in element){
            if (item.substr(-2).toUpperCase() == "ID"){
                
            }
            else{
                if (item == "SRInspection" || item == "WorkInProgress" || item == "IsNonConforming" || item == "NotifyCustomer" || item == "DrawingUpdateRequired"){
                    if(element[item] == 0){
                        table.innerHTML += `<tr><td>${item}:</td><td>No</td></tr>`;
                    }
                    else if(element[item] == 1){
                        table.innerHTML += `<tr><td>${item}:</td><td>Yes</td></tr>`;
                    }
                    else{
                        table.innerHTML += `<tr><td>${item}:</td><td>UH OH</td></tr>`;
                    }
                }
                else{
                    table.innerHTML += `<tr><td>${item}:</td><td>${element[item]}</td></tr>`;
                }
                
            }  
        }
    });
};

getData();

document.getElementById("btnClose").addEventListener("click", function(){
    // close quality first, and if quality is already closed, close engineer, if engineer is closed, set NCRFormStatus to "closed"
    console.log("Closed!")
});

document.getElementById("btnArchive").addEventListener("click", function(){
    // close quality first, and if quality is already closed, close engineer, if engineer is closed, set NCRFormStatus to "closed"
    console.log("Archived!")
});

document.getElementById("btnEdit").addEventListener("click", function(){
    window.location.href = `edit.html?id=${ncrId}`;
});