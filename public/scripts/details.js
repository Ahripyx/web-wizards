// Written by: Hazel Miln
// Purpose: Gets and displays all NCR info in a readable format

// get the id of the NCR we are showing info of
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ncrId = parseInt(urlParams.get('id'));

// set all statuses to closed
document.getElementById("btnClose").addEventListener("click", async function(){

    const ncrResponse = await fetch(`http://localhost:5500/UpdateNCRStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'});
    const qaResponse = await fetch(`http://localhost:5500/UpdateQAStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'});
    const engResponse = await fetch(`http://localhost:5500/UpdateEngineerStatus?newStatus=Closed&id=${ncrId}`, { method: 'PUT'}); 

    getData();
});

// set the NCRform status to "archived"
document.getElementById("btnArchive").addEventListener("click", async function(){
    
    const response = await fetch(`http://localhost:5500/UpdateNCRStatus?newStatus=Archived&id=${ncrId}`, {
        method: 'PUT'
    });
    //getData();
});

// navigate to the edit page while passing the id of the NCR to be edited
document.getElementById("btnEdit").addEventListener("click", function(){
    window.location.href = `edit.html?id=${ncrId}`;
});

// function to get NCR data
async function getData() {

    //const ncrResponse = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const qaResponse = await fetch(`http://localhost:5500/ncrs/${ncrId}`);
    const engResponse = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const userResponse = await fetch(`http://localhost:5500/formusers/${ncrId}`);
    const purchasingResponse = await fetch(`http://localhost:5500/PurchasingFromNCR?ncrID=${ncrId}`)

    //const ncrJson = await ncrResponse.json();
    const qaJson = await qaResponse.json();
    const engJson = await engResponse.json();
    const userJson = await userResponse.json();
    const purJson = await purchasingResponse.json();

    //const ncrData = ncrJson[0];
    const qaData = qaJson[0];
    const engData = engJson[0];
    const userData= userJson[0];
    const purData = purJson[0];

    //console.log(ncrData);
    console.log(qaData);
    console.log(engData);
    console.log(userData);
    console.log(purData);

    console.log(qaData.NCRNumber);
    document.getElementById("ncrHeading").innerHTML +=qaData.NCRNumber;

    // quality assurance data
    document.getElementById("txtSupplierName").value = qaData.SupplierName;
    document.getElementById("txtNCRNumber").value = qaData.NCRNumber;
    // need an if statement here
    if (qaData.WorkInProgress == 1){
        document.getElementById("txtProcessApplicable").value = "Work in Progress";
    }
    else {
        document.getElementById("txtProcessApplicable").value = "Supplier or Rec-Insp";
    }
    document.getElementById("txtItemDescription").value = qaData.ProductName;
    document.getElementById("txtProductNumber").value = qaData.Number;
    document.getElementById("txtDefectDescription").value = qaData.Details;
    document.getElementById("txtSalesOrderNumber").value = qaData.SalesOrder;
    document.getElementById("txtQuantityReceived").value = qaData.QuantityReceived;
    document.getElementById("txtQuantityDefective").value = qaData.QuantityDefective;
    if (qaData.IsNonConforming == 1){
        document.getElementById("txtNonConforming").value = "Yes";
    }
    else{
        document.getElementById("txtNonConforming").value = "No";
    }
    // need user data
    // document.getElementById("txtQualityName").value = qaData.;
    document.getElementById("txtQualityDate").value = qaData.LastModified;

    // engineering data
    document.getElementById("txtReview").value = engData.Review;
    if (engData.NotifyCustomer == 1) {
        document.getElementById("txtNotification").value = "Yes";
    }
    else{
        document.getElementById("txtNotification").value = "No";
    }
    document.getElementById("txtDisposition").value = engData.Disposition;
    // field may be missing...
    // document.getElementById("txtDrawingUpdate").value = engData.;
    document.getElementById("txtOgVersionNumber").value = engData.RevisionNumber;
    // field may be missing
    // document.getElementById("txtNewVersionNumber").value = engData.;
    // user data required 
    //document.getElementById("txtEngName").value = engData.;
    document.getElementById("txtEngDate").value = engData.LastModified;

    // purchasing data
    document.getElementById("txtPrelimDecision").value = purData.PreliminaryDecision;
    document.getElementById("txtCARRaised").value = purData.CARRaised;
    document.getElementById("txtCARNumber").value = purData.CARNumber;
    document.getElementById("txtFollowUpTequired").value = purData.FollowUpRequired;
    document.getElementById("txtFollowUpType").value = purData.FollowUpType;
    document.getElementById("txtFollowUpDate").value = purData.FollowUpDate;
    // missing fields???
    //document.getElementById("txtAcceptable").value = purData.;
    //document.getElementById("txtNewNCR").value = purData.;

    // need user data
    //document.getElementById("txtPurchasingName").value = purData.;
    document.getElementById("txtPurchasingDate").value = purData.LastModified;
};

getData();