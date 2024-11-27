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

    console.log(engData);
    console.log(purData);

    const ncr = ncrData[0];
    const qa = qaData[0];
    const eng = engData[0];
    const pur = purData[0];


    //NOTE: Nums are the position of where text is, for example. (x, y, 'Your text here')

    // Title
    pdf.setFontSize(16);
    pdf.text(20, 10, `NCR Report: ${qa.NCRNumber}`);

    // General Info Section
    pdf.setFontSize(16);
    pdf.text(20, 20, 'NCR Info');
    pdf.setFontSize(12);
    pdf.text(20, 30, `Creation Date: ${ncr.CreationDate}`);
    pdf.text(20, 40, `Last Modified: ${ncr.LastModified}`);
    pdf.text(20, 50, `Form Status: ${ncr.FormStatus}`);

    // Quality Assurance Data
    pdf.setFontSize(16);
    pdf.text(20, 70, 'Quality Assurance');
    pdf.setFontSize(12);
    pdf.text(20, 80, `NCR Number: ${qa.NCRNumber}`);
    pdf.text(20, 90, `Sales Order Number: ${qa.SalesOrder}`);
    pdf.text(20, 100, `Supplier/Receiving Inspection: ${qa.SupplierInspection ? 'Yes' : 'No'}`);
    pdf.text(20, 110, `Work in Progress?: ${qa.WorkInProgress ? 'Yes' : 'No'}`);
    pdf.text(20, 120, `Item Description: ${qa.ItemDescription}`);
    pdf.text(20, 130, `Quantity Received: ${qa.QuantityReceived}`);
    pdf.text(20, 140, `Quantity Defective: ${qa.QuantityDefective}`);
    pdf.text(20, 150, `Is Item Non-Conforming: ${qa.IsNonConforming ? 'Yes' : 'No'}`);
    pdf.text(20, 160, `Defect Description: ${qa.Details}`);
    pdf.text(20, 170, `Quality Assurance Status: ${qa.QualityStatus}`);
    pdf.text(20, 180, `Last Modified by QA: ${qa.LastModified}`);

    // Engineering Data
    // TODO: Add some validation in case this section has not been filled out yet
    pdf.setFontSize(16);
    pdf.text(20, 200, 'Engineering Data');
    pdf.setFontSize(12);
    pdf.text(20, 210, `Review by CF Engineering: ${eng.Review}`);
    pdf.text(20, 220, `Notify Customer?: ${eng.NotifyCustomer ? 'Yes' : 'No'}`);
    pdf.text(20, 230, `Disposition: ${eng.Disposition}`);
    pdf.text(20, 240, `Version Number: ${eng.RevisionNumber}`);
    pdf.text(20, 250, `Revision Date: ${eng.RevisionDate}`);
    pdf.text(20, 260, `Engineering Status: ${eng.EngineerStatus}`);
    pdf.text(20, 270, `Last Modified by Engineering: ${eng.LastModified}`);

    //Purchasing Section (with validation)
    if (pur && pur.PreliminaryDecision) {
        pdf.setFontSize(16);
        pdf.text(20, 290, 'Purchasing Data');
        pdf.setFontSize(12);
        pdf.text(20, 300, `Preliminary Decision: ${pur.PreliminaryDecision}`);
        pdf.text(20, 310, `CAR Raised: ${pur.CARRaised ? 'Yes' : 'No'}`);
        pdf.text(20, 320, `CAR Number: ${pur.CARNumber}`);
        pdf.text(20, 330, `Follow Up Required: ${pur.FollowUpRequired ? 'Yes' : 'No'}`);
        pdf.text(20, 340, `Follow Up Type: ${pur.FollowUpType}`);
        pdf.text(20, 350, `Follow Up Date: ${pur.FollowUpDate}`);
        pdf.text(20, 360, `Purchasing Status: ${pur.PurchasingStatus}`);
        pdf.text(20, 370, `Last Modified by Purchasing: ${pur.LastModified}`);
    } 
    else {
        pdf.text(20, 290, 'Purchasing has not been filled out');
    }

    // Save the PDF
    pdf.save(`Report-${qa.NCRNumber}.pdf`);
});