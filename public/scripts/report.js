//Written by: Damion Murcell
//Purpose: Generate a PDF report of an NCR Form using an external source called jsPDF

document.getElementById('btnGenPDF').addEventListener('click', async function() {
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
    pdf.setFillColor(84,172,207);  
    pdf.roundedRect(10, 40, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(84,172,207);  
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
    pdf.setFillColor(31,189,31);
    pdf.roundedRect(10, 125, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(31,189,31); 
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
    pdf.setFillColor(255,143,162);  
    pdf.roundedRect(10, 210, 60, 30, 1, 1, 'F'); 
    pdf.setFillColor(255,143,162);
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
    } else {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(60, 250, `Purchasing data has not been filled out yet`);
    }

    const pdfDataUri = pdf.output('datauristring');

    //Redirect to the preview page and pass the PDF data via URL
    window.location.href = `preview.html?pdf=${encodeURIComponent(pdfDataUri)}`;
});