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
        rowname = `${tablename}${row}`;
        table.innerHTML += `<tr id="${rowname}" class="light-cells"></tr>`;
        tablerow = document.getElementById(`${rowname}`);
        for (let item in element){
            
            // include NCR number in heading
            if (item == "NCRNumber"){
                document.getElementById('ncrHeading').innerHTML = `NCR#${element[item]}`;
            }
            if (item == "FormStatus" && element[item] == "Closed"){
                document.getElementById("btnClose").disabled = true;
                document.getElementById("btnEdit").disabled = true;
            }
            if (item == "FormStatus" && element[item] == "Archived"){
                document.getElementById("btnClose").disabled = true;
                document.getElementById("btnArchive").disabled = true;
                document.getElementById("btnEdit").disabled = true;
            }
             
            if (item.substr(-2).toUpperCase() == "ID"){
                
            }
            
            else{
                if (item == "SRInspection" || item == "WorkInProgress" || item == "IsNonConforming" || item == "NotifyCustomer" || item == "DrawingUpdateRequired"){
                    if(element[item] == 0){
                        tablerow.innerHTML += `<td>No</td>`;
                    }
                    else if(element[item] == 1){
                        tablerow.innerHTML += `<td>Yes</td>`;
                    }
                    else{
                        tablerow.innerHTML += `<td>UH OH</td>`;
                    }
                }
                else{
                    tablerow.innerHTML +=`<td>${element[item]}</td>`;
                }
            }
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

    ncrTable.innerHTML =`<tr class="shaded-cells">
                        <th>Creation Date</th>
                        <th>Last Modified</th>
                        <th>Form Status</th>
                        </tr>`;
    qaTable.innerHTML =`<tr class="shaded-cells">
                        <th>NCR Number</th>
                        <th>Supplier/Recieving Inspection?</th>
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

    const ncrResponse = await fetch(`http://localhost:5500/UpdateNCRStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'});
    const qaResponse = await fetch(`http://localhost:5500/UpdateQAStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'});
    const engResponse = await fetch(`http://localhost:5500/UpdateEngineerStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'}); 

    getData();
});

document.getElementById("btnArchive").addEventListener("click", async function(){
    
    const response = await fetch(`http://localhost:5500/UpdateNCRStatus?newStatus=Archived&id=${ncrId}`, {
        method: 'PUT'
    });
    getData();
});

document.getElementById("btnEdit").addEventListener("click", function(){
    window.location.href = `edit.html?id=${ncrId}`;
});