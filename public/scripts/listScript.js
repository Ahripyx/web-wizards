// Written by: Hazel Miln
// Purpose: 


const user = JSON.parse(localStorage.getItem("user"));
    


const { jsPDF } = window.jspdf;
async function filltables(data, table){
    table.innerHTML = ` 
    <tr class="shaded-cells">
        <th>NCR</th>
        <th>Supplier</th>                
        <th>Status</th>
        <th>Date</th>
        <th></th>
        <th></th>
        <th></th>
    </tr>`;
    
    var tabindex = 25;
    var row = 0;

    data.forEach(element => {
        if (row % 2 == 1){
            table.innerHTML += `<tr id="${element.id}" class="light-cells"></tr>`;
        }
        else{
            table.innerHTML += `<tr id="${element.id}"></tr>`;
        }

        var tablerow = document.getElementById(element.id);

        //Only shows a button download element if form status is closed
        const downloadButtonHTML = (element.FormStatus === "Closed")
            ? `<button class="download-btn info" data-id="${element.id}" tabindex=${tabindex+15}>Download</button>`
            : '';
        tablerow.innerHTML =
            `
            <td class="table-borders" tabindex="${tabindex++}">${element.NCRNumber}</td>
            <td class="table-borders" tabindex="${tabindex++}">${element.SupplierName}</td>
            <td class="table-borders" tabindex="${tabindex++}">${element.FormStatus}</td>
            <td class="table-borders" tabindex="${tabindex++}">${element.CreationDate}</td>
            <td class="table-borders"><a href="details.html?id=${element.id}" tabindex="-1"><button class="info" tabindex="${tabindex++}">Details</button></a></td>
            <td class="table-borders">${checkEdit(element.id, tabindex)}</td>
            <td class="table-borders">${downloadButtonHTML}</td>
            `;
        
        tabindex += 20;
        row++;
    });

    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const ncrId = this.getAttribute('data-id');
            // Call generatePDF function when the button is clicked
            await generatePDF(ncrId);
        });
    });
};    

async function getData(){

    const response = await fetch(`http://localhost:5500/FilterSummaryInfo?supplierFilter=&status=Open&date1=0001-01-01&date2=9999-12-12`);
    const data = await response.json();
    const table = document.getElementById("table");

    filltables(data, table);
};

getData();

document.getElementById("btnFilter").addEventListener("click", async function(){
        
    const supplier = document.getElementById("filterSupplier").value;

    const ddl = document.getElementById("filterStatus");
    const status = ddl.options[ddl.selectedIndex].value;

    var date1 = document.getElementById("dateBox1").value;
    var date2 = document.getElementById("dateBox2").value;

    if (date1 == ''){
        date1 = '0001-01-01';
        
    }
    if(date2 == ''){
        date2 = '9999-12-12';
    }

    const response = await fetch(`http://localhost:5500/FilterSummaryInfo?supplierFilter=${supplier}&status=${status}&date1=${date1}&date2=${date2}`);
    const data = await response.json();
    const table = document.getElementById("table");

    filltables(data, table);
});

document.getElementById("")


