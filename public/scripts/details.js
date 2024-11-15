// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ncrId = parseInt(urlParams.get('id'));
const table = document.getElementById("displayTable");

function fillTables(data){
    
    data.forEach(element =>{
        for (let item in element){
            if (item == "NCRNumber"){
                document.getElementById('h1').innerHTML = `NCR #${element[item]}`;
            }
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

async function getData(){

    const ncrRes = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const qaRes = await fetch(`http://localhost:5500/QualityFromNCR?ncrID=${ncrId}`);
    const engRes = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const ncrData = await ncrRes.json();
    const qaData = await qaRes.json();
    const engData = await engRes.json();

    table.innerHTML="";
    fillTables(ncrData);
    fillTables(qaData);
    fillTables(engData);     
};

getData();

document.getElementById("btnClose").addEventListener("click", async function(){
    // close quality first, and if quality is already closed, close engineer, if engineer is closed, set NCRFormStatus to "closed"
    console.log("Closed!")

    const engineerResponse = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const engineerData = await engineerResponse.json();
    console.log(engineerData);

    const qualityResponse = await fetch(`http://localhost:5500/QualityFromNCR?ncrID=${ncrId}`);
    const qualityData = await qualityResponse.json();
    console.log(qualityData);

    getData();
});

document.getElementById("btnArchive").addEventListener("click", async function(){

    const arch = "Archived";
    const response1 = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const wow = await response1.json();

    const response = await fetch(`http://localhost:5500/UpdateNCRStatus?newStatus=${arch}&id=${ncrId}`, {
        method: 'PUT'
    });
    getData();
});

document.getElementById("btnEdit").addEventListener("click", function(){
    window.location.href = `edit.html?id=${ncrId}`;
});