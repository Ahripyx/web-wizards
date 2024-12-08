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

// function to get NCR data
async function getData() {

    //const ncrResponse = await fetch(`http://localhost:5500/ncrFromID?ncrID=${ncrId}`);
    const qaResponse = await fetch(`http://localhost:5500/ncrs/${ncrId}`);
    const engResponse = await fetch(`http://localhost:5500/engineer/${ncrId}`);
    const userResponse = await fetch(`http://localhost:5500/formusers/${ncrId}`);
    const purchasingResponse = await fetch(`http://localhost:5500/purchasing/${ncrId}`)

    //const ncrJson = await ncrResponse.json();
    const qaJson = await qaResponse.json();
    let engData, purData;
    if (engResponse.ok)
        engData = await engResponse.json();
    if (purchasingResponse.ok)
        purData = await purchasingResponse.json();
    const userJson = await userResponse.json();

    //const ncrData = ncrJson[0];
    const qaData = qaJson[0];

    document.getElementById("ncrHeading").innerHTML +=qaData.NCRNumber;

    // user data
    userJson.forEach(item => {
        if (item.Title == "Inspector"){
            document.getElementById("txtQualityName").value = `${item.FName} ${item.LName}`;
        }
        else if (item.Title == "Engineer"){
            document.getElementById("txtEngName").value = `${item.FName} ${item.LName}`;
        }
        else if (item.Title == "Purchasing"){
            document.getElementById("txtPurchasingName").value = `${item.FName} ${item.LName}`; 
        }
        else{
            if (document.getElementById("txtQualityName").value == ""){
                document.getElementById("txtQualityName").value = `${item.FName} ${item.LName} (Administrator)`;
            }
            else if (document.getElementById("txtEngName").value == ""){
                document.getElementById("txtEngName").value = `${item.FName} ${item.LName} (Administrator)`;
            }
            else{
                document.getElementById("txtPurchasingName").value = `${item.FName} ${item.LName} (Administrator)`;
            }
        }
    });

    // quality assurance data
    document.getElementById("txtSupplierName").value = qaData.SupplierName;
    document.getElementById("txtNCRNumber").value = qaData.NCRNumber;
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
    
    document.getElementById("txtQualityDate").value = qaData.LastModified;

    // engineering data
    try{
        if (!engResponse.ok)
            throw new Error();
        document.getElementById("txtReview").value = engData.Review;
        if (engData.NotifyCustomer == 1) {
            document.getElementById("txtNotification").value = "Yes";
        }
        else{
            document.getElementById("txtNotification").value = "No";
        }
        document.getElementById("txtDisposition").value = engData.Disposition;
        
        // document.getElementById("txtDrawingUpdate").value = engData.;            DRAWING UPDATE FIELD IS MISSING
        // logic to display fields related to Drawing Updates
        console.log(document.getElementById("txtDrawingUpdate").value)
        if (document.getElementById("txtDrawingUpdate").value == ""){
            document.getElementById("txtDrawingUpdate").value = "No";
            document.getElementById("OGVersionNumber").hidden = true;
            document.getElementById("NewVersionNumber").hidden = true;
        }
        else{
            document.getElementById("txtOgVersionNumber").value = engData.RevisionNumber;
            // document.getElementById("txtNewVersionNumber").value = engData.;         NEW VERSION NUMBER FIELD MISSING
        }
        
        document.getElementById("txtEngDate").value = engData.LastModified;
    }
    catch{
        document.getElementById("engSection").style.display = 'none';
    }
    

    // purchasing data
    try{
        if (!purchasingResponse.ok)
            throw new Error();
        document.getElementById("txtPrelimDecision").value = purData.PreliminaryDecision;
        // logic to display fields related to CAR number
        if (engData.CARRaised == 1) {
            document.getElementById("txtCARRaised").value = "Yes";
            document.getElementById("txtCARNumber").value = purData.CARNumber;
        }
        else{
            document.getElementById("txtCARRaised").value = "No";
            document.getElementById("lblCARNumber").hidden = true;
        }
        // logic to show fields related to Follow Up
        if (purData.FollowUpRequired == 1) {
            document.getElementById("txtFollowUpTequired").value = "Yes";
            document.getElementById("txtFollowUpType").value = purData.FollowUpType;
            document.getElementById("txtFollowUpDate").value = purData.FollowUpDate;
        }
        else{
            document.getElementById("txtFollowUpTequired").value = "No";
            document.getElementById("lblfollowUpDate").hidden=true;
            document.getElementById("lblfollowUpType").hidden=true;
        }
        document.getElementById("txtPurchasingDate").value = purData.LastModified;
    }
    catch{
        document.getElementById("purSection").style.display = 'none';
    }   
};

getData();

// navigate to the edit page while passing the id of the NCR to be edited
document.getElementById("btnEdit").addEventListener("click", function(){
    window.location.href = `edit.html?id=${ncrId}`;
});

// hide the edit button if the user's title status is closed
async function checkStatus() {
    const userResponse = await fetch(`http://localhost:5500/formusers/${ncrId}`);
    const userJson = await userResponse.json();
    const qaResponse = await fetch(`http://localhost:5500/quality/${ncrId}`);
    const qaJson = await qaResponse.json();
    const engResponse = await fetch(`http://localhost:5500/EngineerFromNCR?ncrID=${ncrId}`);
    const engJson = await engResponse.json();
    const engData = engJson[0];
    const purResponse = await fetch(`http://localhost:5500/PurchasingFromNCR?ncrID=${ncrId}`);
    const purJson = await purResponse.json();
    const purData = purJson[0];

 //   console.log(qaData);
    userJson.forEach(item => {
        if (item.Title == "Inspector" && qaJson.QualityStatus == "Closed") {
            document.getElementById("btnEdit").style.display = 'none';
        }
        if (item.Title == "Engineer" && engData.EngineerStatus == "Closed") {
            document.getElementById("btnEdit").style.display = 'none';
        }
        if (item.Title == "Purchasing" && purData.PurchasingStatus == "Closed") {
            document.getElementById("btnEdit").style.display = 'none';
        }
    });
}

checkStatus();