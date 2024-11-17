// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ncrId = parseInt(urlParams.get('id'));
const ncrTable = document.getElementById("ncrTable");
const qaTable = document.getElementById("qaTable");
const engTable = document.getElementById("engTable");

function fillTables(tablename, data, table){
    row = 0;
    data.forEach(element =>{
        rowname = 
        table.innerHTML += `<tr id="${}"></tr>`;
        tablerow = document.getElementById(`${row}`);
        for (let item in element){
            
            // include NCR number in heading
            if (item == "NCRNumber"){
                document.getElementById('h1').innerHTML = `NCR #${element[item]}`;
            }
             
            if (item.substr(-2).toUpperCase() == "ID"){
                
            }
            
            else{
                if (item == "SRInspection" || item == "WorkInProgress" || item == "IsNonConforming" || item == "NotifyCustomer" || item == "DrawingUpdateRequired"){
                    if(element[item] == 0){
                        tablerow.innerHTML += `<td class="light-cells">No</td>`;
                    }
                    else if(element[item] == 1){
                        tablerow.innerHTML += `<td class="light-cells">Yes</td>`;
                    }
                    else{
                        tablerow.innerHTML += `<td class="light-cells">UH OH</td>`;
                    }
                }
                else{
                    tablerow.innerHTML +=`<td>${element[item]}</td>`
                }
            }
            /*
            else{
                if (item == "SRInspection" || item == "WorkInProgress" || item == "IsNonConforming" || item == "NotifyCustomer" || item == "DrawingUpdateRequired"){
                    if(element[item] == 0){
                        table.innerHTML += `<tr><td class="shaded-cells">${labelList[count]}</td><td class="light-cells">No</td></tr>`;
                    }
                    else if(element[item] == 1){
                        table.innerHTML += `<tr><td class="shaded-cells">${labelList[count]}</td><td class="light-cells">Yes</td></tr>`;
                    }
                    else{
                        table.innerHTML += `<tr><td class="shaded-cells">${labelList[count]}</td><td class="light-cells">UH OH</td></tr>`;
                    }
                }
                else{
                    table.innerHTML += `<tr><td class="shaded-cells">${labelList[count]}</td><td class="light-cells">${element[item]}</td></tr>`;
                }
            } 
            */   
        } 
        row++
    });
}; 

async function getData(){

    const ncrRes = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const qaRes = await fetch(`http://localhost:5500/QualityFromNCR?ncrID=${ncrId}`);
    const engRes = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const ncrData = await ncrRes.json();
    const qaData = await qaRes.json();
    const engData = await engRes.json();
    /*
    const ncrLabels = ["Creation Date:", "Last Modified:", "Form Status:"];
    const qaLabels = ["NCR Number", "SRInspection", "Work in Progress?", "Item Description:", "Quantity Recieved:" , "Quantity Defective:", "Is item Non-Conforming?", "Defect Description", "Quality Assurance Status:", "Last Modified by Quality Assurance:"];
    const engLabels = ["Review by CF Engineering:", "Notify Customer?", "Disposition:", "Version Number:", "Revision Date:", "Engineering Status:", "Last Modified by Engineering:"]
    */

    ncrTable.innerHTML =`<tr class="shaded-cells">
                        <th>Creation Date</th>
                        <th>Last Modified</th>
                        <th>Form Status</th>
                        </tr>`;
    qaTable.innerHTML =`<tr class="shaded-cells">
                        <th>NCR Number</th>
                        <th>SRInspection</th>
                        <th>Work in Progress?</th>
                        <th>Item Description</th>
                        <th>Quantity Recieved</th>
                        <th>Quantity Defective</th>
                        <th>Is item Non-Conforming</th>
                        <th>Defect Description</th>
                        <th>Quality Assurance Status</th>
                        <th>Last Modified by Quality Assurance</th>
                        </tr>`;
    engTable.innerHTML =`<tr class="shaded-cells">
                        <th>Review by CF Engineering</th>
                        <th>Notify Customer?</th>
                        <th>Disposition</th>
                        <th>Version Number</th>
                        <th>Revision Date</th>
                        <th>Engineering Status</th>
                        <th>Last Modified by Engineering</th>
                        </tr>`;
    fillTables("form", ncrData, ncrTable);
    fillTables("qa", qaData, qaTable);
    fillTables("eng", engData, engTable);     
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