//PDF Generation
async function generatePDF(ncrId) {
    const pdf = new jsPDF(); 

    const ncrRes = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const qaRes = await fetch(`http://localhost:5500/QualityFromNCR?ncrID=${ncrId}`);
    const engRes = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const purRes = await fetch(`http://localhost:5500/PurchasingFromNCR?ncrID=${ncrId}`);

    const ncrData = await ncrRes.json();
    const qaData = await qaRes.json();
    const engData = await engRes.json();
    const purData = await purRes.json();

    const ncr = ncrData[0];
    const qa = qaData[0];
    const eng = engData[0];
    const pur = purData[0];


    //NOTE: Nums are the position of where text is, for example. (x, y, 'Your text here')
    const formHeight = 70; 

    // Title
    pdf.setFontSize(40);
    pdf.setFont('helvetica', 'bold');
    pdf.text(34, 17, `NCR Report: ${qa.NCRNumber}`);

    // General Info Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(7, 30, `Creation Date: ${ncr.CreationDate}`);
    pdf.text(85, 30, `Last Modified: ${ncr.LastModified}`);
    pdf.text(162, 30, `Status: ${ncr.FormStatus}`);

    pdf.roundedRect(5, 35, 200, 1, 1, 1, 'F'); 

    //Light blue background for QA
    pdf.setFillColor(173, 216, 230); 
    pdf.roundedRect(10, 40, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(173, 216, 230); 
    pdf.roundedRect(10, 50, 190, formHeight, 1, 1, 'F'); 
    
    //Inputing QA Info
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(17, 47, 'Quality Assurance');

    // Quality Assurance Data
    if (qa){
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(20, 60, `Supplier Name:`)
        pdf.text(100, 60, `NCR Number: ${qa.NCRNumber}`);
        pdf.text(20, 70, `Sales Order Number: ${qa.SalesOrder}`);
        pdf.text(100, 70, `Supplier/Receiving Inspection: ${qa.SupplierInspection ? 'Yes' : 'No'}`);
        pdf.text(20, 80, `Work in Progress?: ${qa.WorkInProgress ? 'Yes' : 'No'}`);
        pdf.text(100, 80, `Item Description: ${qa.ItemDescription}`);
        pdf.text(20, 90, `Quantity Received: ${qa.QuantityReceived}`);
        pdf.text(100, 90, `Quantity Defective: ${qa.QuantityDefective}`);
        pdf.text(20, 100, `Is Item Non-Conforming: ${qa.IsNonConforming ? 'Yes' : 'No'}`);
        pdf.text(100, 100, `Defect Description: ${qa.Details}`);
        pdf.text(20, 110, `Quality Assurance Status: ${qa.QualityStatus}`);
        pdf.text(100, 110, `Last Modified by QA: ${qa.LastModified}`);
    
    }else{
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(60, 80, `Quality Assurance data has not been filled out yet`)
    }

    //light green background for Engineering
    pdf.setFillColor(144, 238, 144); 
    pdf.roundedRect(10, 125, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(144, 238, 144); 
    pdf.roundedRect(10, 135, 190, formHeight, 1, 1, 'F'); 

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(17, 133, 'Engineering Data');

    // Engineering Data
    if(eng){
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(20, 145, `Review by CF Engineering: ${eng.Review}`);
        pdf.text(100, 145, `Notify Customer?: ${eng.NotifyCustomer ? 'Yes' : 'No'}`);
        pdf.text(20, 155, `Disposition: ${eng.Disposition}`);
        pdf.text(100, 155, `Version Number: ${eng.RevisionNumber}`);
        pdf.text(20, 165, `Revision Date: ${eng.RevisionDate}`);
        pdf.text(100, 165, `Engineering Status: ${eng.EngineerStatus}`);
        pdf.text(20, 175, `Last Modified by Engineering: ${eng.LastModified}`);
    }else{
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(60, 155, `Engineering data has not been filled out yet`);
    }

    //light pink background for Purchasing
    pdf.setFillColor(255, 192, 203); 
    pdf.roundedRect(10, 210, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(255, 192, 203); 
    pdf.roundedRect(10, 220, 190, formHeight, 1, 1, 'F'); 

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(17, 217, 'Purchasing Data');

    //Purchasing
    if (pur) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(20, 230, `Preliminary Decision: ${pur.PreliminaryDecision}`);
        pdf.text(100, 230, `CAR Raised: ${pur.CARRaised ? 'Yes' : 'No'}`);
        pdf.text(20, 240, `CAR Number: ${pur.CARNumber}`);
        pdf.text(100, 240, `Follow Up Required: ${pur.FollowUpRequired ? 'Yes' : 'No'}`);
        pdf.text(20, 250, `Follow Up Type: ${pur.FollowUpType}`);
        pdf.text(100, 250, `Follow Up Date: ${pur.FollowUpDate}`);
        pdf.text(20, 260, `Purchasing Status: ${pur.PurchasingStatus}`);
        pdf.text(100, 260, `Last Modified by Purchasing: ${pur.LastModified}`);
        //ISSUE: Unknown error is happening when even one of these values are being displayed
        //in preview.html, only works when it's downloading
    } else {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(60, 250, `Purchasing data has not been filled out yet`);
    }
    
    pdf.save(`NCR-${qa.NCRNumber}`)
    //return pdf.output('datauristring');
}

function checkEdit(ncrId, tabindex) {
    let edit = ``;
    tabindex++;

    // https://www.w3schools.com/xml/xml_http.asp
    const qaRequest = new XMLHttpRequest();
    qaRequest.open('GET', `http://localhost:5500/quality/${ncrId}`, false);
    qaRequest.send();
    const qaJson = JSON.parse(qaRequest.responseText);

    const engRequest = new XMLHttpRequest();
    engRequest.open('GET', `http://localhost:5500/engineer/${ncrId}`, false);
    engRequest.send();
    const engJson = engRequest.status === 200 ? JSON.parse(engRequest.responseText) : null;

    const purRequest = new XMLHttpRequest();
    purRequest.open('GET', `http://localhost:5500/purchasing/${ncrId}`, false);
    purRequest.send();
    const purJson = purRequest.status === 200 ? JSON.parse(purRequest.responseText) : null;


    if (qaJson)
    {
        if ((user.RoleID == 2 || user.RoleID == 1) && qaJson.QualityStatus == "Open")
            edit = `<a href="edit.html?id=${ncrId}" tabindex="-1"><button class="info" tabindex="${tabindex}">Edit</button></a>`;
    }
    if (engJson)
    {
        if ((user.RoleID == 3 || user.RoleID == 1) && engJson.EngineerStatus == "Open")
            edit = `<a href="edit.html?id=${ncrId}" tabindex="-1"><button class="info" tabindex="${tabindex}">Edit</button></a>`;
    }
    if (purJson)
    {
        if ((user.RoleID == 4 || user.RoleID == 1) && purJson.PurchasingStatus == "Open")
            edit = `<a href="edit.html?id=${ncrId}" tabindex="-1"><button class="info" tabindex="${tabindex}">Edit</button></a>`;
    }

    return edit;
}